import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, UserCheck, GraduationCap, Clock, CheckCircle2, AlertCircle, ClipboardCheck, FileText } from 'lucide-react'
import Link from 'next/link'

const statusColors = {
  'Ativo': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Avaliando': 'bg-amber-50 text-amber-700 border-amber-200',
  'Encerrado': 'bg-slate-50 text-slate-500 border-slate-200',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count: turmasCount } = await supabase.from('turmas').select('*', { count: 'exact', head: true }).eq('ativa', true)
  const { count: gruposCount } = await supabase.from('grupos').select('*', { count: 'exact', head: true })
  const { count: avaliacoesCount } = await supabase.from('avaliacoes').select('*', { count: 'exact', head: true })

  const { data: userData } = await supabase.from('profiles').select('nome, role').eq('id', user?.id).single()
  const nome = userData?.nome || user?.email

  const { data: turmas } = await supabase
    .from('turmas')
    .select('*, cursos(nome, sigla)')
    .eq('ativa', true)
    .limit(6)
    .order('created_at', { ascending: false })

  const stats = [
    { label: 'Turmas Ativas', value: turmasCount || 0, icon: LayoutDashboard, color: 'from-[#4fc3f7] to-[#2563eb]', desc: 'este semestre' },
    { label: 'Grupos', value: gruposCount || 0, icon: Users, color: 'from-[#a78bfa] to-[#7c3aed]', desc: 'alunos matriculados' },
    { label: 'Avaliadores', value: 12, icon: UserCheck, color: 'from-[#34d399] to-[#059669]', desc: 'professores ativos' },
    { label: 'Avaliações', value: avaliacoesCount || 0, icon: GraduationCap, color: 'from-[#fbbf24] to-[#d97706]', desc: 'notas lançadas' },
  ]

  const timeline = [
    { date: '05 a 18/08', title: 'Formação de Grupos', desc: 'Período de inscrição', done: true },
    { date: '19/08 a 15/09', title: 'Envio da Proposta', desc: 'Upload do PDF', done: true },
    { date: '16/09 a 10/11', title: 'Desenvolvimento', desc: 'Período atual', current: true },
    { date: '11 a 24/11', title: 'Relatório Final', desc: 'Prazo final', done: false },
    { date: '25/11 a 02/12', title: 'Apresentações', desc: 'Banca avaliadora', done: false },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {user?.email ? `Bem-vindo, ${user.email}` : 'Visão geral do semestre 2026.2'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</span>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Turmas + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Turmas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Turmas do Semestre</h2>
            <Link href="/dashboard/turmas" className="text-sm font-medium text-[#2563eb] hover:text-[#1a4b8c] transition-colors">Ver todas</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Turma</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Curso</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Período</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Grupos</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Professor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {(turmas?.length ? turmas : [
                  { codigo: 'PI-EC8A', curso_id: 'EC', periodo: '8º', grupos: 4, professor: 'Prof. Carlos Menezes', status: 'Ativo' },
                  { codigo: 'PI-EC8B', curso_id: 'EC', periodo: '8º', grupos: 5, professor: 'Profa. Ana Lúcia', status: 'Ativo' },
                  { codigo: 'PI-EP7A', curso_id: 'EP', periodo: '7º', grupos: 6, professor: 'Prof. Ricardo Soares', status: 'Avaliando' },
                  { codigo: 'PI-EC6A', curso_id: 'EC', periodo: '6º', grupos: 3, professor: 'Prof. Felipe Alves', status: 'Ativo' },
                  { codigo: 'PI-CC7A', curso_id: 'CC', periodo: '7º', grupos: 4, professor: 'Profa. Juliana Torres', status: 'Avaliando' },
                  { codigo: 'PI-EP6A', curso_id: 'EP', periodo: '6º', grupos: 2, professor: 'Prof. Marcos Duarte', status: 'Encerrado' },
                ] as any[]).map((t, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4"><span className="font-semibold text-gray-900">{t.codigo}</span></td>
                    <td className="px-6 py-4"><span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700`}>{t.cursos?.nome || '—'}</span></td>
                    <td className="px-6 py-4 text-gray-600">{t.periodo}</td>
                    <td className="px-6 py-4 text-gray-600">{t.grupos}</td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{t.professor || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[t.status as keyof typeof statusColors] || statusColors['Ativo']}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Ciclo do Projeto</h2>
          </div>
          <div className="p-6">
            <div className="relative pl-8 space-y-0">
              {timeline.map((item, i) => (
                <div key={i} className="relative pb-6 last:pb-0">
                  <div className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 ${
                    item.done ? 'bg-emerald-500 border-emerald-500' :
                    item.current ? 'bg-[#2563eb] border-[#2563eb] ring-4 ring-blue-100' :
                    'bg-white border-gray-300'
                  }`} />
                  {i < timeline.length - 1 && (
                    <div className={`absolute left-[5px] top-[18px] w-0.5 h-[calc(100%-12px)] ${item.done ? 'bg-emerald-200' : 'bg-gray-200'}`} />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.date}</div>
                    <div className={`text-sm font-semibold mt-0.5 ${item.current ? 'text-[#2563eb]' : 'text-gray-900'}`}>{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Nova Turma', href: '/dashboard/turmas?novo=1', icon: LayoutDashboard, color: 'from-[#4fc3f7] to-[#2563eb]' },
            { label: 'Novo Grupo', href: '/dashboard/grupos?novo=1', icon: Users, color: 'from-[#34d399] to-[#059669]' },
            { label: 'Lançar Notas', href: '/dashboard/avaliacoes', icon: ClipboardCheck, color: 'from-[#fbbf24] to-[#d97706]' },
            { label: 'Exportar Dados', href: '/dashboard/notas', icon: FileText, color: 'from-[#a78bfa] to-[#7c3aed]' },
          ].map((a, i) => (
            <Link key={i} href={a.href} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <a.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
