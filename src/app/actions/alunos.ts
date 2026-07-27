'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function criarAluno(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const nome = formData.get('nome') as string
  const matricula = formData.get('matricula') as string
  const cpf = formData.get('cpf') as string
  const periodo = formData.get('periodo') as string
  const turma_id = formData.get('turma_id') as string

  try {
    // Create auth user via admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: `${matricula}@aluno.unig.edu.br`,
      password: 'unig2026',
      email_confirm: true,
      user_metadata: { nome, role: 'aluno' }
    })
    if (authError) return { error: authError.message }
    if (!authData?.user) return { error: 'Erro ao criar usuário' }

    const uid = authData.user.id

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: uid, nome, email: `${matricula}@aluno.unig.edu.br`,
      role: 'aluno', matricula, cpf, periodo
    })
    if (profileError) return { error: profileError.message }

    // Link to turma
    if (turma_id) {
      await supabase.from('turma_alunos').insert({
        turma_id, aluno_id: uid, matricula
      })
    }

    revalidatePath('/dashboard/alunos')
    return { success: true, matricula }
  } catch (err: any) {
    return { error: err.message || 'Erro interno' }
  }
}

export async function atualizarAluno(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const nome = formData.get('nome') as string
  const cpf = formData.get('cpf') as string
  const periodo = formData.get('periodo') as string

  const { error } = await supabase.from('profiles').update({ nome, cpf, periodo }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/alunos')
  return { success: true }
}

export async function excluirAluno(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  await supabase.from('turma_alunos').delete().eq('aluno_id', id)
  await supabase.from('profiles').delete().eq('id', id)
  // Note: auth.users deletion requires admin API - handles soft delete via profile removal
  
  revalidatePath('/dashboard/alunos')
  return { success: true }
}
