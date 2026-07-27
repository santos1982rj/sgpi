'use client'

import { useState, useEffect, use } from 'react'
import { ArrowLeft, Plus, X, UserPlus, Search } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function TurmaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()
  const [turma, setTurma] = useState<any>(null)
  const [alunos, setAlunos] = useState<any[]>([])
  const [allAlunos, setAllAlunos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data: t } = await supabase.from('turmas').select('*, cursos(nome, sigla)').eq('id', id).single()
    setTurma(t)

    const { data: tas } = await supabase.from('turma_alunos').select('*, profiles(nome, matricula, email)').eq('turma_id', id)
    setAlunos(tas || [])

    const { data: aa } = await supabase.from('profiles').select('id, nome, matricula, email').eq('role', 'aluno')
    const jaAdd = new Set((tas || []).map((a: any) => a.aluno_id))
    setAllAlunos((aa || []).filter((a: any) => !jaAdd.has(a.id)))
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const addAluno = async (alunoId: string, matricula: string) => {
    setAdding(true)
    await supabase.from('turma_alunos').insert({ turma_id: id, aluno_id: alunoId, matricula })
    setShowAdd(false)
    setSearch('')
    load()
    setAdding(false)
  }

  const removeAluno = async (alunoId: string) => {
    if (!confirm('Remover este aluno da turma?')) return
    await supabase.from('turma_alunos').delete().eq('turma_id', id).eq('aluno_id', alunoId)
    load()
  }

  const filtrados = allAlunos.filter(a =>
    a.nome?.toLowerCase().includes(search.toLowerCase()) ||
    a.matricula?.includes(search)
  )

  if (loading) return <div className="p-8 text-gray-400">Carregando...</div>
  if (!turma) return <div className="p-8 text-gray-400">Turma não encontrada</div>

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/turmas" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Turmas
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{turma.codigo}</h1>
            <p className="text-sm text-gray-500 mt-1">{turma.cursos?.nome} • {turma.periodo} período • {turma.semestre}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {turma.ativa ? 'Ativa' : 'Inativa'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Alunos da Turma ({alunos.length})</h2>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] transition-colors">
          <Plus className="h-4 w-4" /> Adicionar Aluno
        </button>
      </div>

      {alunos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum aluno vinculado</p>
          <p className="text-sm text-gray-400 mt-1">Adicione alunos à turma para começar</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {alunos.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-xs font-bold text-white">
                    {a.profiles?.nome?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || '??'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{a.profiles?.nome}</div>
                    <div className="text-xs text-gray-400">{a.matricula} • {a.profiles?.email}</div>
                  </div>
                </div>
                <button onClick={() => removeAluno(a.aluno_id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Adicionar Aluno */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Adicionar Aluno</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou matrícula..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" autoFocus />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filtrados.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-6">Nenhum aluno disponível</p>
              ) : filtrados.map((a: any) => (
                <button key={a.id} onClick={() => addAluno(a.id, a.matricula)}
                  disabled={adding}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{a.nome}</div>
                    <div className="text-xs text-gray-400">{a.matricula}</div>
                  </div>
                  <Plus className="h-4 w-4 text-[#2563eb] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
