'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Inter } from 'next/font/google'
import {
  LayoutDashboard,
  Users,
  Users2,
  BookOpen,
  FileText,
  ClipboardCheck,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

/* ── Navigation items ── */
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Turmas', href: '/dashboard/turmas', icon: Users },
  { name: 'Grupos', href: '/dashboard/grupos', icon: Users2 },
  { name: 'Projetos', href: '/dashboard/projetos', icon: BookOpen },
  { name: 'Documentação', href: '/dashboard/documentacao', icon: FileText },
  { name: 'Avaliações', href: '/dashboard/avaliacoes', icon: ClipboardCheck },
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`${inter.className} flex h-screen overflow-hidden bg-gray-100`}>
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#162a4a] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] font-extrabold text-white shadow-lg">
              SG
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight text-white">
                UNIG
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 leading-none">
                SGPI
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border border-[#4fc3f7]/20 bg-[#2563eb]/20 text-[#4fc3f7] shadow-sm'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? 'text-[#4fc3f7]' : 'text-gray-400'
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <div className="nav-dot ml-auto h-1.5 w-1.5 rounded-full bg-[#4fc3f7]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-white/10 p-4">
          <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] text-xs font-bold text-white">
              C
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                Coordenação
              </p>
              <p className="truncate text-xs text-gray-400">
                coordenacao@unig.br
              </p>
            </div>
            <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <span className="hidden text-sm text-gray-500 sm:block">
            2026.2
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] text-xs font-bold text-white">
            C
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
