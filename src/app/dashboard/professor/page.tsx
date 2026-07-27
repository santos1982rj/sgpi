'use client'

import { useState } from 'react'
import { ArrowLeft, Search, Filter, Users, BookOpen, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const todosGrupos = [
  { turma: 'PI-EC8A', periodo: '8º', grupo: 'G01', tema: 'Fundações em solo residual', membros: 3, status: 'Ativo' },
  { turma: 'PI-EC8A', periodo: '8º', grupo: 'G02', tema: 'Contenção de taludes urbanos', membros: 3, status: 'Ativo' },
  { turma: 'PI-EC8B', periodo: '8º', grupo: 'G03', tema: 'Patologia em pontes de concreto', membros: 3, status: 'Entregue' },
  { turma: 'PI-EC8B', periodo: '8º', grupo: 'G04', tema: 'Reaproveitamento de águas pluviais', membros: 3, status: 'Entregue' },
  { turma: 'PI-EP7A', periodo: '7º', grupo: 'G05', tema: 'Layout industrial otimizado', membros: 4, status: 'Ativo' },
  { turma: 'PI-EP7A', periodo: '7º', grupo: 'G06', tema: 'Gestão de resíduos na construção', membros: 3, status: 'Ativo' },
  { turma: 'PI-CC7A', periodo: '7º', grupo: 'G07', tema: 'App para gestão de bibliotecas', membros: 4, status: 'Em andamento' },
  { turma: 'PI-CC7A', periodo: '7º', grupo: 'G08', tema: 'Sistema de ponto eletrônico', membros: 3, status: 'Em andamento' },
]

export default function ProfessorDashboardPage() {
  const [search, setSearch] = useState('')
  const [filtroPeriodo, setFiltroPeriodo] = useState('')
  const [filtroTurma, setFiltroTurma] = useState('')

  const periodos = [...new Set(todosGrupos.map(g => g.periodo))]
  const turmas = [...new Set(todosGrupos.map(g => g.turma))]

  const filtrados = todosGrupos.filter(g => {
    if (search && !g.tema.toLowerCase().includes(search.toLowerCase()) && !g.grupo.toLowerCase().includes(search)) return false
    if (filtroPeriodo && g.periodo !== filtroPeriodo) return false
    if (filtroTurma && g.turma !== filtroTurma) return false
    return true
  })

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Grupos para Avaliação</h1>
      <p className="text-sm text-gray-500 mb-6">Todos os grupos disponíveis para lançamento de notas</p>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por tema ou grupo..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
        </div>
        <select value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none">
          <option value="">Todos os períodos</option>
          {periodos.map(p => <option key={p} value={p}>{p} período</option>)}
        </select>
        <select value={filtroTurma} onChange={e => setFiltroTurma(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none">
          <option value="">Todas as turmas</option>
          {turmas.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtrados.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Nenhum grupo encontrado</div>
        ) : filtrados.map((g, i) => (
          <Link key={i} href={`/dashboard/avaliacoes?grupo=${g.grupo}`}
            className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-white font-bold text-sm">
                  {g.grupo}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{g.tema}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>{g.turma}</span>
                    <span>•</span>
                    <span>{g.periodo} período</span>
                    <span>•</span>
                    <Users className="h-3 w-3" /> {g.membros} membros
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  g.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' :
                  g.status === 'Entregue' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                }`}>{g.status}</span>
                <ChevronDown className="h-4 w-4 text-gray-300 -rotate-90" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
