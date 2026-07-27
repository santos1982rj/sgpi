'use client'

import { useState } from 'react'
import { ArrowLeft, Save, User, Lock, Bell, Palette, Shield } from 'lucide-react'
import Link from 'next/link'

export default function ConfiguracoesPage() {
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Configurações</h1>
      <p className="text-sm text-gray-500 mb-8">Gerencie as configurações do sistema SGPI</p>

      <div className="space-y-6">
        {/* Perfil */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center"><User className="h-5 w-5 text-white" /></div>
            <h2 className="text-lg font-bold text-gray-900">Perfil da Instituição</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Instituição</label>
              <input defaultValue="Universidade Iguaçu" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sigla</label>
              <input defaultValue="UNIG" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Semestre Atual</label>
              <input defaultValue="2026.2" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">E-mail de Contato</label>
              <input defaultValue="coordenacao@unig.br" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
            </div>
          </div>
        </div>

        {/* Pesos das Notas */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#d97706] flex items-center justify-center"><Palette className="h-5 w-5 text-white" /></div>
            <h2 className="text-lg font-bold text-gray-900">Critérios de Avaliação</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Peso P1 — Documentação (%)</label>
              <div className="flex items-center gap-3">
                <input type="range" min="0" max="100" defaultValue="40" className="flex-1 accent-[#2563eb]" />
                <span className="text-sm font-bold text-gray-900 w-10 text-right">40%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Peso P2 — Apresentação (%)</label>
              <div className="flex items-center gap-3">
                <input type="range" min="0" max="100" defaultValue="60" className="flex-1 accent-[#2563eb]" />
                <span className="text-sm font-bold text-gray-900 w-10 text-right">60%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">A nota final é calculada como: P1 × peso + P2 × peso. A soma dos pesos deve ser 100%.</p>
        </div>

        {/* Prazos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#34d399] to-[#059669] flex items-center justify-center"><Lock className="h-5 w-5 text-white" /></div>
            <h2 className="text-lg font-bold text-gray-900">Prazos do Ciclo</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Formação de Grupos', inicio: '05/08/2026', fim: '18/08/2026' },
              { label: 'Envio da Proposta', inicio: '19/08/2026', fim: '15/09/2026' },
              { label: 'Desenvolvimento', inicio: '16/09/2026', fim: '10/11/2026' },
              { label: 'Relatório Final', inicio: '11/11/2026', fim: '24/11/2026' },
              { label: 'Apresentações', inicio: '25/11/2026', fim: '02/12/2026' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-gray-50">
                <span className="text-sm font-medium text-gray-700 min-w-[160px]">{item.label}</span>
                <div className="flex items-center gap-2 text-sm">
                  <input defaultValue={item.inicio} className="w-28 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-[#2563eb] outline-none bg-white" />
                  <span className="text-gray-400">até</span>
                  <input defaultValue={item.fim} className="w-28 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-[#2563eb] outline-none bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center"><Shield className="h-5 w-5 text-white" /></div>
            <h2 className="text-lg font-bold text-gray-900">Segurança</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#2563eb]" />
              <div>
                <div className="text-sm font-medium text-gray-900">Exigir confirmação de e-mail</div>
                <div className="text-xs text-gray-500">Alunos precisam confirmar o e-mail antes de acessar</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[#2563eb]" />
              <div>
                <div className="text-sm font-medium text-gray-900">Bloquear envios fora do prazo</div>
                <div className="text-xs text-gray-500">Impedir upload de arquivos após a data limite</div>
              </div>
            </label>
          </div>
        </div>

        {/* Salvar */}
        <div className="flex justify-end">
          <button onClick={save} className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] transition-all shadow-sm">
            <Save className="h-4 w-4" /> {saved ? '✅ Salvo!' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  )
}
