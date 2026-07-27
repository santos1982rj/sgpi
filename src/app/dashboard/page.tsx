'use client'

import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  CheckCircle2,
  Clock,
  CircleDot,
  ArrowRight,
} from 'lucide-react'

// ── Mock data ──────────────────────────────────────────────

const stats = [
  { label: 'Turmas', value: 6, icon: LayoutDashboard, color: 'from-[#4fc3f7] to-[#2563eb]' },
  { label: 'Grupos', value: 24, icon: Users, color: 'from-[#a78bfa] to-[#7c3aed]' },
  { label: 'Avaliadores', value: 12, icon: UserCheck, color: 'from-[#34d399] to-[#059669]' },
  { label: 'Notas Lançadas', value: '16/24', icon: GraduationCap, color: 'from-[#fbbf24] to-[#d97706]' },
]

const turmas = [
  { id: 'ECS-101', disciplina: 'Eng. Civil — Estruturas', vagas: 40, grupos: 6, etapa: 'Documentação', status: 'Em andamento' as const },
  { id: 'ECS-102', disciplina: 'Eng. Civil — Geotecnia', vagas: 35, grupos: 5, etapa: 'Formação', status: 'Pendente' as const },
  { id: 'ECS-103', disciplina: 'Eng. Civil — Hidráulica', vagas: 30, grupos: 4, etapa: 'Entrega Final', status: 'Atrasado' as const },
  { id: 'ECS-104', disciplina: 'Eng. Civil — Transportes', vagas: 45, grupos: 6, etapa: 'Avaliação', status: 'Em andamento' as const },
  { id: 'ECS-105', disciplina: 'Eng. Civil — Materiais', vagas: 35, grupos: 3, etapa: 'Formação', status: 'Pendente' as const },
  { id: 'ECS-106', disciplina: 'Eng. Civil — Construção Civil', vagas: 40, grupos: 4, etapa: 'Documentação', status: 'Em andamento' as const },
]

const etapas = [
  { nome: 'Cadastro de Turmas', descricao: 'Turmas e horários definidos', concluida: true, ativa: false },
  { nome: 'Formação de Grupos', descricao: 'Alunos alocados nos grupos', concluida: false, ativa: true },
  { nome: 'Documentação', descricao: 'Envio dos documentos do projeto', concluida: false, ativa: false },
  { nome: 'Avaliação', descricao: 'Correção pelos avaliadores', concluida: false, ativa: false },
  { nome: 'Resultado Final', descricao: 'Notas e feedback publicados', concluida: false, ativa: false },
]

// ── Helpers ────────────────────────────────────────────────

const statusBadge = (status: 'Em andamento' | 'Pendente' | 'Atrasado') => {
  const map = {
    'Em andamento': 'bg-[rgba(79,195,247,0.15)] text-[#4fc3f7] border-[rgba(79,195,247,0.3)]',
    Pendente: 'bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border-[rgba(251,191,36,0.3)]',
    Atrasado: 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border-[rgba(239,68,68,0.3)]',
  }
  return map[status]
}

// ── Components ─────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6 transition hover:bg-[rgba(255,255,255,0.06)] hover:shadow-lg hover:shadow-[rgba(79,195,247,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {label}
          </p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  )
}

function TurmasTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-6 py-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
          Turmas Ativas
        </h3>
        <span className="rounded-full bg-[rgba(79,195,247,0.15)] px-3 py-1 text-xs font-semibold text-[#4fc3f7]">
          {turmas.length} turmas
        </span>
      </div>

      {/* Responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.06)] text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Disciplina</th>
              <th className="px-6 py-4 text-center">Vagas</th>
              <th className="px-6 py-4 text-center">Grupos</th>
              <th className="px-6 py-4">Etapa</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((t) => (
              <tr
                key={t.id}
                className="border-b border-[rgba(255,255,255,0.04)] transition hover:bg-[rgba(255,255,255,0.02)] last:border-0"
              >
                <td className="px-6 py-4 font-mono text-xs font-medium text-[#4fc3f7]">
                  {t.id}
                </td>
                <td className="px-6 py-4 text-white">{t.disciplina}</td>
                <td className="px-6 py-4 text-center text-gray-400">{t.vagas}</td>
                <td className="px-6 py-4 text-center text-gray-400">{t.grupos}</td>
                <td className="px-6 py-4 text-gray-300">{t.etapa}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${statusBadge(t.status)}`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Timeline() {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-6 py-6">
      <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">
        Cronograma — Etapas
      </h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[9px] top-3 h-full w-px bg-[rgba(255,255,255,0.08)]" />

        <div className="space-y-6">
          {etapas.map((etapa, i) => (
            <div key={etapa.nome} className="relative flex items-start gap-4">
              {/* Dot */}
              <div className="relative z-10 mt-0.5">
                {etapa.concluida ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#34d399] to-[#059669] shadow-lg shadow-[rgba(52,211,153,0.2)]">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                ) : etapa.ativa ? (
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <div className="absolute h-5 w-5 animate-ping rounded-full bg-[#4fc3f7] opacity-40" />
                    <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#4fc3f7]">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)]">
                    <CircleDot className="h-3 w-3 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      etapa.concluida
                        ? 'text-[#34d399]'
                        : etapa.ativa
                          ? 'text-[#4fc3f7]'
                          : 'text-gray-400'
                    }`}
                  >
                    {etapa.nome}
                  </span>
                  {etapa.concluida && (
                    <span className="rounded-full bg-[rgba(52,211,153,0.12)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#34d399]">
                      Concluída
                    </span>
                  )}
                  {etapa.ativa && (
                    <span className="rounded-full bg-[rgba(79,195,247,0.15)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#4fc3f7]">
                      Em andamento
                    </span>
                  )}
                </div>
                <p
                  className={`mt-0.5 text-xs ${
                    etapa.concluida ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  {etapa.descricao}
                </p>
              </div>

              {/* Connector arrow (between items) */}
              {i < etapas.length - 1 && (
                <div className="hidden sm:flex items-center self-stretch pr-2">
                  <ArrowRight className="h-3 w-3 text-[rgba(255,255,255,0.1)]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Fixed header */}
      <header className="sticky top-0 z-30 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,22,40,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] font-extrabold text-sm text-white shadow-lg">
              SG
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white">
                SGPI — UNIG
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Gestão de Projetos Integradores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="rounded-full bg-[rgba(79,195,247,0.12)] px-3 py-1 text-xs font-medium text-[#4fc3f7]">
              2026.2
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] text-xs font-bold text-white">
              C
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Stats grid */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Visão Geral
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </section>

        {/* Two-column layout: table + timeline */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section>
            <TurmasTable />
          </section>
          <aside>
            <Timeline />
          </aside>
        </div>
      </main>
    </div>
  )
}
