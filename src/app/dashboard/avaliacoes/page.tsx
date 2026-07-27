'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Send, CheckCircle, UserCheck, Users } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AvaliacoesPage() {
  const supabase = createClient()
  const [grupos, setGrupos] = useState<any[]>([])
  const [selectedGrupo, setSelectedGrupo] = useState('')
  const [alunos, setAlunos] = useState<any[]>([])
  const [avaliadorId, setAvaliadorId] = useState('')
  const [profName, setProfName] = useState('')
  const [notas, setNotas] = useState<Record<string, { p1: string; p2: string }>>({})
  const [notasBanca, setNotasBanca] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setAvaliadorId(user.id)
        const { data: p } = await supabase.from('profiles').select('nome').eq('id', user.id).single()
        if (p) setProfName(p.nome)
      }
      const { data } = await supabase.from('grupos').select('id, nome, tema, turmas(codigo)').limit(20)
      if (data) setGrupos(data)
    }
    load()
  }, [])

  const loadAlunos = async (grupoId: string) => {
    setSelectedGrupo(grupoId)
    const { data: membros } = await supabase.from('membros').select('aluno_id').eq('grupo_id', grupoId)
    if (!membros?.length) { setAlunos([]); return }
    const ids = membros.map((m: any) => m.aluno_id)
    const { data: profiles } = await supabase.from('profiles').select('id, nome, matricula').in('id', ids)
    setAlunos(profiles || [])

    // Load existing avaliacoes for this group by THIS teacher
    const { data: existentes } = await supabase.from('avaliacoes')
      .select('*').eq('grupo_id', grupoId).eq('avaliador_id', avaliadorId)
    const notasMap: Record<string, { p1: string; p2: string }> = {}
    for (const a of (existentes || [])) {
      if (!notasMap[a.aluno_id]) notasMap[a.aluno_id] = { p1: '', p2: '' }
      if (a.etapa === 'P1') notasMap[a.aluno_id].p1 = a.nota?.toString() || ''
      if (a.etapa === 'P2') notasMap[a.aluno_id].p2 = a.nota?.toString() || ''
    }
    setNotas(notasMap)

    // Load ALL banca notes for this group to show averages
    const { data: banca } = await supabase.from('avaliacoes')
      .select('*, profiles!avaliacoes_avaliador_id_fkey(nome)')
      .eq('grupo_id', grupoId)
    const bancaMap: Record<string, any> = {}
    for (const b of (banca || [])) {
      if (!bancaMap[b.aluno_id]) bancaMap[b.aluno_id] = { avaliadores: [], resumo: {} }
      if (!bancaMap[b.aluno_id].resumo[b.etapa]) bancaMap[b.aluno_id].resumo[b.etapa] = []
      bancaMap[b.aluno_id].resumo[b.etapa].push({ nota: b.nota, prof: b.profiles?.nome })
      if (!bancaMap[b.aluno_id].avaliadores.includes(b.profiles?.nome)) {
        bancaMap[b.aluno_id].avaliadores.push(b.profiles?.nome)
      }
    }
    for (const key of Object.keys(bancaMap)) {
      for (const etapa of ['P1', 'P2']) {
        const vals = bancaMap[key].resumo[etapa] || []
        if (vals.length > 0) {
          bancaMap[key].resumo[etapa + '_media'] = (vals.reduce((s: number, v: any) => s + parseFloat(v.nota), 0) / vals.length).toFixed(1)
        }
      }
    }
    setNotasBanca(bancaMap)
  }

  const updateNota = (alunoId: string, campo: 'p1' | 'p2', valor: string) => {
    setNotas(prev => ({ ...prev, [alunoId]: { ...prev[alunoId] || { p1: '', p2: '' }, [campo]: valor } }))
  }

  const salvar = async () => {
    setSaving(true)
    for (const aluno of alunos) {
      const n = notas[aluno.id]
      if (!n) continue
      for (const etapa of ['P1', 'P2'] as const) {
        const nota = etapa === 'P1' ? n.p1 : n.p2
        if (nota) {
          await supabase.from('avaliacoes').upsert({
            grupo_id: selectedGrupo, aluno_id: aluno.id, avaliador_id: avaliadorId, etapa,
            nota: parseFloat(nota),
          }, { onConflict: 'grupo_id,aluno_id,avaliador_id,etapa' })
        }
      }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    loadAlunos(selectedGrupo)
  }

  const grupoSel = grupos.find((g: any) => g.id === selectedGrupo)

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Avaliações</h1>
      <p className="text-sm text-gray-500 mb-6">Avaliador: {profName} • Mínimo 3 professores por banca • A nota final é a média</p>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Grupo</label>
        <select value={selectedGrupo} onChange={e => loadAlunos(e.target.value)}
          className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-[#2563eb] outline-none">
          <option value="">Selecione um grupo...</option>
          {grupos.map((g: any) => (
            <option key={g.id} value={g.id}>{g.nome} — {g.tema?.slice(0, 40)} ({g.turmas?.codigo})</option>
          ))}
        </select>
      </div>

      {!selectedGrupo ? (
        <div className="text-center py-16 text-gray-400">Selecione um grupo</div>
      ) : alunos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Este grupo não tem membros</div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">{grupoSel?.nome}</h2>
                  <p className="text-sm text-gray-500">{grupoSel?.tema}</p>
                </div>
                <div className="text-xs text-gray-400"><Users className="h-3.5 w-3.5 inline mr-1" />Mín. 3 avaliadores</div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {alunos.map((aluno: any) => {
                const n = notas[aluno.id] || { p1: '', p2: '' }
                const banca = notasBanca[aluno.id]
                const mediaP1 = banca?.resumo?.P1_media
                const mediaP2 = banca?.resumo?.P2_media
                const mediaFinal = mediaP1 && mediaP2 ? ((parseFloat(mediaP1) * 0.4) + (parseFloat(mediaP2) * 0.6)).toFixed(1) : null
                const qtdAvaliadores = banca?.avaliadores?.length || 0

                return (
                  <div key={aluno.id} className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-xs font-bold text-white">
                        {aluno.nome?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{aluno.nome}</div>
                        <div className="text-xs text-gray-400">{aluno.matricula}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${qtdAvaliadores >= 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {qtdAvaliadores}/3 avaliadores
                        </div>
                        {mediaFinal && <div className="text-sm font-bold text-[#2563eb]">Média: {mediaFinal}</div>}
                      </div>
                    </div>

                    {/* Inputs - Sua nota */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">P1 — Documentação (0–10)</label>
                        <input type="number" min="0" max="10" step="0.5" value={n.p1}
                          onChange={e => updateNota(aluno.id, 'p1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2563eb] outline-none" />
                        {mediaP1 && <div className="text-xs text-gray-400 mt-1">Média atual: <strong>{mediaP1}</strong></div>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">P2 — Apresentação (0–10)</label>
                        <input type="number" min="0" max="10" step="0.5" value={n.p2}
                          onChange={e => updateNota(aluno.id, 'p2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2563eb] outline-none" />
                        {mediaP2 && <div className="text-xs text-gray-400 mt-1">Média atual: <strong>{mediaP2}</strong></div>}
                      </div>
                    </div>

                    {/* Notas da banca */}
                    {banca?.resumo?.P1 && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs font-semibold text-gray-500 mb-1">Notas da banca:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">P1:</span>
                            {banca.resumo.P1.map((r: any, i: number) => (
                              <span key={i} className="ml-1 text-gray-700">{r.nota} ({r.prof?.split(' ')[0]}){i < banca.resumo.P1.length - 1 ? ', ' : ''}</span>
                            ))}
                          </div>
                          <div>
                            <span className="text-gray-400">P2:</span>
                            {banca.resumo.P2?.map((r: any, i: number) => (
                              <span key={i} className="ml-1 text-gray-700">{r.nota} ({r.prof?.split(' ')[0]}){i < banca.resumo.P2.length - 1 ? ', ' : ''}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={salvar} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] disabled:opacity-50 transition-all shadow-sm">
              {saving ? 'Salvando...' : saved ? <><CheckCircle className="h-4 w-4" /> Salvo!</> : <><Send className="h-4 w-4" /> {alunos.length > 0 ? 'Salvar Notas' : 'Salvar'}</>}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
