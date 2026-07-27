'use client'

import { useState } from 'react'
import { ArrowLeft, Calendar, Clock, Save, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CalendarioPage() {
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Calendário</h1>
      <p className="text-sm text-gray-500 mb-6">Cronograma do semestre para os Projetos Integradores</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 bg-[#0a1628] text-white">
          <h2 className="font-bold">2026.2 — Cronograma</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { etapa: 'Formação dos Grupos', inicio: '03/08/2026', fim: '14/08/2026', desc: 'Alunos definem grupos e temas' },
            { etapa: 'Definição dos Temas', inicio: '14/08/2026', fim: '21/08/2026', desc: 'Aprovação dos temas pela coordenação' },
            { etapa: 'Desenvolvimento', inicio: '22/08/2026', fim: '16/10/2026', desc: 'Período de desenvolvimento do projeto' },
            { etapa: 'P1 — Relatório Parcial', inicio: '19/10/2026', fim: '23/10/2026', desc: 'Entrega do relatório + apresentação (banca)' },
            { etapa: 'Desenvolvimento Final', inicio: '26/10/2026', fim: '20/11/2026', desc: 'Ajustes e finalização' },
            { etapa: 'P2 — Relatório Final', inicio: '24/11/2026', fim: '28/11/2026', desc: 'Entrega final + apresentação (banca)' },
            { etapa: 'Resultados', inicio: '01/12/2026', fim: '03/12/2026', desc: 'Divulgação das notas e ranking' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col items-center">
                <div className={`h-4 w-4 rounded-full border-2 ${i === 0 ? 'bg-[#2563eb] border-[#2563eb]' : 'border-gray-300'}`} />
                {i < 6 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.etapa}</h3>
                  <span className="text-xs text-gray-400 font-mono shrink-0">{item.inicio} → {item.fim}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-[#2563eb]" /> Configurar Prazos</h2>
        <div className="space-y-3">
          {['Prazo formação grupos', 'Prazo definição temas', 'Prazo P1', 'Prazo P2', 'Prazo notas'].map((p, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-gray-50">
              <span className="text-sm font-medium text-gray-700 min-w-[180px]">{p}</span>
              <div className="flex items-center gap-2">
                <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-[#2563eb] outline-none" />
                <span className="text-gray-400">até</span>
                <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-[#2563eb] outline-none" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={save} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] shadow-sm">
            {saved ? <><CheckCircle className="h-4 w-4" /> Salvo!</> : <><Save className="h-4 w-4" /> Salvar Prazos</>}
          </button>
        </div>
      </div>
    </div>
  )
}
