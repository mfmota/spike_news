'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { CalendarClock, History, Trophy } from 'lucide-react';

interface Match {
  idPartida?: number;
  idExterno?: string;
  timeCasa: string;
  logoTimeCasa?: string;
  timeFora: string;
  logoTimeFora?: string;
  pontuacaoCasa: number;
  pontuacaoFora: number;
  status: string;
  evento: string;
}

export default function MatchBoard() {
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [recent, setRecent] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Busca simultânea usando o novo formato da API
        const [upcomingRes, recentRes] = await Promise.all([
          api.get('/matches?status=AGENDADO&limit=4'),
          api.get('/matches?status=FINALIZADO&limit=4')
        ]);
        
        setUpcoming(upcomingRes.data || []);
        setRecent(recentRes.data || []);
      } catch (err) {
        console.error('Erro ao buscar partidas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const renderTeam = (name: string, logo?: string) => (
    <div className="flex items-center gap-2">
      {logo ? (
        <img src={logo} alt={name} className="w-6 h-6 object-contain" />
      ) : (
        <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center font-bold text-[10px] text-white">
          {name.substring(0, 2).toUpperCase()}
        </div>
      )}
      <span className="font-bold text-sm text-white truncate max-w-[100px]">{name}</span>
    </div>
  );

  if (loading) return null; // Ou um skeleton loader discreto

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Coluna: Próximos Jogos */}
        <div className="bg-[#141e28]/50 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Próximos Jogos</h3>
          </div>
          
          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Nenhum jogo agendado.</p>
            ) : (
              upcoming.map((m, i) => (
                <div key={m.idExterno || i} className="flex items-center justify-between bg-[#1f2326] p-3 rounded-xl border border-gray-800/60 hover:border-amber-500/30 transition-colors">
                  {renderTeam(m.timeCasa, m.logoTimeCasa)}
                  <span className="text-[10px] font-bold text-gray-500 uppercase px-2">VS</span>
                  <div className="flex justify-end w-[130px]">
                    {renderTeam(m.timeFora, m.logoTimeFora)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna: Resultados Recentes */}
        <div className="bg-[#141e28]/50 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Resultados Recentes</h3>
          </div>
          
          <div className="space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Nenhum resultado recente.</p>
            ) : (
              recent.map((m, i) => {
                const casaVenceu = m.pontuacaoCasa > m.pontuacaoFora;
                const foraVenceu = m.pontuacaoFora > m.pontuacaoCasa;

                return (
                  <div key={m.idExterno || i} className="flex items-center justify-between bg-[#1f2326] p-3 rounded-xl border border-gray-800/60 hover:border-emerald-500/30 transition-colors">
                    <div className={`flex items-center gap-2 ${casaVenceu ? 'opacity-100' : 'opacity-60'}`}>
                      {m.logoTimeCasa ? <img src={m.logoTimeCasa} className="w-6 h-6 object-contain" /> : <div className="w-6 h-6 bg-gray-800 rounded" />}
                      <span className="font-bold text-sm text-white truncate max-w-[80px]">{m.timeCasa}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono font-black text-sm">
                      <span className={casaVenceu ? 'text-emerald-500' : 'text-gray-400'}>{m.pontuacaoCasa}</span>
                      <span className="text-gray-600">-</span>
                      <span className={foraVenceu ? 'text-emerald-500' : 'text-gray-400'}>{m.pontuacaoFora}</span>
                    </div>

                    <div className={`flex items-center gap-2 justify-end w-[110px] ${foraVenceu ? 'opacity-100' : 'opacity-60'}`}>
                      <span className="font-bold text-sm text-white truncate max-w-[80px] text-right">{m.timeFora}</span>
                      {m.logoTimeFora ? <img src={m.logoTimeFora} className="w-6 h-6 object-contain" /> : <div className="w-6 h-6 bg-gray-800 rounded" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}