'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Radio, Newspaper, Shield, Bell, User as UserIcon, LogOut, Flame } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isJournalist, logout } = useAuth();

  return (
    <nav className="bg-[#0f1923]/95 backdrop-blur-md border-b border-[#ff4655]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-[#ff4655] rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-wider text-white uppercase font-sans">
                SPIKE <span className="text-[#ff4655]">NEWS</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white flex items-center space-x-1 text-sm font-semibold transition-colors">
              <Newspaper className="w-4 h-4 text-[#ff4655]" />
              <span>Notícias</span>
            </Link>

            <Link href="/catalogo" className="text-gray-300 hover:text-white flex items-center space-x-1 text-sm font-semibold transition-colors">
              <Shield className="w-4 h-4 text-[#ff4655]" />
              <span>Catálogo Valorant</span>
            </Link>

            {isAuthenticated && (
              <Link href="/preferencias" className="text-gray-300 hover:text-white flex items-center space-x-1 text-sm font-semibold transition-colors">
                <Bell className="w-4 h-4 text-[#ff4655]" />
                <span>Alertas & Times</span>
              </Link>
            )}

            {isJournalist && (
              <Link href="/jornalista" className="bg-[#ff4655]/10 text-[#ff4655] border border-[#ff4655]/30 hover:bg-[#ff4655] hover:text-white px-3 py-1.5 rounded-md text-sm font-bold transition-all">
                Painel do Jornalista
              </Link>
            )}
          </div>

          {/* User Auth controls */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-300 bg-[#1f2326] px-3 py-1.5 rounded-full border border-gray-700">
                  <UserIcon className="w-4 h-4 text-[#ff4655]" />
                  <span className="font-medium text-white">{user?.nome.split(' ')[0]}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#ff4655]/20 text-[#ff4655] font-semibold">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-[#ff4655] p-2 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-1.5 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="bg-[#ff4655] hover:bg-[#e03a49] text-white text-sm font-bold px-4 py-2 rounded uppercase tracking-wide transition-colors shadow-lg shadow-[#ff4655]/30"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
