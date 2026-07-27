'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    let email = login

    // If login looks like a matrícula (only numbers), convert to institutional email
    if (/^\d{9,}$/.test(login.trim())) {
      email = `${login.trim()}@aluno.unig.edu.br`
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (authError) {
      setError('Matrícula/email ou senha inválidos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a1628] via-[#0f2040] to-[#1a3a5c] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #4fc3f7 0%, transparent 50%), radial-gradient(circle at 75% 50%, #2563eb 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center max-w-md px-8">
          <div className="text-6xl mb-6 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4fc3f7] to-white tracking-tight">SGPI</div>
          <p className="text-gray-400 text-lg leading-relaxed">
            Gestão de Projetos Integradores<br />
            <span className="text-sm text-gray-600">Universidade Iguaçu — 2026.2</span>
          </p>
          <div className="mt-12 space-y-3 text-left">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Admin / Coordenação</p>
              <p className="text-sm text-gray-300">Use seu e-mail institucional</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Aluno</p>
              <p className="text-sm text-gray-300">Digite apenas o número da matrícula</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <div className="text-4xl font-bold text-white mb-2">SGPI</div>
            <p className="text-gray-500 text-sm">Universidade Iguaçu</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-blue-500/20">SG</div>
            </div>
            <h1 className="text-xl font-bold text-center text-gray-900 mb-1">Acessar o SGPI</h1>
            <p className="text-sm text-center text-gray-500 mb-8">Sistema de Gestão de Projetos Integradores</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Matrícula ou E-mail</label>
                <input value={login} onChange={e => setLogin(e.target.value)} required autoFocus
                  placeholder="Ex: 230026043 ou coordenacao@unig.br"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Senha</label>
                <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required
                  placeholder="Sua senha"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 transition-all" />
              </div>
              {error && (
                <div className="text-red-600 text-sm font-medium bg-red-50 rounded-xl px-4 py-3">{error}</div>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white rounded-xl font-semibold text-sm hover:from-[#1d4ed8] hover:to-[#1e40af] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
