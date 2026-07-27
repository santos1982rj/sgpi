'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const supabase = await createClient()
  const login = formData.get('login') as string
  const password = formData.get('password') as string

  let email = login
  if (/^\d{9,}$/.test(login.trim())) {
    email = `${login.trim()}@aluno.unig.edu.br`
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenciais inválidas' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
