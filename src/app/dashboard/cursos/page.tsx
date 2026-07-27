'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit2, X, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function CursosPage() {
  const supabase = createClient()
  const [cursos, setCursos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false })
  const [form, setForm] = useState({ nome: '', sigla: '' })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('cursos').select('*').order('nome')
    if (data) setCursos(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (modal.edit) {
      await supabase.from('cursos').update({ nome: form.nome, sigla: form.sigla }).eq('id', modal.edit.id)
    } else {
      await supabase.from('cursos').insert({ nome: form.nome, sigla: form.sigla })
    }
    setModal({ open: false })
    load()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Cursos</h1><p className="text-sm text-gray-500 mt-1">{cursos.length} cursos</p></div>
        <button onClick={() => { setForm({ nome: '', sigla: '' }); setModal({ open: true }) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] shadow-sm"><Plus className="h-4 w-4" /> Novo Curso</button>
      </div>
      <div className="space-y-3">
        {cursos.map((c: any) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-white font-bold text-sm">{c.sigla}</div>
              <div><h3 className="font-semibold text-gray-900">{c.nome}</h3><p className="text-xs text-gray-400">{c.sigla}</p></div>
            </div>
            <button onClick={() => { setForm({ nome: c.nome, sigla: c.sigla }); setModal({ open: true, edit: c }) }}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModal({ open: false })}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{modal.edit ? 'Editar' : 'Novo'} Curso</h3>
              <button onClick={() => setModal({ open: false })} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Curso</label>
                <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Engenharia Civil"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sigla</label>
                <input value={form.sigla} onChange={e => setForm({ ...form, sigla: e.target.value })} placeholder="EC"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setModal({ open: false })} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={save} className="px-4 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1a4b8c]">{modal.edit ? 'Salvar' : 'Criar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
