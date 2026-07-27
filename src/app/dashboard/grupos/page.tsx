'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, ArrowLeft, Users, Check } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function GruposPage() {
  const supabase = createClient()
  const [grupos, setGrupos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<any[]>([])
  const [alunosTurma, setAlunosTurma] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal Grupo
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false })
  const [form, setForm] = useState({ nome: '', tema: '', turma_id: '' })

  // Modal Membros
  const [membroModal, setMembroModal] = useState<{ open: boolean; grupo?: any }>({ open: false })
  const [membrosGrupo, setMembrosGrupo] = useState<any[]>([])
  const [selectedAlunos, setSelectedAlunos] = useState<Set<string>>(new Set())

  const load = async () => {
    setLoading(true)
    const [gData, tData] = await Promise.all([
      supabase.from('grupos').select('*, turmas(codigo)').order('created_at', { ascending: false }),
      supabase.from('turmas').select('id, codigo, periodo').eq('ativa', true)
    ])
    if (gData.data) setGrupos(gData.data)
    if (tData.data) setTurmas(tData.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const loadAlunosTurma = async (turmaId: string) => {
    const { data } = await supabase
      .from('turma_alunos')
      .select('*, profiles(nome, matricula)')
      .eq('turma_id', turmaId)
    setAlunosTurma(data || [])
  }

  const openMembros = async (grupo: any) => {
    setMembroModal({ open: true, grupo })

    // Get turma_id from grupo
    const { data: g } = await supabase.from('grupos').select('turma_id').eq('id', grupo.id).single()
    if (g) {
      await loadAlunosTurma(g.turma_id)
    }

    // Get existing members
    const { data: m } = await supabase.from('membros').select('aluno_id').eq('grupo_id', grupo.id)
    const existing = new Set((m || []).map((x: any) => x.aluno_id))
    setSelectedAlunos(existing)
    
    // Load member details
    if (m && m.length > 0) {
      const ids = m.map((x: any) => x.aluno_id)
      const { data: profiles } = await supabase.from('profiles').select('id, nome, matricula').in('id', ids)
      setMembrosGrupo(profiles || [])
    } else {
      setMembrosGrupo([])
    }
  }

  const toggleAluno = async (alunoId: string, nome: string, matricula: string) => {
    const grupoId = membroModal.grupo?.id
    if (!grupoId) return

    const isSelected = selectedAlunos.has(alunoId)
    if (isSelected) {
      await supabase.from('membros').delete().eq('grupo_id', grupoId).eq('aluno_id', alunoId)
      selectedAlunos.delete(alunoId)
      setMembrosGrupo(prev => prev.filter(m => m.id !== alunoId))
    } else {
      await supabase.from('membros').insert({ grupo_id: grupoId, aluno_id: alunoId, lider: membrosGrupo.length === 0 })
      selectedAlunos.add(alunoId)
      setMembrosGrupo(prev => [...prev, { id: alunoId, nome, matricula }])
    }
    setSelectedAlunos(new Set(selectedAlunos))
  }

  const saveGrupo = async () => {
    if (modal.edit) {
      await supabase.from('grupos').update({ nome: form.nome, tema: form.tema }).eq('id', modal.edit.id)
    } else {
      await supabase.from('grupos').insert({ nome: form.nome, tema: form.tema, turma_id: form.turma_id, status: 'ativo' })
    }
    setModal({ open: false })
    load()
  }

  const remove = async (id: string) => {
    if (confirm('Excluir este grupo?')) {
      await supabase.from('grupos').delete().eq('id', id)
      load()
    }
  }

  const filtered = grupos.filter((g: any) =>
    g.nome?.toLowerCase().includes(search.toLowerCase()) ||
    g.tema?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (s: string) => {
    const c: Record<string, string> = { 'ativo': 'bg-emerald-50 text-emerald-700 border-emerald-200', 'entregue': 'bg-blue-50 text-blue-700 border-blue-200' }
    return c[s] || 'bg-gray-50 text-gray-600 border-gray-200'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Grupos</h1><p className="text-sm text-gray-500 mt-1">{grupos.length} grupos</p></div>
        <button onClick={() => { setForm({ nome: '', tema: '', turma_id: '' }); setModal({ open: true }) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] transition-colors shadow-sm"><Plus className="h-4 w-4" /> Novo Grupo</button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar grupo ou tema..." className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
      </div>

      {loading ? <div className="text-center py-12 text-gray-400">Carregando...</div> : filtered.length === 0 ? (
        <div className="text-center py-16"><Users className="h-12 w-12 mx-auto text-gray-300 mb-3" /><p className="text-gray-500 font-medium">Nenhum grupo</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((g: any) => (
            <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900">{g.nome}</h3>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(g.status)}`}>{g.status}</span>
                  <span className="text-xs text-gray-400">{g.turmas?.codigo}</span>
                </div>
                {g.tema && <p className="text-sm text-gray-500 truncate">{g.tema}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openMembros(g)} className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Membros
                </button>
                <button onClick={() => { setForm({ nome: g.nome, tema: g.tema || '', turma_id: g.turma_id }); setModal({ open: true, edit: g }) }}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => remove(g.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Novo/Editar Grupo */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModal({ open: false })}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{modal.edit ? 'Editar' : 'Novo'} Grupo</h3>
              <button onClick={() => setModal({ open: false })} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {!modal.edit && <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Turma</label>
                <select value={form.turma_id} onChange={e => setForm({ ...form, turma_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-[#2563eb] outline-none">
                  <option value="">Selecione...</option>
                  {turmas.map((t: any) => <option key={t.id} value={t.id}>{t.codigo} - {t.periodo}º período</option>)}
                </select>
              </div>}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome</label>
                <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: G01" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tema</label>
                <input value={form.tema} onChange={e => setForm({ ...form, tema: e.target.value })} placeholder="Tema do projeto" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setModal({ open: false })} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={saveGrupo} className="px-4 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1a4b8c]">{modal.edit ? 'Salvar' : 'Criar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Membros */}
      {membroModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setMembroModal({ open: false })}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Membros — {membroModal.grupo?.nome}</h3>
              <button onClick={() => setMembroModal({ open: false })} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            {/* Membros atuais */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Membros do Grupo ({membrosGrupo.length})</label>
              {membrosGrupo.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Nenhum membro ainda</p>
              ) : (
                <div className="space-y-1.5">
                  {membrosGrupo.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-[10px] font-bold text-white">
                          {m.nome?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{m.nome}</span>
                        <span className="text-xs text-gray-400">{m.matricula}</span>
                      </div>
                      <button onClick={() => toggleAluno(m.id, m.nome, m.matricula)} className="text-red-400 hover:text-red-600 text-xs font-medium">Remover</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Adicionar alunos da turma */}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Alunos da Turma</label>
              {alunosTurma.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Nenhum aluno disponível</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {alunosTurma.map((a: any) => {
                    const add = selectedAlunos.has(a.aluno_id)
                    return (
                      <button key={a.id} onClick={() => toggleAluno(a.aluno_id, a.profiles?.nome, a.matricula)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left ${add ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${add ? 'bg-[#2563eb]' : 'bg-gray-300'}`}>
                            {a.profiles?.nome?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || '??'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{a.profiles?.nome}</div>
                            <div className="text-xs text-gray-400">{a.matricula}</div>
                          </div>
                        </div>
                        {add && <Check className="h-4 w-4 text-[#2563eb]" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
