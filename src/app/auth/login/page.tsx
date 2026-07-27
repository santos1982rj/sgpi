'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const res = await login(form)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a1628]">
      {/* Left side - branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#162a4a]">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[rgba(79,195,247,0.08)] -top-40 -right-40" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[rgba(26,75,140,0.15)] -bottom-20 -left-20" />
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center font-extrabold text-lg text-white shadow-lg">
            SG
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">UNIG</h1>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Universidade Iguaçu</span>
          </div>
        </div>

        <h2 className="text-5xl font-extrabold text-white leading-tight relative z-10 tracking-tight">
          Gestão de{' '}
          <span className="bg-gradient-to-r from-[#4fc3f7] to-[#b3e5fc] bg-clip-text text-transparent">
            Projetos Integradores
          </span>
          <br />
          sem papel, sem planilhas.
        </h2>
        <p className="text-gray-400 text-lg mt-6 max-w-lg relative z-10 leading-relaxed">
          Cadastro de turmas, formação de grupos, envio de documentação e avaliação dos projetos em um único ambiente digital.
        </p>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center font-extrabold text-white">SG</div>
          <div>
            <div className="font-extrabold text-[#0a1628]">UNIG</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest">Universidade Iguaçu</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1a1a2e]">Acessar o SGPI</h2>
        <p className="text-gray-400 text-sm mt-1 mb-8">Entre com suas credenciais institucionais.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">E-mail</label>
            <input
              name="email"
              type="email"
              required
              defaultValue="coordenacao@unig.br"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-[rgba(37,99,235,0.1)] outline-none transition-all"
              placeholder="seu@unig.br"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Senha</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-[rgba(37,99,235,0.1)] outline-none transition-all"
              placeholder="Sua senha"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#2563eb] to-[#1a4b8c] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no SGPI'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-8">
          Ambiente acadêmico — UNIG 2026.2
        </p>
      </div>
    </div>
  )
}
