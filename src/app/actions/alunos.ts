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
  const turmaId = formData.get('turma_id') as string || null

  const { data, error } = await supabase.rpc('criar_aluno', {
    p_nome: nome,
    p_matricula: matricula,
    p_cpf: cpf,
    p_periodo: periodo,
    p_turma_id: turmaId
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/alunos')
  return { success: true, matricula }
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
  revalidatePath('/dashboard/alunos')
  return { success: true }
}
