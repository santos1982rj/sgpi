'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Turma {
  id: string
  codigo: string
  periodo: string
  semestre: string
  ativa: boolean
}

export default function TurmasPage() {
  const supabase = createClient()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; edit?: Turma }>({ open: false })
  const [form, setForm] = useState({ codigo: '', periodo: '', semestre: '2026.2', curso_id: '' })
  const [cursos, setCursos] = useState<{ id: string; nome: string; sigla: string }[]>([])

  const load = async () => {
    setLoading(true)
    const [tData, cData] = await Promise.all([
      supabase.from('turmas').select('*').order('created_at', { ascending: false }),
      supabase.from('cursos').select('*')
    ])
    if (tData.data) setTurmas(tData.data)
    if (cData.data) setCursos(cData.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (modal.edit) {
      await supabase.from('turmas').update({ codigo: form.codigo, periodo: form.periodo, semestre: form.semestre, curso_id: form.curso_id }).eq('id', modal.edit.id)
    } else {
      await supabase.from('turmas').insert({ codigo: form.codigo, periodo: form.periodo, semestre: form.semestre, curso_id: form.curso_id, ativa: true })
    }
    setModal({ open: false })
    load()
  }

  const remove = async (id: string) => {
    if (confirm('Excluir esta turma?')) {
      await supabase.from('turmas').delete().eq('id', id)
      load()
    }
  }

  const filtered = turmas.filter(t =>
    t.codigo?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-sm text-gray-500 mt-1">{turmas.length} turmas cadastradas</p>
        </div>
        <button onClick={() => { setForm({ codigo: '', periodo: '', semestre: '2026.2', curso_id: '' }); setModal({ open: true }) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Nova Turma
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Buscar turma..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Nenhuma turma encontrada</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Código</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Período</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Semestre</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4"><span className="font-semibold text-gray-900">{t.codigo}</span></td>
                    <td className="px-6 py-4 text-gray-600">{t.periodo}</td>
                    <td className="px-6 py-4 text-gray-600">{t.semestre}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${t.ativa ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${t.ativa ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {t.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setForm({ codigo: t.codigo, periodo: t.periodo, semestre: t.semestre, curso_id: '' }); setModal({ open: true, edit: t }) }}
                          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(t.id)}
                          className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModal({ open: false })}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{modal.edit ? 'Editar Turma' : 'Nova Turma'}</h3>
              <button onClick={() => setModal({ open: false })} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Código</label>
                <input value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="Ex: PI-EC9A"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Curso</label>
                  <select value={form.curso_id} onChange={e => setForm({ ...form, curso_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none bg-white">
                    <option value="">Selecione...</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nome} ({c.sigla})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Período</label>
                  <input value={form.periodo} onChange={e => setForm({ ...form, periodo: e.target.value })} placeholder="Ex: 8º"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Semestre</label>
                  <input value={form.semestre} onChange={e => setForm({ ...form, semestre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setModal({ open: false })} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
              <button onClick={save} className="px-4 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1a4b8c] transition-colors">
                {modal.edit ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
