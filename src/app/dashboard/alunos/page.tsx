'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, X, ArrowLeft, Upload, Download } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AlunosPage() {
  const supabase = createClient()
  const [alunos, setAlunos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false })
  const [form, setForm] = useState({ nome: '', matricula: '', cpf: '', periodo: '', turma_id: '' })

  const load = async () => {
    setLoading(true)
    const [aData, tData] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'aluno').order('nome'),
      supabase.from('turmas').select('id, codigo, periodo').eq('ativa', true)
    ])
    if (aData.data) setAlunos(aData.data)
    if (tData.data) setTurmas(tData.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (modal.edit) {
      await supabase.from('profiles').update({ nome: form.nome, cpf: form.cpf, periodo: form.periodo }).eq('id', modal.edit.id)
    } else {
      // Create auth user + profile
      const { data: signUp, error } = await supabase.auth.admin.createUser({
        email: `${form.matricula}@aluno.unig.edu.br`,
        password: 'unig2026',
        email_confirm: true,
        user_metadata: { nome: form.nome, role: 'aluno' }
      })
      if (error) {
        alert('Erro: ' + error.message)
        setModal({ open: false })
        return
      }
      if (signUp?.user) {
        await supabase.from('profiles').insert({
          id: signUp.user.id,
          nome: form.nome,
          email: `${form.matricula}@aluno.unig.edu.br`,
          role: 'aluno',
          matricula: form.matricula,
          cpf: form.cpf,
          periodo: form.periodo
        })
        // Link to turma
        if (form.turma_id) {
          await supabase.from('turma_alunos').insert({ turma_id: form.turma_id, aluno_id: signUp.user.id, matricula: form.matricula })
        }
      }
    }
    setModal({ open: false })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Excluir este aluno?')) return
    // Delete turma_alunos first
    await supabase.from('turma_alunos').delete().eq('aluno_id', id)
    await supabase.from('profiles').delete().eq('id', id)
    load()
  }

  const filtered = alunos.filter((a: any) =>
    a.nome?.toLowerCase().includes(search.toLowerCase()) ||
    a.matricula?.includes(search) ||
    a.cpf?.includes(search)
  )

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Alunos</h1><p className="text-sm text-gray-500 mt-1">{alunos.length} alunos cadastrados</p></div>
        <div className="flex gap-2">
          <button onClick={() => setModal({ open: true })}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Novo Aluno
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, matrícula ou CPF..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Aluno</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Matrícula</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">CPF</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Período</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Nenhum aluno encontrado</td></tr>
              ) : filtered.map((a: any) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-[10px] font-bold text-white">
                        {a.nome?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{a.nome}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{a.matricula}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell font-mono">{a.cpf || '—'}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{a.periodo || '—'}º</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setForm({ nome: a.nome, matricula: a.matricula, cpf: a.cpf || '', periodo: a.periodo || '', turma_id: '' }); setModal({ open: true, edit: a }) }}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => remove(a.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModal({ open: false })}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{modal.edit ? 'Editar Aluno' : 'Novo Aluno'}</h3>
              <button onClick={() => setModal({ open: false })} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
                <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome do aluno"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Matrícula</label>
                  <input value={form.matricula} onChange={e => setForm({ ...form, matricula: e.target.value })} placeholder="230026043"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" disabled={!!modal.edit} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CPF</label>
                  <input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Período</label>
                  <input value={form.periodo} onChange={e => setForm({ ...form, periodo: e.target.value })} placeholder="8"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
                </div>
                {!modal.edit && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Turma</label>
                    <select value={form.turma_id} onChange={e => setForm({ ...form, turma_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-[#2563eb] outline-none">
                      <option value="">Selecione...</option>
                      {turmas.map((t: any) => <option key={t.id} value={t.id}>{t.codigo}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setModal({ open: false })} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={save} className="px-4 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1a4b8c]">{modal.edit ? 'Salvar' : 'Cadastrar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
