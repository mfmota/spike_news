'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Flame,
  Newspaper,
  Shield,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Users,
  PenTool,
  LogIn,
  UserPlus,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isJournalist, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-[#0f1923]/95 backdrop-blur-md border-b border-[#ff4655]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2.5 group"
              >
                <div className="w-9 h-9 bg-[#ff4655] rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-[#ff4655]/30">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-wider text-white uppercase font-sans leading-none">
                    SPIKE <span className="text-[#ff4655]">NEWS</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-gray-400 tracking-widest uppercase mt-0.5">
                    VALORANT Esports
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link
                href="/"
                className={`flex items-center space-x-1.5 text-sm font-bold transition-colors ${
                  isActive('/') && pathname === '/'
                    ? 'text-[#ff4655]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Newspaper className="w-4 h-4 text-[#ff4655]" />
                <span>Notícias</span>
              </Link>

              <Link
                href="/catalogo"
                className={`flex items-center space-x-1.5 text-sm font-bold transition-colors ${
                  isActive('/catalogo')
                    ? 'text-[#ff4655]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 text-[#ff4655]" />
                <span>Catálogo Valorant</span>
              </Link>

              {isAuthenticated && (
                <Link
                  href="/preferencias"
                  className={`flex items-center space-x-1.5 text-sm font-bold transition-colors ${
                    isActive('/preferencias')
                      ? 'text-[#ff4655]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Bell className="w-4 h-4 text-[#ff4655]" />
                  <span>Alertas & Times</span>
                </Link>
              )}

              {isJournalist && (
                <Link
                  href="/jornalista"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    isActive('/jornalista')
                      ? 'bg-[#ff4655] text-white shadow-md shadow-[#ff4655]/30'
                      : 'bg-[#ff4655]/10 text-[#ff4655] border border-[#ff4655]/30 hover:bg-[#ff4655] hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Painel do Jornalista</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin/usuarios"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    isActive('/admin')
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Admin / Usuários</span>
                </Link>
              )}
            </div>

            {/* User Auth controls (Desktop & Mobile Header Actions) */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-300 bg-[#1f2326] px-3 py-1.5 rounded-full border border-gray-700">
                    <UserIcon className="w-3.5 h-3.5 text-[#ff4655]" />
                    <span className="font-semibold text-white max-w-[110px] truncate">{user?.nome.split(' ')[0]}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        user?.role === 'ADMIN'
                          ? 'bg-[#ff4655]/20 text-[#ff4655]'
                          : user?.role === 'JORNALISTA'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-[#ff4655] rounded-lg hover:bg-gray-800 transition-colors"
                    title="Sair da Conta"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-lg transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="bg-[#ff4655] hover:bg-[#e03a49] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg uppercase tracking-wide transition-all shadow-md shadow-[#ff4655]/30"
                  >
                    Criar Conta
                  </Link>
                </div>
              )}

              {/* Hamburger Button (Mobile / Tablet) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-[#1f2326] border border-gray-700 text-gray-300 hover:text-white"
                aria-label="Abrir Menu de Navegação"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#141e28] border-b border-gray-800 px-4 pt-3 pb-6 animate-fade-in shadow-2xl">
            {isAuthenticated && (
              <div className="mb-4 p-3 bg-[#1f2326] rounded-xl border border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#ff4655] flex items-center justify-center font-bold text-xs text-white">
                    {user?.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{user?.nome}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{user?.email}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    user?.role === 'ADMIN'
                      ? 'bg-[#ff4655]/20 text-[#ff4655]'
                      : user?.role === 'JORNALISTA'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            )}

            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/') && pathname === '/'
                    ? 'bg-[#ff4655]/10 text-[#ff4655]'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Newspaper className="w-4 h-4 text-[#ff4655]" />
                <span>Notícias & Feed</span>
              </Link>

              <Link
                href="/catalogo"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/catalogo')
                    ? 'bg-[#ff4655]/10 text-[#ff4655]'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Shield className="w-4 h-4 text-[#ff4655]" />
                <span>Catálogo de Assets</span>
              </Link>

              {isAuthenticated && (
                <Link
                  href="/preferencias"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive('/preferencias')
                      ? 'bg-[#ff4655]/10 text-[#ff4655]'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Bell className="w-4 h-4 text-[#ff4655]" />
                  <span>Alertas & Times Favoritos</span>
                </Link>
              )}

              {isJournalist && (
                <Link
                  href="/jornalista"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive('/jornalista')
                      ? 'bg-[#ff4655] text-white'
                      : 'bg-[#ff4655]/10 text-[#ff4655] hover:bg-[#ff4655] hover:text-white'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Painel do Jornalista</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin/usuarios"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive('/admin')
                      ? 'bg-amber-500 text-black'
                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Administração / Gestão de Usuários</span>
                </Link>
              )}

              {!isAuthenticated && (
                <div className="pt-4 mt-3 border-t border-gray-800 grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 bg-[#1f2326] border border-gray-700 text-white py-2.5 rounded-xl text-xs font-bold"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#ff4655]" />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    href="/cadastro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 bg-[#ff4655] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Cadastrar</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar (PWA Style for easy one-hand navigation) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f1923]/95 backdrop-blur-lg border-t border-gray-800 z-40 px-2 py-1.5">
        <div className="flex items-center justify-around">
          
          <Link
            href="/"
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
              isActive('/') && pathname === '/'
                ? 'text-[#ff4655]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Newspaper className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Notícias</span>
          </Link>

          <Link
            href="/catalogo"
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
              isActive('/catalogo')
                ? 'text-[#ff4655]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Catálogo</span>
          </Link>

          {isAuthenticated ? (
            <Link
              href="/preferencias"
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive('/preferencias')
                  ? 'text-[#ff4655]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Alertas</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive('/login')
                  ? 'text-[#ff4655]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Entrar</span>
            </Link>
          )}

          {isAdmin ? (
            <Link
              href="/admin/usuarios"
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'text-amber-400'
                  : 'text-gray-400 hover:text-amber-400'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Admin</span>
            </Link>
          ) : isJournalist ? (
            <Link
              href="/jornalista"
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                isActive('/jornalista')
                  ? 'text-[#ff4655]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PenTool className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Redação</span>
            </Link>
          ) : null}

        </div>
      </div>
    </>
  );
}
