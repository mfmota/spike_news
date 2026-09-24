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
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0f1923] via-[#1a2733] to-[#0f1923] border-b border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4655]/10 border border-[#ff4655]/30 text-[#ff4655] text-xs font-bold uppercase mb-4 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Temporada Oficial VCT 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              ACOMPANHE O CENÁRIO <br />
              COMPETITIVO DE <span className="text-[#ff4655]">VALORANT</span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-xl text-base leading-relaxed">
              Notícias exclusivas da redação, estatísticas atualizadas via web scraping e placares ao vivo com tecnologia Server-Sent Events.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadPublicCsv}
              disabled={downloadingCsv}
              className="bg-[#1f2326] hover:bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:border-[#ff4655]/50"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#ff4655]" />
              Últimas Matérias & Análises
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Reportagens e análises táticas da nossa equipe editorial</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setSelectedTeam(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTeam === null
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Todas as Notícias
            </button>
            <button
              onClick={() => setSelectedTeam(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTeam === 1
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              LOUD
            </button>
            <button
              onClick={() => setSelectedTeam(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTeam === 2
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Sentinels
            </button>
            <button
              onClick={() => setSelectedTeam(3)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTeam === 3
                  ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                  : 'bg-[#1f2326] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              Fnatic
            </button>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="w-8 h-8 text-[#ff4655] animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Carregando notícias da redação...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="bg-[#1f2326] border border-gray-800 rounded-xl p-12 text-center text-gray-400">
            <p className="text-base font-semibold text-gray-300 mb-1">Nenhuma notícia encontrada para este filtro.</p>
            <p className="text-sm">Selecione outro time ou visualize todas as matérias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
