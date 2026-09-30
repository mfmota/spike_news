'use client';

import React from 'react';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { Radio, Zap, Swords } from 'lucide-react';

export default function LiveMatchesBanner() {
  const { matches, isConnected } = useLiveMatches();

  return (
    <div className="bg-[#141e28] border-y border-[#ff4655]/20 py-3.5 mb-8 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-[#ff4655]' : 'bg-amber-500'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-[#ff4655]' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5 font-sans">
              <Radio className="w-3.5 h-3.5 text-[#ff4655]" />
              PLACARES EM TEMPO REAL (VCT LIVE)
            </span>
          </div>

          <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{isConnected ? 'Stream SSE Ativo' : 'Reconectando SSE...'}</span>
          </div>
        </div>

        {/* Live Matches List */}
        {matches.length === 0 ? (
          <div className="text-center py-5 px-4 text-gray-400 text-xs sm:text-sm italic bg-[#0f1923]/60 rounded-xl border border-gray-800">
            Nenhuma partida ao vivo no momento. O worker de scraping está sincronizando com o VLR.gg.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {matches.map((m, idx) => (
              <div
                key={m.idPartida || `${m.timeCasa}-${m.timeFora}-${idx}`}
                className="bg-[#1f2326] border border-gray-800 hover:border-[#ff4655]/50 transition-all rounded-xl p-3.5 shadow-md flex flex-col justify-between"
              >
                {/* Event Name & Status */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2.5 border-b border-gray-800/80 pb-1.5">
                  <span className="font-medium truncate max-w-[150px] sm:max-w-[180px]">{m.evento || 'VCT Tournament'}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff4655]/20 text-[#ff4655] uppercase animate-pulse flex items-center gap-1 flex-shrink-0">
                    <Zap className="w-2.5 h-2.5" />
                    {m.status || 'AO VIVO'}
                  </span>
                </div>

                {/* Scoreboard Teams */}
                <div className="flex items-center justify-between gap-2 py-1">
                  {/* Home Team */}
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {m.logoTimeCasa ? (
                      <img src={m.logoTimeCasa} alt={m.timeCasa} className="w-7 h-7 object-contain flex-shrink-0" />
                    ) : (
                      <div className="w-7 h-7 bg-gray-800 rounded flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                        {m.timeCasa.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-xs sm:text-sm text-white truncate">{m.timeCasa}</span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#0f1923] rounded-lg border border-gray-700/60 font-mono font-black text-sm sm:text-base text-white flex-shrink-0">
                    <span className={m.pontuacaoCasa > m.pontuacaoFora ? 'text-[#ff4655]' : 'text-gray-200'}>
                      {m.pontuacaoCasa}
                    </span>
                    <span className="text-gray-500">:</span>
                    <span className={m.pontuacaoFora > m.pontuacaoCasa ? 'text-[#ff4655]' : 'text-gray-200'}>
                      {m.pontuacaoFora}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center space-x-2 flex-1 min-w-0 justify-end">
                    <span className="font-bold text-xs sm:text-sm text-white truncate text-right">{m.timeFora}</span>
                    {m.logoTimeFora ? (
                      <img src={m.logoTimeFora} alt={m.timeFora} className="w-7 h-7 object-contain flex-shrink-0" />
                    ) : (
                      <div className="w-7 h-7 bg-gray-800 rounded flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                        {m.timeFora.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
