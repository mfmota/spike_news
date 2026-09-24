'use client';

import React from 'react';
import Link from 'next/link';
import { News } from '@/types';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  const formattedDate = news.dataPublicacao
    ? new Date(news.dataPublicacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <article className="bg-[#1f2326] border border-gray-800 rounded-xl overflow-hidden hover:border-[#ff4655]/60 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-[#ff4655]/10">
      <div className="p-6">
        
        {/* Meta badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {news.timeNome ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#ff4655]/10 text-[#ff4655] border border-[#ff4655]/20">
              {news.timeLogo && <img src={news.timeLogo} alt="" className="w-3.5 h-3.5 object-contain" />}
              {news.timeNome}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-800 text-gray-300">
              Geral / Patch
            </span>
          )}

          <div className="flex items-center text-xs text-gray-400 gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#ff4655]" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#ff4655] transition-colors leading-snug mb-3">
          <Link href={`/noticias/${news.id}`}>
            {news.titulo}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed mb-4">
          {news.conteudo}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#181c1f] border-t border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <User className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-medium text-gray-300">{news.autorNome}</span>
        </div>

        <Link
          href={`/noticias/${news.id}`}
          className="text-[#ff4655] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors group-hover:translate-x-1 duration-200"
        >
          Ler matéria completa
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
