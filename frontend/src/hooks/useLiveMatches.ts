'use client';

import { useState, useEffect } from 'react';
import { Match } from '@/types';
import api from '@/services/api';

export function useLiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // 1. Carga inicial via REST
    api.get('/matches/live')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMatches(res.data);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar partidas ao vivo iniciais:', err);
      });

    // 2. Conexão SSE
    const sseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/matches/stream`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.addEventListener('CONNECTED', (e: MessageEvent) => {
      setIsConnected(true);
    });

    eventSource.addEventListener('match-update', (e: MessageEvent) => {
      try {
        const updatedMatch: Match = JSON.parse(e.data);
        setMatches((prev) => {
          const index = prev.findIndex((m) => 
            (m.idPartida && updatedMatch.idPartida && m.idPartida === updatedMatch.idPartida) ||
            (m.timeCasa === updatedMatch.timeCasa && m.timeFora === updatedMatch.timeFora)
          );

          if (index >= 0) {
            const next = [...prev];
            next[index] = updatedMatch;
            return next;
          } else {
            return [updatedMatch, ...prev];
          }
        });
      } catch (err) {
        console.error('Erro ao processar evento SSE de partida:', err);
      }
    });

    eventSource.onerror = (err) => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { matches, isConnected };
}
