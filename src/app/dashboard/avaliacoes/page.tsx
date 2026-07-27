'use client'

import { useState } from 'react'
import { ArrowLeft, Send, FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AvaliacoesPage() {
  const supabase = createClient()
  const [form, setForm] = useState({ grupo: '', etapa: 'P1', nota: '', feedback: '' })
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  const save = async () => {
    if (!form.nota || !form.grupo) return
    setStatus('saving')
    const { error } = await supabase.from('avaliacoes').insert({
      grupo_id: form.grupo,
      etapa: form.etapa,
      nota: parseFloat(form.nota),
      feedback: form.feedback || null,
    })
    setStatus(error ? 'error' : 'done')
    if (!error) {
      setForm({ ...form, nota: '', feedback: '' })
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Avaliações</h1>
      <p className="text-sm text-gray-500 mb-8">Lançamento de notas dos Projetos Integradores</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Lançar Nota</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Grupo</label>
              <select value={form.grupo} onChange={e => setForm({ ...form, grupo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none bg-white">
                <option value="">Selecione...</option>
                <option value="g01">G01 — Fundações em solo residual</option>
                <option value="g02">G02 — Contenção de taludes</option>
                <option value="g03">G03 — Patologia em pontes</option>
                <option value="g04">G04 — Reaproveitamento de águas</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Etapa</label>
                <select value={form.etapa} onChange={e => setForm({ ...form, etapa: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none bg-white">
                  <option value="P1">P1 — Documentação</option>
                  <option value="P2">P2 — Apresentação</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nota (0–10)</label>
                <input type="number" min="0" max="10" step="0.5" value={form.nota} onChange={e => setForm({ ...form, nota: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Feedback</label>
              <textarea value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} rows={3} placeholder="Comentários sobre o grupo..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none resize-none" />
            </div>
            <button onClick={save} disabled={status === 'saving' || !form.nota}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] disabled:opacity-50 transition-colors shadow-sm">
              {status === 'saving' ? 'Salvando...' : status === 'done' ? '✅ Nota lançada!' : status === 'error' ? '⚠️ Erro, tente novamente' : <><Send className="h-4 w-4" /> Lançar Nota</>}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Documentos do Grupo</h2>
            {[
              { nome: 'Proposta_Projeto_G01.pdf', size: '2.4 MB' },
              { nome: 'Relatorio_Final_G01.pdf', size: '8.1 MB' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 mb-2 hover:border-gray-200 transition-colors cursor-pointer">
                <FileText className="h-5 w-5 text-[#2563eb] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{doc.nome}</div>
                  <div className="text-xs text-gray-400">{doc.size}</div>
                </div>
                <Download className="h-4 w-4 text-gray-400 shrink-0" />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Tabela de Pesos</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">P1 — Documentação</span>
                <span className="text-sm font-bold text-gray-900">40%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">P2 — Apresentação</span>
                <span className="text-sm font-bold text-gray-900">60%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#2563eb]/5 rounded-xl border border-[#2563eb]/10">
                <span className="text-sm font-semibold text-gray-900">Nota Final</span>
                <span className="text-sm font-bold text-[#2563eb]">P1×0.4 + P2×0.6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
