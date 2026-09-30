'use client';

import React, { useEffect, useState } from 'react';
import LiveMatchesBanner from '@/components/LiveMatchesBanner';
import NewsCard from '@/components/NewsCard';
import { News, Team } from '@/types';
import api from '@/services/api';
import { Flame, Download, RefreshCw, Filter, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);

  const fetchNews = async (teamId?: number | null) => {
    setLoading(true);
    try {
      const url = teamId ? `/news?teamId=${teamId}` : '/news?page=0&size=20';
      const response = await api.get(url);
      if (response.data && response.data.content) {
        setNewsList(response.data.content);
      } else if (Array.isArray(response.data)) {
        setNewsList(response.data);
      }
    } catch (err) {
      console.error('Erro ao buscar notícias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedTeam);
  }, [selectedTeam]);

  const handleDownloadPublicCsv = async () => {
    setDownloadingCsv(true);
    try {
      const response = await api.get('/reports/public/stats/csv', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `spike_news_estatisticas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao baixar relatório CSV:', err);
    } finally {
      setDownloadingCsv(false);
    }
  };

  return (
    <div className="min-h-screen">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0f1923] via-[#1a2733] to-[#0f1923] border-b border-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4655]/10 border border-[#ff4655]/30 text-[#ff4655] text-xs font-bold uppercase mb-3 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Temporada Oficial VCT 2026 • PWA App
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase font-sans">
              ACOMPANHE O CENÁRIO <br className="hidden sm:inline" />
              COMPETITIVO DE <span className="text-[#ff4655]">VALORANT</span>
            </h1>
            <p className="mt-3 text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Notícias exclusivas da redação, estatísticas atualizadas via web scraping e placares ao vivo com tecnologia Server-Sent Events.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadPublicCsv}
              disabled={downloadingCsv}
              className="w-full sm:w-auto bg-[#1f2326] hover:bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:border-[#ff4655]/50 active:scale-95"
            >
              <Download className="w-4 h-4 text-[#ff4655]" />
              {downloadingCsv ? 'Exportando CSV...' : 'Baixar Estatísticas (CSV)'}
            </button>
          </div>
        </div>
      </div>

      {/* Realtime Live Matches SSE Banner */}
      <LiveMatchesBanner />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* News Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff4655]" />
              Últimas Matérias & Análises
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Reportagens e análises táticas da nossa equipe editorial</p>
          </div>

          {/* Filter Buttons (Touch scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTeam(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTeam === null
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Todas as Notícias
            </button>
            <button
              onClick={() => setSelectedTeam(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTeam === 1
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              LOUD
            </button>
            <button
              onClick={() => setSelectedTeam(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTeam === 2
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Sentinels
            </button>
            <button
              onClick={() => setSelectedTeam(3)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTeam === 3
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Fnatic
            </button>
            <button
              onClick={() => setSelectedTeam(4)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedTeam === 4
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Paper Rex
            </button>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-20 bg-[#1f2326]/40 rounded-2xl border border-gray-800">
            <RefreshCw className="w-8 h-8 text-[#ff4655] animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-xs sm:text-sm">Carregando notícias da redação...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="bg-[#1f2326] border border-gray-800 rounded-2xl p-12 text-center text-gray-400 shadow-lg">
            <p className="text-base font-semibold text-gray-300 mb-1">Nenhuma notícia encontrada para este filtro.</p>
            <p className="text-xs sm:text-sm">Selecione outro time ou visualize todas as matérias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {newsList.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
