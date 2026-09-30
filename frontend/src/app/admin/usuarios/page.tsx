'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Role, User } from '@/types';
import api from '@/services/api';
import {
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  KeyRound,
  Filter,
} from 'lucide-react';

interface ExtendedUser extends User {
  createdAt?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<ExtendedUser | null>(null);

  // Form State
  const [formNome, setFormNome] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formSenha, setFormSenha] = useState<string>('');
  const [formRole, setFormRole] = useState<Role>('USER');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Guard: Only ADMIN
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const loadUsers = async () => {
    setLoading(true);
    setActionMessage(null);
    try {
      const response = await api.get('/admin/users');
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao carregar lista de usuários.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadUsers();
    }
  }, [isAuthenticated, isAdmin]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormNome('');
    setFormEmail('');
    setFormSenha('');
    setFormRole('USER');
    setActionMessage(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: ExtendedUser) => {
    setEditingUser(user);
    setFormNome(user.nome);
    setFormEmail(user.email);
    setFormSenha(''); // Leave empty unless changing
    setFormRole(user.role);
    setActionMessage(null);
    setModalOpen(true);
  };

  // Submit Create or Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    try {
      if (editingUser) {
        // Update user
        const payload: any = {
          nome: formNome,
          email: formEmail,
          role: formRole,
        };
        if (formSenha && formSenha.trim().length > 0) {
          payload.senha = formSenha.trim();
        }

        await api.put(`/admin/users/${editingUser.id}`, payload);
        setActionMessage({ type: 'success', text: `Usuário "${formNome}" atualizado com sucesso!` });
      } else {
        // Create user
        if (!formSenha || formSenha.trim().length < 6) {
          setActionMessage({ type: 'error', text: 'A senha é obrigatória e deve ter pelo menos 6 caracteres.' });
          setSubmitting(false);
          return;
        }

        await api.post('/admin/users', {
          nome: formNome,
          email: formEmail,
          senha: formSenha,
          role: formRole,
        });
        setActionMessage({ type: 'success', text: `Usuário "${formNome}" criado com sucesso!` });
      }

      setModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao salvar usuário. Verifique os dados.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (user: ExtendedUser) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    if (userToDelete.id === currentUser?.id || userToDelete.email === currentUser?.email) {
      setActionMessage({ type: 'error', text: 'Você não pode excluir sua própria conta de administrador conectada.' });
      setDeleteModalOpen(false);
      return;
    }

    try {
      await api.delete(`/admin/users/${userToDelete.id}`);
      setActionMessage({ type: 'success', text: `Usuário "${userToDelete.nome}" removido com sucesso!` });
      setDeleteModalOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao excluir usuário.',
      });
      setDeleteModalOpen(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const countAdmins = users.filter((u) => u.role === 'ADMIN').length;
  const countJournalists = users.filter((u) => u.role === 'JORNALISTA').length;
  const countUsers = users.filter((u) => u.role === 'USER').length;

  if (authLoading || (!isAuthenticated || !isAdmin)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShieldAlert className="w-12 h-12 text-[#ff4655] animate-pulse mx-auto mb-4" />
        <h2 className="text-xl font-black text-white uppercase">Acesso Restrito ao Administrador</h2>
        <p className="text-sm text-gray-400 mt-2">Verificando credenciais e nível de autorização...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4655]/10 border border-[#ff4655]/30 text-[#ff4655] text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Painel Administrativo Restrito
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Gestão de Usuários & Acessos
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Cadastre, visualize, edite e gerencie permissões de Administradores, Jornalistas e Leitores.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#1f2326] border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white transition-all shadow"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ff4655]' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-none bg-[#ff4655] hover:bg-[#e03a49] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ff4655]/30 hover:shadow-[#ff4655]/50"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Usuário</span>
          </button>
        </div>
      </div>

      {/* Action Feedback Message */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-[#1f2326] border border-gray-800 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-gray-400 font-medium">Total de Contas</span>
          <span className="text-2xl font-black text-white mt-1">{users.length}</span>
        </div>
        <div className="bg-[#1f2326] border border-[#ff4655]/30 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-[#ff4655] font-bold">Administradores</span>
          <span className="text-2xl font-black text-white mt-1">{countAdmins}</span>
        </div>
        <div className="bg-[#1f2326] border border-amber-500/30 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-amber-400 font-bold">Jornalistas</span>
          <span className="text-2xl font-black text-white mt-1">{countJournalists}</span>
        </div>
        <div className="bg-[#1f2326] border border-cyan-500/30 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-cyan-400 font-bold">Torcedores / Fãs</span>
          <span className="text-2xl font-black text-white mt-1">{countUsers}</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#1f2326] border border-gray-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f1923] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4655]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              roleFilter === 'ALL'
                ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                : 'bg-[#0f1923] text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            Todos ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              roleFilter === 'ADMIN'
                ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                : 'bg-[#0f1923] text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            ADMIN ({countAdmins})
          </button>
          <button
            onClick={() => setRoleFilter('JORNALISTA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              roleFilter === 'JORNALISTA'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'bg-[#0f1923] text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            JORNALISTA ({countJournalists})
          </button>
          <button
            onClick={() => setRoleFilter('USER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              roleFilter === 'USER'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'bg-[#0f1923] text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            USER ({countUsers})
          </button>
        </div>
      </div>

      {/* Users List & Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 bg-[#1f2326] rounded-2xl border border-gray-800">
          <RefreshCw className="w-8 h-8 text-[#ff4655] animate-spin mx-auto mb-3" />
          <p className="text-sm">Carregando usuários do sistema...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[#1f2326] border border-gray-800 rounded-2xl p-12 text-center text-gray-400 shadow-lg">
          <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-200">Nenhum usuário encontrado</h3>
          <p className="text-xs text-gray-500 mt-1">Tente ajustar a busca ou o filtro de perfil selecionado.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (shown on < md screens) */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filteredUsers.map((u) => {
              const isSelf = u.id === currentUser?.id || u.email === currentUser?.email;
              return (
                <div
                  key={u.id}
                  className="bg-[#1f2326] border border-gray-800 rounded-2xl p-4 shadow-md hover:border-gray-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#141e28] border border-gray-700 flex items-center justify-center font-bold text-sm text-[#ff4655]">
                        {u.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-sm text-white">{u.nome}</h4>
                          {isSelf && (
                            <span className="text-[10px] bg-[#ff4655]/20 text-[#ff4655] px-1.5 py-0.5 rounded font-mono font-bold">
                              Você
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{u.email}</p>
                      </div>
                    </div>

                    {/* Role badge */}
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        u.role === 'ADMIN'
                          ? 'bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/40'
                          : u.role === 'JORNALISTA'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-mono">
                      ID: #{u.id}
                      {u.createdAt && ` • ${new Date(u.createdAt).toLocaleDateString('pt-BR')}`}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                        title="Editar usuário"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(u)}
                        disabled={isSelf}
                        className={`p-2 rounded-lg transition-colors ${
                          isSelf
                            ? 'bg-gray-800/40 text-gray-600 cursor-not-allowed'
                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                        }`}
                        title={isSelf ? 'Você não pode excluir sua própria conta' : 'Excluir usuário'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (shown on >= md screens) */}
          <div className="hidden md:block bg-[#1f2326] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141e28] border-b border-gray-800 text-gray-400 text-xs uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Nome Completo</th>
                  <th className="py-4 px-6">E-mail</th>
                  <th className="py-4 px-6">Perfil / Role</th>
                  <th className="py-4 px-6">Data de Criação</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-sm">
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id || u.email === currentUser?.email;
                  return (
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-gray-400">#{u.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#141e28] border border-gray-700 flex items-center justify-center font-bold text-xs text-[#ff4655]">
                            {u.nome.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white">{u.nome}</span>
                            {isSelf && (
                              <span className="ml-2 text-[10px] bg-[#ff4655]/20 text-[#ff4655] px-1.5 py-0.5 rounded font-mono font-bold">
                                Você
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-300">{u.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            u.role === 'ADMIN'
                              ? 'bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/40'
                              : u.role === 'JORNALISTA'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          }`}
                        >
                          {u.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '—'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                            title="Editar usuário"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(u)}
                            disabled={isSelf}
                            className={`p-2 rounded-lg transition-colors ${
                              isSelf
                                ? 'bg-gray-800/40 text-gray-600 cursor-not-allowed'
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                            }`}
                            title={isSelf ? 'Você não pode excluir sua própria conta' : 'Excluir usuário'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal: Create or Edit User */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1f2326] border border-gray-700 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-6 border-b border-gray-800 pb-3">
              {editingUser ? <Edit className="w-5 h-5 text-[#ff4655]" /> : <UserPlus className="w-5 h-5 text-[#ff4655]" />}
              {editingUser ? `Editar Usuário #${editingUser.id}` : 'Cadastrar Novo Usuário'}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Ex: Gabriel Toledo"
                    className="w-full bg-[#0f1923] border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="usuario@spikenews.gg"
                    className="w-full bg-[#0f1923] border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Perfil de Acesso (Role)
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as Role)}
                  className="w-full bg-[#0f1923] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
                >
                  <option value="USER">USER — Torcedor / Leitor (Visualização & Alertas)</option>
                  <option value="JORNALISTA">JORNALISTA — Redação de Notícias & Relatórios CSV</option>
                  <option value="ADMIN">ADMIN — Administrador Completo do Sistema & CRUD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  {editingUser ? 'Nova Senha (Opcional)' : 'Senha de Acesso'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required={!editingUser}
                    minLength={6}
                    value={formSenha}
                    onChange={(e) => setFormSenha(e.target.value)}
                    placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : 'Mínimo 6 caracteres'}
                    className="w-full bg-[#0f1923] border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
                  />
                </div>
                {editingUser && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Preencha este campo apenas se desejar redefinir a senha do usuário.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#ff4655] hover:bg-[#e03a49] text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#ff4655]/30 flex items-center gap-2"
                >
                  {submitting ? 'Salvando...' : editingUser ? 'Atualizar Dados' : 'Cadastrar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1f2326] border border-red-500/50 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-white uppercase text-center mb-2">
              Confirmar Exclusão de Usuário
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 text-center mb-6 leading-relaxed">
              Tem certeza que deseja remover o usuário{' '}
              <span className="font-bold text-white">{userToDelete.nome}</span> ({userToDelete.email})?
              Esta ação removerá seus acessos e preferências permanentemente.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
