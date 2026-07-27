'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react'
import Link from 'next/link'

const projetos = [
  { grupo: 'G01', tema: 'Fundações em solo residual', membros: 'Vinicius, Ana, João', proposta: true, relatorio: true, status: 'entregue' },
  { grupo: 'G02', tema: 'Contenção de taludes urbanos', membros: 'Lucas, Beatriz, Carla', proposta: true, relatorio: false, status: 'andamento' },
  { grupo: 'G03', tema: 'Patologia em pontes de concreto', membros: 'Diego, Amanda, Rafael', proposta: true, relatorio: false, status: 'andamento' },
  { grupo: 'G04', tema: 'Reaproveitamento de águas pluviais', membros: 'Marina, Thiago, Eduardo', proposta: true, relatorio: true, status: 'entregue' },
]

export default function ProjetosPage() {
  const [uploading, setUploading] = useState<string | null>(null)

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhamento das entregas dos grupos</p>
        </div>
      </div>

      {/* Timeline de entregas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Propostas</span>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">4/4</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">100% entregues</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Relatórios</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">2/4</div>
          <div className="text-xs text-amber-600 font-medium mt-1">50% entregues</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avaliações</span>
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">0/4</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Aguardando</div>
        </div>
      </div>

      {/* Lista de projetos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Grupo</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Tema</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Membros</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Proposta</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Relatório</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {projetos.map((p, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">{p.grupo}</td>
                  <td className="px-5 py-4 text-gray-600 max-w-[200px] truncate">{p.tema}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm hidden md:table-cell">{p.membros}</td>
                  <td className="px-5 py-4 text-center">
                    {p.proposta ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Enviado
                      </span>
                    ) : (
                      <button className="inline-flex items-center gap-1 text-[#2563eb] text-xs font-medium hover:text-[#1a4b8c]">
                        <Upload className="h-3.5 w-3.5" /> Upload
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {p.relatorio ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Enviado
                      </span>
                    ) : (
                      <button className="inline-flex items-center gap-1 text-amber-500 text-xs font-medium hover:text-amber-600">
                        <Upload className="h-3.5 w-3.5" /> Upload
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'entregue' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {p.status === 'entregue' ? '✅ Completo' : '⏳ Em andamento'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload area */}
      <div className="mt-6 bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center hover:border-[#2563eb]/30 transition-colors">
        <Upload className="h-10 w-10 mx-auto text-gray-300 mb-3" />
        <h3 className="text-base font-semibold text-gray-700 mb-1">Upload de Documentos</h3>
        <p className="text-sm text-gray-400 mb-4">Arraste o PDF ou clique para selecionar (máx. 20 MB)</p>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-[#1a4b8c] cursor-pointer transition-colors shadow-sm">
          <Upload className="h-4 w-4" /> Selecionar Arquivo
          <input type="file" accept=".pdf" className="hidden" />
        </label>
        <p className="text-xs text-gray-400 mt-2">Formatos aceitos: PDF</p>
      </div>
    </div>
  )
}
