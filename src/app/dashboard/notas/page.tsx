'use client'

import { useState } from 'react'
import { ArrowLeft, Download, FileSpreadsheet, Award } from 'lucide-react'
import Link from 'next/link'

const mockNotas = [
  { turma: 'EC8A', grupo: 'G01', tema: 'Fundações residuais', membros: 'Vinicius, Ana, João', avaliador: 'Prof. Carlos', p1: 8.5, p2: 9.0, media: 8.8, situacao: 'Aprovado' },
  { turma: 'EC8A', grupo: 'G02', tema: 'Contenção de taludes', membros: 'Lucas, Beatriz, Carla', avaliador: 'Prof. Carlos', p1: 7.0, p2: 8.5, media: 7.9, situacao: 'Aprovado' },
  { turma: 'EC8B', grupo: 'G03', tema: 'Patologia em pontes', membros: 'Diego, Amanda, Rafael', avaliador: 'Profa. Ana', p1: 6.0, p2: null, media: null, situacao: 'Pendente' },
  { turma: 'EC8B', grupo: 'G04', tema: 'Reaproveitamento águas', membros: 'Marina, Thiago, Eduardo', avaliador: 'Profa. Ana', p1: 9.0, p2: 9.5, media: 9.3, situacao: 'Aprovado' },
]

export default function NotasPage() {
  const exportCSV = () => {
    const header = 'Turma,Grupo,Tema,Membros,Avaliador,P1,P2,Média Final,Situação\n'
    const rows = mockNotas.map(n =>
      `"${n.turma}","${n.grupo}","${n.tema}","${n.membros}","${n.avaliador}",${n.p1 ?? ''},${n.p2 ?? ''},${n.media ?? ''},"${n.situacao}"`
    ).join('\n')
    const csv = header + rows
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notas-sgpi-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const aprovados = mockNotas.filter(n => n.situacao === 'Aprovado').length
  const pendentes = mockNotas.filter(n => n.situacao === 'Pendente').length
  const mediaGeral = mockNotas.filter(n => n.media).reduce((acc, n) => acc + (n.media || 0), 0) / mockNotas.filter(n => n.media).length

  return (
    <div className="max-w-7xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notas Finais</h1>
          <p className="text-sm text-gray-500 mt-1">Resultados consolidados do semestre</p>
        </div>
        <button onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] transition-colors shadow-sm">
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Grupos</div>
          <div className="text-3xl font-bold text-gray-900">{mockNotas.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Aprovados</div>
          <div className="text-3xl font-bold text-emerald-600">{aprovados}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pendentes</div>
          <div className="text-3xl font-bold text-amber-600">{pendentes}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Média Geral</div>
          <div className="text-3xl font-bold text-[#2563eb]">{mediaGeral.toFixed(1)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Turma</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Grupo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Tema</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Membros</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Avaliador</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase">P1</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase">P2</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Média</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockNotas.map((n, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-gray-900">{n.turma}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">{n.grupo}</td>
                  <td className="px-4 py-4 text-gray-600 truncate max-w-[200px] hidden md:table-cell">{n.tema}</td>
                  <td className="px-4 py-4 text-gray-600 text-sm hidden lg:table-cell">{n.membros}</td>
                  <td className="px-4 py-4 text-gray-600 hidden lg:table-cell">{n.avaliador}</td>
                  <td className="px-4 py-4 text-center font-medium">{n.p1 ?? '—'}</td>
                  <td className="px-4 py-4 text-center font-medium">{n.p2 ?? '—'}</td>
                  <td className="px-4 py-4 text-center font-bold text-lg">{n.media ?? '—'}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      n.situacao === 'Aprovado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {n.situacao === 'Aprovado' ? <Award className="h-3 w-3" /> : null}
                      {n.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export hint */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
        <FileSpreadsheet className="h-5 w-5 text-[#2563eb] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Exportação de dados</h3>
          <p className="text-xs text-gray-600 mt-1">O botão Exportar CSV gera um arquivo compatível com Excel, Google Sheets e sistemas acadêmicos. Colunas: Turma, Grupo, Tema, Membros, Avaliador, P1, P2, Média Final, Situação.</p>
        </div>
      </div>
    </div>
  )
}
