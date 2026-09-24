'use client';

import React from 'react';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { Radio, Swords, Zap } from 'lucide-react';

export default function LiveMatchesBanner() {
  const { matches, isConnected } = useLiveMatches();

  return (
    <div className="bg-[#141e28] border-y border-[#ff4655]/20 py-3 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-[#ff4655]' : 'bg-gray-500'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-[#ff4655]' : 'bg-gray-500'}`}></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#ff4655]" />
              PLACARES EM TEMPO REAL (SSE LIVE STREAM)
            </span>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {isConnected ? '🟢 Conectado ao Servidor SSE' : '🟡 Reconectando SSE...'}
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm italic bg-[#0f1923]/60 rounded-lg border border-gray-800">
            Nenhuma partida ao vivo no momento. O worker de scraping está monitorando o VLR.gg.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m, idx) => (
              <div
                key={m.idPartida || `${m.timeCasa}-${m.timeFora}-${idx}`}
                className="bg-[#1f2326] border border-gray-800 hover:border-[#ff4655]/50 transition-all rounded-lg p-3.5 shadow-md flex flex-col justify-between"
              >
                {/* Event Name & Status */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2 border-b border-gray-800/80 pb-1.5">
                  <span className="font-medium truncate max-w-[180px]">{m.evento || 'VCT Tournament'}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff4655]/20 text-[#ff4655] uppercase animate-pulse flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    {m.status || 'AO VIVO'}
                  </span>
                </div>

                {/* Scoreboard Teams */}
                <div className="flex items-center justify-between py-1">
                  {/* Home Team */}
                  <div className="flex items-center space-x-2.5 flex-1">
                    {m.logoTimeCasa ? (
                      <img src={m.logoTimeCasa} alt={m.timeCasa} className="w-7 h-7 object-contain" />
                    ) : (
                      <div className="w-7 h-7 bg-gray-800 rounded flex items-center justify-center font-bold text-xs text-white">
                        {m.timeCasa.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-sm text-white truncate max-w-[90px]">{m.timeCasa}</span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center space-x-2 px-3 py-1 bg-[#0f1923] rounded border border-gray-700/60 font-mono font-black text-base text-white">
                    <span className={m.pontuacaoCasa > m.pontuacaoFora ? 'text-[#ff4655]' : 'text-gray-200'}>
                      {m.pontuacaoCasa}
                    </span>
                    <span className="text-gray-500">:</span>
                    <span className={m.pontuacaoFora > m.pontuacaoCasa ? 'text-[#ff4655]' : 'text-gray-200'}>
                      {m.pontuacaoFora}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center space-x-2.5 flex-1 justify-end">
                    <span className="font-bold text-sm text-white truncate max-w-[90px] text-right">{m.timeFora}</span>
                    {m.logoTimeFora ? (
                      <img src={m.logoTimeFora} alt={m.timeFora} className="w-7 h-7 object-contain" />
                    ) : (
                      <div className="w-7 h-7 bg-gray-800 rounded flex items-center justify-center font-bold text-xs text-white">
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
