"use client"

import { ArrowLeft } from "next/navigation"
import Link from "next/link"

export default function Page() {
  return (
    <div className="p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Grupos</h1>
      <p className="text-gray-500">Página em construcao. Volte em breve.</p>
    </div>
  )
}
