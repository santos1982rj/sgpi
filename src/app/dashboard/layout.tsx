'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Users, Users2, BookOpen, FileText,
  ClipboardCheck, Settings, LogOut, Menu, X, Bell, Award
} from 'lucide-react'

const roleNav: Record<string, { name: string; href: string; icon: any }[]> = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Turmas', href: '/dashboard/turmas', icon: Users },
    { name: 'Grupos', href: '/dashboard/grupos', icon: Users2 },
    { name: 'Projetos', href: '/dashboard/projetos', icon: BookOpen },
    { name: 'Avaliações', href: '/dashboard/avaliacoes', icon: ClipboardCheck },
    { name: 'Notas', href: '/dashboard/notas', icon: Award },
    { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
  ],
  secretaria: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Turmas', href: '/dashboard/turmas', icon: Users },
    { name: 'Grupos', href: '/dashboard/grupos', icon: Users2 },
    { name: 'Projetos', href: '/dashboard/projetos', icon: BookOpen },
  ],
  professor: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Minhas Turmas', href: '/dashboard/turmas', icon: Users },
    { name: 'Avaliações', href: '/dashboard/avaliacoes', icon: ClipboardCheck },
  ],
  aluno: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Meu Grupo', href: '/dashboard/grupos', icon: Users2 },
    { name: 'Documentos', href: '/dashboard/projetos', icon: BookOpen },
    { name: 'Minhas Notas', href: '/dashboard/notas', icon: Award },
  ],
}

const roleLabels: Record<string, string> = {
  admin: 'Administradora',
  secretaria: 'Secretaria',
  professor: 'Professor',
  aluno: 'Aluno',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState('admin')
  const [userName, setUserName] = useState('Maria da Coord.')
  const [userEmail, setUserEmail] = useState('')
  const [userInitials, setUserInitials] = useState('MC')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/auth/login')
      
      const { data: profile } = await supabase.from('profiles').select('nome, role').eq('id', user.id).single()
      if (profile) {
        setUserRole(profile.role)
        setUserName(profile.nome)
        setUserEmail(user.email || '')
        setUserInitials(profile.nome.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase())
      }
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const navigation = roleNav[userRole] || roleNav.admin
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a1628] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] font-extrabold text-white shadow-lg text-sm">SG</div>
            <div>
              <div className="text-base font-bold leading-none text-white tracking-tight">UNIG</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 leading-none mt-0.5">SGPI</div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href) ? 'bg-[#4fc3f7]/10 text-[#4fc3f7]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}>
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="border-t border-white/10 p-4 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-xs font-bold text-white shrink-0">{userInitials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{userName}</div>
              <div className="text-[11px] text-gray-500">{roleLabels[userRole] || 'Usuário'}</div>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg text-gray-500 hover:bg-white/10 hover:text-red-400 transition-colors" title="Sair">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
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
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center text-xs font-bold text-white">{userInitials}</div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900 leading-tight">{userName}</div>
                  <div className="text-xs text-gray-500">{roleLabels[userRole]} • {userEmail}</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
