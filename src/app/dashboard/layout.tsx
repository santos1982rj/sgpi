'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, Users2, BookOpen, FileText,
  ClipboardCheck, Settings, LogOut, Menu, X, ChevronDown, Bell
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Turmas', href: '/dashboard/turmas', icon: Users },
  { name: 'Grupos', href: '/dashboard/grupos', icon: Users2 },
  { name: 'Projetos', href: '/dashboard/projetos', icon: BookOpen },
  { name: 'Avaliações', href: '/dashboard/avaliacoes', icon: ClipboardCheck },
  { name: 'Documentação', href: '/dashboard/documentacao', icon: FileText },
]

const secondaryNav = [
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch {
      router.push('/auth/login')
    }
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a1628] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] font-extrabold text-white shadow-lg text-sm">SG</div>
            <div>
              <div className="text-base font-bold leading-none text-white tracking-tight">UNIG</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 leading-none mt-0.5">SGPI</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href) ? 'bg-[#4fc3f7]/10 text-[#4fc3f7]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}>
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="px-3 pb-2 text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Sistema</div>
            {secondaryNav.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href) ? 'bg-[#4fc3f7]/10 text-[#4fc3f7]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}>
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-4 shrink-0">
          <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-white/5 transition-colors relative">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-xs font-bold text-white shrink-0">MC</div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-white truncate">Maria da Coord.</div>
              <div className="text-[11px] text-gray-500">Administradora</div>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">SGPI</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Sistema de Gestão de Projetos Integradores • 2026.2</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#4fc3f7]" />
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-xs font-bold text-white">MC</div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900 leading-tight">Maria da Coordenação</div>
                  <div className="text-xs text-gray-500">coordenacao@unig.br</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
