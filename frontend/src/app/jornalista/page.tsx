'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { News } from '@/types';
import api from '@/services/api';
import { PlusCircle, Download, Edit3, Trash2, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function JournalistDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isJournalist, loading: authLoading } = useAuth();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [teamId, setTeamId] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isJournalist)) {
      router.push('/login');
    }
  }, [isAuthenticated, isJournalist, authLoading, router]);

  const loadMyNews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/news/my');
      if (Array.isArray(response.data)) {
        setNewsList(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar matérias do jornalista:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isJournalist) {
      loadMyNews();
    }
  }, [isAuthenticated, isJournalist]);

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      titulo,
      conteudo,
      teamId: teamId ? parseInt(teamId, 10) : null,
    };

    try {
      if (isEditing && editingId) {
        await api.put(`/news/${editingId}`, payload);
        setMessage({ type: 'success', text: 'Matéria atualizada com sucesso!' });
      } else {
        await api.post('/news', payload);
        setMessage({ type: 'success', text: 'Matéria publicada com sucesso!' });
      }

      // Reset form
      setTitulo('');
      setConteudo('');
      setTeamId('');
      setIsEditing(false);
      setEditingId(null);
      loadMyNews();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao salvar matéria. Tente novamente.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (news: News) => {
    setIsEditing(true);
    setEditingId(news.id);
    setTitulo(news.titulo);
    setConteudo(news.conteudo);
    setTeamId(news.timeId ? news.timeId.toString() : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta matéria permanentemente?')) {
      try {
        await api.delete(`/news/${id}`);
        setMessage({ type: 'success', text: 'Matéria removida com sucesso.' });
        loadMyNews();
      } catch (err) {
        setMessage({ type: 'error', text: 'Erro ao remover matéria.' });
      }
    }
  };

  const handleDownloadJournalistCsv = async () => {
    setDownloadingCsv(true);
    try {
      const response = await api.get('/reports/journalist/news/csv', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `spike_news_minhas_materias_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao baixar relatório do jornalista:', err);
    } finally {
      setDownloadingCsv(false);
    }
  };

  if (authLoading || (!isAuthenticated || !isJournalist)) {
    return <div className="text-center py-20 text-gray-400">Verificando autorização...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#ff4655] uppercase tracking-widest font-mono">
            ÁREA DE REDAÇÃO E JORNALISMO
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
            Painel do Jornalista
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Autor conectado: <span className="text-white font-bold">{user?.nome}</span> ({user?.email})
          </p>
        </div>

        {/* CSV Export Action Button */}
        <button
          onClick={handleDownloadJournalistCsv}
          disabled={downloadingCsv}
          className="bg-[#1f2326] hover:bg-gray-800 border border-[#ff4655]/40 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:border-[#ff4655]"
        >
          <Download className="w-4 h-4 text-[#ff4655]" />
          {downloadingCsv ? 'Exportando CSV...' : 'Exportar Minhas Matérias (CSV)'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-xs flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Editor Form */}
      <div className="bg-[#1f2326] border border-gray-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl">
        <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2 mb-6 border-b border-gray-800 pb-3">
          <Edit3 className="w-5 h-5 text-[#ff4655]" />
          {isEditing ? 'Editar Matéria Existente' : 'Publicar Nova Matéria'}
        </h2>

        <form onSubmit={handleSaveNews} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Título da Matéria
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Sentinels anuncia reformulação tática para a próxima rodada"
              className="w-full bg-[#0f1923] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Time Relacionado (Opcional)
            </label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full bg-[#0f1923] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
            >
              <option value="">Nenhum (Notícia Geral de Esports / Atualização de Jogo)</option>
              <option value="1">LOUD</option>
              <option value="2">Sentinels</option>
              <option value="3">Fnatic</option>
              <option value="4">Paper Rex</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Conteúdo Completo da Matéria
            </label>
            <textarea
              required
              rows={6}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Digite o texto detalhado da matéria ou análise de jogo..."
              className="w-full bg-[#0f1923] border border-gray-700 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-[#ff4655]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#ff4655] hover:bg-[#e03a49] text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#ff4655]/30 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {submitting ? 'Salvando...' : isEditing ? 'Atualizar Matéria' : 'Publicar Matéria'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setTitulo('');
                  setConteudo('');
                  setTeamId('');
                }}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of Journalist's Authored News */}
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#ff4655]" />
          Minhas Publicações ({newsList.length})
        </h2>

        {loading ? (
          <div className="text-center py-10 text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ff4655]" />
            Carregando publicações...
          </div>
        ) : newsList.length === 0 ? (
          <div className="bg-[#1f2326] border border-gray-800 rounded-xl p-8 text-center text-gray-400">
            Você ainda não publicou nenhuma matéria. Utilize o formulário acima para criar sua primeira publicação.
          </div>
        ) : (
          <div className="bg-[#1f2326] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="divide-y divide-gray-800">
              {newsList.map((n) => (
                <div key={n.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                        ID: {n.id}
                      </span>
                      {n.timeNome && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ff4655]/10 text-[#ff4655]">
                          {n.timeNome}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {n.dataPublicacao ? new Date(n.dataPublicacao).toLocaleDateString('pt-BR') : ''}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {n.titulo}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                      {n.conteudo}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditClick(n)}
                      className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(n.id)}
                      className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
