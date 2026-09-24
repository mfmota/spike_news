'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { News } from '@/types';
import api from '@/services/api';
import { ArrowLeft, Calendar, User, Shield, Share2 } from 'lucide-react';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      api.get(`/news/${params.id}`)
        .then((res) => {
          setNews(res.data);
        })
        .catch((err) => {
          console.error('Erro ao carregar notícia:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        Carregando matéria...
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        <h2 className="text-2xl font-bold text-white mb-2">Matéria não encontrada</h2>
        <button
          onClick={() => router.push('/')}
          className="text-[#ff4655] hover:underline font-bold mt-4"
        >
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  const formattedDate = news.dataPublicacao
    ? new Date(news.dataPublicacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-[#ff4655]" />
        Voltar para notícias
      </button>

      {/* Team & Category Header */}
      <div className="flex items-center gap-3 mb-4">
        {news.timeNome ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#ff4655]/10 border border-[#ff4655]/30 text-[#ff4655] text-xs font-bold uppercase">
            {news.timeLogo && <img src={news.timeLogo} alt="" className="w-4 h-4 object-contain" />}
            {news.timeNome}
          </span>
        ) : (
          <span className="px-3 py-1 rounded bg-gray-800 text-gray-300 text-xs font-bold uppercase">
            Cenário Geral
          </span>
        )}
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-6">
        {news.titulo}
      </h1>

      {/* Author and Date Meta */}
      <div className="flex items-center justify-between border-y border-gray-800 py-4 mb-8 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#ff4655]" />
            <span className="font-semibold text-gray-200">{news.autorNome}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: news.titulo, url: window.location.href });
            }
          }}
          className="hover:text-white transition-colors"
          title="Compartilhar"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none text-gray-200 text-base leading-relaxed whitespace-pre-line bg-[#1f2326]/40 p-8 rounded-xl border border-gray-800/80">
        {news.conteudo}
      </div>

    </div>
  );
}
