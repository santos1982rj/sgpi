'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SolicitacoesPage() {
  const supabase = createClient()
  const [solicitacoes, setSolicitacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserId(user.id)
    const { data } = await supabase.from('solicitacoes')
      .select('*, profiles!solicitacoes_aluno_id_fkey(nome, matricula)')
      .order('created_at', { ascending: false })
    if (data) setSolicitacoes(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const aprovar = async (id: string) => {
    await supabase.from('solicitacoes').update({ status: 'aprovado', analisado_por: userId, updated_at: new Date().toISOString() }).eq('id', id)
    load()
  }

  const recusar = async (id: string) => {
    await supabase.from('solicitacoes').update({ status: 'recusado', analisado_por: userId, updated_at: new Date().toISOString() }).eq('id', id)
    load()
  }

  const pendentes = solicitacoes.filter(s => s.status === 'pendente')
  const historico = solicitacoes.filter(s => s.status !== 'pendente')

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Solicitações</h1>
      <p className="text-sm text-gray-500 mb-6">{pendentes.length} pendentes</p>

      {loading ? <div className="text-center py-12 text-gray-400">Carregando...</div> : pendentes.length === 0 && historico.length === 0 ? (
        <div className="text-center py-16">
          <Eye className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma solicitação</p>
        </div>
      ) : (
        <>
          {pendentes.length > 0 && (
            <div className="mb-8">
              <h2 className="font-bold text-gray-900 mb-3 text-sm">Pendentes ({pendentes.length})</h2>
              <div className="space-y-3">
                {pendentes.map((s: any) => (
                  <div key={s.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 mb-2">{s.tipo === 'troca_tema' ? 'Troca de Tema' : s.tipo === 'troca_grupo' ? 'Troca de Grupo' : 'Entrada em Grupo'}</span>
                        <h3 className="font-semibold text-gray-900">{s.profiles?.nome}</h3>
                        <p className="text-xs text-gray-400">Matrícula: {s.profiles?.matricula}</p>
                      </div>
                    </div>
                    {s.justificativa && <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-3">"{s.justificativa}"</p>}
                    {s.tema_sugerido && <p className="text-sm text-gray-500">Novo tema: <span className="font-medium text-gray-900">{s.tema_sugerido}</span></p>}
                    <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button onClick={() => recusar(s.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"><XCircle className="h-4 w-4" /> Recusar</button>
                      <button onClick={() => aprovar(s.id)} className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#2563eb] text-white text-sm rounded-lg hover:bg-[#1a4b8c] transition-colors"><CheckCircle className="h-4 w-4" /> Aprovar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {historico.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-900 mb-3 text-sm">Histórico</h2>
              <div className="space-y-2">
                {historico.map((s: any) => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${s.status === 'aprovado' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <div>
                        <span className="text-sm text-gray-900">{s.profiles?.nome}</span>
                        <span className="text-xs text-gray-400 ml-2">{s.tipo === 'troca_tema' ? 'Troca de tema' : s.tipo === 'troca_grupo' ? 'Troca de grupo' : 'Entrada'}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${s.status === 'aprovado' ? 'text-emerald-600' : 'text-red-500'}`}>{s.status === 'aprovado' ? 'Aprovado' : 'Recusado'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
