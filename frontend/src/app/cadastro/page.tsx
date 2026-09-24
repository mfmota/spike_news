'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { Role } from '@/types';
import { Flame, Lock, Mail, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { nome, email, senha, role });
      const data = response.data;
      login(data.token, {
        id: data.id,
        nome: data.nome,
        email: data.email,
        role: data.role,
      });

      if (data.role === 'JORNALISTA' || data.role === 'ADMIN') {
        router.push('/jornalista');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Falha ao realizar cadastro. Tente outro email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#1f2326] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#ff4655] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#ff4655]/30">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            Criar Nova Conta
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Junte-se à comunidade oficial de Esports
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Nome Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: TenZ da Silva"
                className="w-full bg-[#0f1923] border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full bg-[#0f1923] border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#0f1923] border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Perfil de Acesso
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full bg-[#0f1923] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4655]"
            >
              <option value="USER">Torcedor / Leitor (Padrão)</option>
              <option value="JORNALISTA">Jornalista (Redação de Notícias & CSV)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff4655] hover:bg-[#e03a49] text-white py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-[#ff4655]/30 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-400">
            Já possui uma conta?{' '}
            <Link href="/login" className="text-[#ff4655] hover:underline font-bold">
              Fazer login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
