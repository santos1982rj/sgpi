'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, Send, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function MeuGrupoPage() {
  const supabase = createClient()
  const [alunoId, setAlunoId] = useState('')
  const [grupo, setGrupo] = useState<any>(null)
  const [membrosList, setMembrosList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [solicitando, setSolicitando] = useState(false)
  const [solicForm, setSolicForm] = useState({ tipo: 'troca_tema', justificativa: '', tema: '' })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setAlunoId(user.id)

      // Find the group the student belongs to
      const { data: membro } = await supabase.from('membros').select('grupo_id').eq('aluno_id', user.id).single()
      if (membro) {
        const { data: g } = await supabase.from('grupos').select('*, turmas(codigo)').eq('id', membro.grupo_id).single()
        setGrupo(g)
        const { data: m } = await supabase.from('membros').select('aluno_id, lider').eq('grupo_id', membro.grupo_id)
        if (m?.length) {
          const ids = m.map((x: any) => x.aluno_id)
          const { data: profiles } = await supabase.from('profiles').select('id, nome, matricula').in('id', ids)
          setMembrosList(profiles || [])
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const confirmarGrupo = async () => {
    if (!grupo) return
    await supabase.from('grupos').update({ grupo_confirmado: true }).eq('id', grupo.id)
    setGrupo({ ...grupo, grupo_confirmado: true })
  }

  const confirmarTema = async () => {
    if (!grupo) return
    await supabase.from('grupos').update({ tema_confirmado: true }).eq('id', grupo.id)
    setGrupo({ ...grupo, tema_confirmado: true })
  }

  const solicitar = async () => {
    setSolicitando(true)
    await supabase.from('solicitacoes').insert({
      tipo: solicForm.tipo,
      aluno_id: alunoId,
      grupo_atual_id: grupo?.id,
      tema_sugerido: solicForm.tipo === 'troca_tema' ? solicForm.tema : null,
      justificativa: solicForm.justificativa,
    })
    setSolicForm({ tipo: 'troca_tema', justificativa: '', tema: '' })
    setSolicitando(false)
    alert('Solicitação enviada! Aguarde aprovação da coordenação.')
  }

  if (loading) return <div className="p-8 text-gray-400">Carregando...</div>

  if (!grupo) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Você não está em nenhum grupo</h2>
        <p className="text-gray-500">Aguarde sua turma ser formada pela secretaria</p>
      </div>
    )
  }

  const lider = membrosList.find((m: any) => m.id === grupo.lider_id)

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu Grupo</h1>

      {/* Card do Grupo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{grupo.nome}</h2>
            <p className="text-sm text-gray-500">{grupo.turmas?.codigo}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            grupo.status === 'ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-600'
          }`}>{grupo.status}</span>
        </div>

        {/* Tema */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tema do Projeto</label>
          <p className="text-gray-900 font-medium">{grupo.tema || 'Nenhum tema definido'}</p>
        </div>

        {/* Confirmações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className={`rounded-xl p-4 border ${grupo.grupo_confirmado ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Grupo</span>
              {grupo.grupo_confirmado ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
            </div>
            <p className="text-sm font-medium text-gray-900">{grupo.grupo_confirmado ? 'Confirmado' : 'Pendente'}</p>
            {!grupo.grupo_confirmado && (
              <button onClick={confirmarGrupo} className="mt-3 text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Confirmar</button>
            )}
          </div>
          <div className={`rounded-xl p-4 border ${grupo.tema_confirmado ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tema</span>
              {grupo.tema_confirmado ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
            </div>
            <p className="text-sm font-medium text-gray-900">{grupo.tema_confirmado ? 'Confirmado' : 'Pendente'}</p>
            {!grupo.tema_confirmado && (
              <button onClick={confirmarTema} className="mt-3 text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Confirmar</button>
            )}
          </div>
        </div>

        {/* Membros */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Membros ({membrosList.length})</h3>
          <div className="space-y-2">
            {membrosList.map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-xs font-bold text-white">
                  {m.nome?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{m.nome}</span>
                  <span className="text-xs text-gray-400 ml-2">{m.matricula}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solicitar Mudança */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Send className="h-5 w-5 text-[#2563eb]" /> Solicitar Mudança</h3>
        <p className="text-xs text-gray-500 mb-4">Envie uma solicitação para a coordenação. A mudança só é efetivada após aprovação.</p>
        <div className="space-y-3">
          <select value={solicForm.tipo} onChange={e => setSolicForm({ ...solicForm, tipo: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:border-[#2563eb] outline-none">
            <option value="troca_tema">Trocar tema do projeto</option>
            <option value="troca_grupo">Trocar de grupo</option>
            <option value="entrada_grupo">Entrar em um grupo</option>
          </select>
          {solicForm.tipo === 'troca_tema' && (
            <input value={solicForm.tema} onChange={e => setSolicForm({ ...solicForm, tema: e.target.value })} placeholder="Novo tema sugerido"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none" />
          )}
          <textarea value={solicForm.justificativa} onChange={e => setSolicForm({ ...solicForm, justificativa: e.target.value })} rows={2} placeholder="Justificativa"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] outline-none resize-none" />
          <button onClick={solicitar} disabled={solicitando}
            className="px-4 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] disabled:opacity-50">
            {solicitando ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </div>
      </div>
    </div>
  )
}
