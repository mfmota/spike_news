'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Preference, AlertType } from '@/types';
import api from '@/services/api';
import { Bell, Shield, Trash2, Plus, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function PreferencesPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('1');
  const [alertType, setAlertType] = useState<AlertType>('AMBOS');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const response = await api.get('/preferences');
      if (Array.isArray(response.data)) {
        setPreferences(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar preferências:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPreferences();
    }
  }, [isAuthenticated]);

  const handleSavePreference = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await api.post('/preferences', {
        teamId: parseInt(selectedTeamId, 10),
        tipoAlerta: alertType,
      });
      setMessage({ type: 'success', text: 'Preferência de alerta configurada com sucesso!' });
      loadPreferences();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao salvar preferência.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePreference = async (teamId: number) => {
    try {
      await api.delete(`/preferences/${teamId}`);
      setMessage({ type: 'success', text: 'Alerta removido com sucesso.' });
      loadPreferences();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao remover alerta.' });
    }
  };

  if (authLoading || !isAuthenticated) {
    return <div className="text-center py-20 text-gray-400">Verificando autenticação...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-[#ff4655] uppercase tracking-widest font-mono">
          MOTOR DE PREFERÊNCIAS E ALERTAS (RF04)
        </span>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
          Times Favoritos & Notificações
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Receba atualizações personalizadas quando seu time jogar ou tiver notícias publicadas.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-xs flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add preference form */}
      <div className="bg-[#1f2326] border border-gray-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-xl">
        <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2 mb-6 border-b border-gray-800 pb-3">
          <Bell className="w-5 h-5 text-[#ff4655]" />
          Adicionar Novo Time aos Alertas
        </h2>

        <form onSubmit={handleSavePreference} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Time de VALORANT
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full bg-[#0f1923] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
            >
              <option value="1">LOUD</option>
              <option value="2">Sentinels</option>
              <option value="3">Fnatic</option>
              <option value="4">Paper Rex</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Tipo de Alerta
            </label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as AlertType)}
              className="w-full bg-[#0f1923] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
            >
              <option value="AMBOS">Jogos e Notícias (Completo)</option>
              <option value="JOGOS">Apenas Placares de Jogos</option>
              <option value="NOTICIAS">Apenas Matérias & Notícias</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#ff4655] hover:bg-[#e03a49] text-white py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#ff4655]/30 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Alerta'}
            </button>
          </div>
        </form>
      </div>

      {/* Preferences List */}
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#ff4655]" />
          Seus Times Inscritos ({preferences.length})
        </h2>

        {loading ? (
          <div className="text-center py-10 text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ff4655]" />
            Carregando preferências...
          </div>
        ) : preferences.length === 0 ? (
          <div className="bg-[#1f2326] border border-gray-800 rounded-xl p-8 text-center text-gray-400">
            Você ainda não cadastrou nenhum time favorito. Escolha um time acima para receber alertas automáticos.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preferences.map((pref) => (
              <div
                key={pref.teamId}
                className="bg-[#1f2326] border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-[#ff4655]/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {pref.teamLogo ? (
                    <img src={pref.teamLogo} alt={pref.teamName} className="w-10 h-10 object-contain" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-white">
                      {pref.teamName.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-white">{pref.teamName}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#ff4655]/10 text-[#ff4655] font-semibold">
                      Alertas: {pref.tipoAlerta}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeletePreference(pref.teamId)}
                  className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Remover alerta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
