'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, ArrowLeft, Users as UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Grupo {
  id: string
  nome: string
  tema: string
  status: string
}

export default function GruposPage() {
  const supabase = createClient()
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; edit?: Grupo }>({ open: false })
  const [form, setForm] = useState({ nome: '', tema: '' })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('grupos').select('*').order('created_at', { ascending: false })
    if (data) setGrupos(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (modal.edit) {
      await supabase.from('grupos').update(form).eq('id', modal.edit.id)
    } else {
      await supabase.from('grupos').insert({ ...form, status: 'ativo' })
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

  const filtered = grupos.filter(g =>
    g.nome?.toLowerCase().includes(search.toLowerCase()) ||
    g.tema?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (s: string) => {
    const colors: Record<string, string> = {
      'ativo': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'formando': 'bg-amber-50 text-amber-700 border-amber-200',
      'entregue': 'bg-blue-50 text-blue-700 border-blue-200',
      'avaliado': 'bg-purple-50 text-purple-700 border-purple-200',
    }
    return colors[s] || 'bg-gray-50 text-gray-600 border-gray-200'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grupos</h1>
          <p className="text-sm text-gray-500 mt-1">{grupos.length} grupos cadastrados</p>
        </div>
        <button onClick={() => { setForm({ nome: '', tema: '' }); setModal({ open: true }) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Novo Grupo
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Buscar grupo ou tema..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400">Nenhum grupo encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(g => (
            <div key={g.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900">{g.nome}</h3>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(g.status)}`}>{g.status}</span>
                </div>
                {g.tema && <p className="text-sm text-gray-500 truncate">{g.tema}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => { setForm({ nome: g.nome, tema: g.tema || '' }); setModal({ open: true, edit: g }) }}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => remove(g.id)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModal({ open: false })}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{modal.edit ? 'Editar Grupo' : 'Novo Grupo'}</h3>
              <button onClick={() => setModal({ open: false })} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Grupo</label>
                <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: G01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tema do Projeto</label>
                <input value={form.tema} onChange={e => setForm({ ...form, tema: e.target.value })} placeholder="Ex: Fundações em solo residual"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none" />
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
