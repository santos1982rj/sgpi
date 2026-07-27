'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AvaliacoesPage() {
  const supabase = createClient()
  const [grupos, setGrupos] = useState<any[]>([])
  const [selectedGrupo, setSelectedGrupo] = useState('')
  const [alunos, setAlunos] = useState<any[]>([])
  const [notas, setNotas] = useState<Record<string, { p1: string; p2: string; feedback: string }>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('grupos').select('id, nome, tema, turmas(codigo)').limit(20).then(({ data }) => {
      if (data) setGrupos(data)
    })
  }, [])

  const loadAlunos = async (grupoId: string) => {
    setSelectedGrupo(grupoId)
    const { data: membros } = await supabase.from('membros').select('aluno_id').eq('grupo_id', grupoId)
    if (!membros?.length) {
      setAlunos([])
      return
    }
    const ids = membros.map((m: any) => m.aluno_id)
    const { data: profiles } = await supabase.from('profiles').select('id, nome, matricula').in('id', ids)
    const { data: avaliacoes } = await supabase.from('avaliacoes').select('*').eq('grupo_id', grupoId)
    const notasMap: Record<string, { p1: string; p2: string; feedback: string }> = {}
    for (const a of (avaliacoes || [])) {
      if (!notasMap[a.aluno_id]) notasMap[a.aluno_id] = { p1: '', p2: '', feedback: '' }
      if (a.etapa === 'P1') notasMap[a.aluno_id].p1 = a.nota?.toString() || ''
      if (a.etapa === 'P2') notasMap[a.aluno_id].p2 = a.nota?.toString() || ''
      if (a.feedback) notasMap[a.aluno_id].feedback = a.feedback
    }
    setAlunos(profiles || [])
    setNotas(notasMap)
  }

  const updateNota = (alunoId: string, campo: 'p1' | 'p2' | 'feedback', valor: string) => {
    setNotas(prev => ({
      ...prev,
      [alunoId]: { ...prev[alunoId] || { p1: '', p2: '', feedback: '' }, [campo]: valor }
    }))
  }

  const salvarNotas = async () => {
    setSaving(true)
    for (const aluno of alunos) {
      const n = notas[aluno.id]
      if (!n) continue
      if (n.p1) {
        await supabase.from('avaliacoes').upsert({
          grupo_id: selectedGrupo, aluno_id: aluno.id, etapa: 'P1',
          nota: parseFloat(n.p1), feedback: n.feedback || null,
        }, { onConflict: 'grupo_id,aluno_id,etapa' })
      }
      if (n.p2) {
        await supabase.from('avaliacoes').upsert({
          grupo_id: selectedGrupo, aluno_id: aluno.id, etapa: 'P2',
          nota: parseFloat(n.p2), feedback: n.feedback || null,
        }, { onConflict: 'grupo_id,aluno_id,etapa' })
      }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const grupoSel = grupos.find((g: any) => g.id === selectedGrupo)

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Avaliações</h1>
      <p className="text-sm text-gray-500 mb-6">Notas individuais por aluno — P1 (Documentação) e P2 (Apresentação)</p>

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
              <h2 className="font-bold text-gray-900">{grupoSel?.nome}</h2>
              <p className="text-sm text-gray-500">{grupoSel?.tema}</p>
            </div>
            <div className="divide-y divide-gray-100">
              {alunos.map((aluno: any) => {
                const n = notas[aluno.id] || { p1: '', p2: '', feedback: '' }
                const media = n.p1 && n.p2 ? ((parseFloat(n.p1) * 0.4) + (parseFloat(n.p2) * 0.6)).toFixed(1) : null
                return (
                  <div key={aluno.id} className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-xs font-bold text-white">
                        {aluno.nome?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{aluno.nome}</div>
                        <div className="text-xs text-gray-400">{aluno.matricula}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">P1 — Documentação (0–10)</label>
                        <input type="number" min="0" max="10" step="0.5" value={n.p1}
                          onChange={e => updateNota(aluno.id, 'p1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2563eb] outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">P2 — Apresentação (0–10)</label>
                        <input type="number" min="0" max="10" step="0.5" value={n.p2}
                          onChange={e => updateNota(aluno.id, 'p2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2563eb] outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Média (P1×0.4 + P2×0.6)</label>
                        <div className="h-[38px] flex items-center px-3 bg-gray-50 rounded-lg text-sm font-bold text-gray-900">{media || '—'}</div>
                      </div>
                    </div>
                    <div>
                      <input value={n.feedback} onChange={e => updateNota(aluno.id, 'feedback', e.target.value)}
                        placeholder="Feedback (opcional)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2563eb] outline-none" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={salvarNotas} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] disabled:opacity-50 transition-all shadow-sm">
              {saving ? 'Salvando...' : saved ? <><CheckCircle className="h-4 w-4" /> Notas Salvas!</> : <><Send className="h-4 w-4" /> Salvar Notas</>}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
