'use client'

import { useState } from 'react'
import { ArrowLeft, FileText, Download, ExternalLink, BookOpen, GraduationCap, ClipboardList } from 'lucide-react'
import Link from 'next/link'

export default function DocumentacaoPage() {
  const [search, setSearch] = useState('')

  const docs = [
    {
      categoria: 'Manuais do Sistema',
      icon: BookOpen,
      itens: [
        { nome: 'Guia de Uso — Coordenação', desc: 'Cadastro de turmas, ciclos e avaliadores', formato: 'PDF', tamanho: '2.4 MB' },
        { nome: 'Guia de Uso — Professor', desc: 'Lançamento de notas e feedback', formato: 'PDF', tamanho: '1.8 MB' },
        { nome: 'Guia de Uso — Aluno', desc: 'Formação de grupos e upload de documentos', formato: 'PDF', tamanho: '1.2 MB' },
      ]
    },
    {
      categoria: 'Normas e Regulamentos',
      icon: ClipboardList,
      itens: [
        { nome: 'Regulamento do Projeto Integrador', desc: 'Diretrizes da disciplina', formato: 'PDF', tamanho: '3.1 MB' },
        { nome: 'Critérios de Avaliação', desc: 'Pesos P1 e P2, rubricas', formato: 'PDF', tamanho: '0.8 MB' },
        { nome: 'Modelo de Proposta', desc: 'Template para proposta de projeto', formato: 'DOCX', tamanho: '0.5 MB' },
      ]
    },
    {
      categoria: 'Materiais de Apoio',
      icon: GraduationCap,
      itens: [
        { nome: 'Apresentação SGPI — Coordenação', desc: 'Slides de apresentação do sistema', formato: 'PPTX', tamanho: '5.2 MB' },
        { nome: 'Tutorial em Vídeo', desc: 'Passo a passo do fluxo completo', formato: 'MP4', tamanho: '45 MB' },
        { nome: 'FAQ — Perguntas Frequentes', desc: 'Dúvidas comuns sobre o SGPI', formato: 'PDF', tamanho: '0.3 MB' },
      ]
    },
  ]

  const filtered = search
    ? docs.map(cat => ({
        ...cat,
        itens: cat.itens.filter(i =>
          i.nome.toLowerCase().includes(search.toLowerCase()) ||
          i.desc.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(cat => cat.itens.length > 0)
    : docs

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentação</h1>
          <p className="text-sm text-gray-500 mt-1">Manuais, normas e materiais de apoio do SGPI</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Buscar na documentação..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 outline-none" />
      </div>

      {/* Docs grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Nenhum documento encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Tente termos como "guia", "manual" ou "regulamento"</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((cat, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#4fc3f7] to-[#2563eb] flex items-center justify-center">
                  <cat.icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{cat.categoria}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.itens.map((doc, j) => (
                  <div key={j} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <FileText className="h-5 w-5 text-[#2563eb]" />
                      </div>
                      <span className="text-xs font-semibold text-gray-400 px-2 py-0.5 bg-gray-100 rounded-md">{doc.formato}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{doc.nome}</h3>
                    <p className="text-xs text-gray-500 mb-3">{doc.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{doc.tamanho}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg text-[#2563eb] hover:bg-blue-50 transition-colors" title="Download">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-[#2563eb] hover:bg-blue-50 transition-colors" title="Abrir">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
