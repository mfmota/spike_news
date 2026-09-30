'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, WifiOff, Sparkles, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Spike News PWA Service Worker registrado com sucesso:', registration.scope);
          })
          .catch((error) => {
            console.error('Falha ao registrar Service Worker:', error);
          });
      });
    }

    // 2. Detect standalone mode (already installed)
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true)
    ) {
      setIsInstalled(true);
    }

    // 3. Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user dismissed recently
      const dismissedUntil = localStorage.getItem('pwa_install_dismissed_until');
      if (!dismissedUntil || Date.now() > parseInt(dismissedUntil, 10)) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Online/Offline Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    // Dismiss for 7 days
    localStorage.setItem(
      'pwa_install_dismissed_until',
      (Date.now() + 7 * 24 * 60 * 60 * 1000).toString()
    );
  };

  return (
    <>
      {/* Offline Alert Indicator */}
      {isOffline && (
        <div className="bg-amber-600/95 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 sticky top-0 z-[60] shadow-md animate-pulse">
          <WifiOff className="w-4 h-4" />
          <span>Você está navegando em modo offline. Conteúdo salvo em cache está disponível.</span>
        </div>
      )}

      {/* PWA Mobile Install Floating Banner */}
      {showInstallBanner && !isInstalled && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-bounce-in">
          <div className="bg-[#141e28] border-2 border-[#ff4655] rounded-2xl p-4 shadow-2xl text-white backdrop-blur-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#ff4655] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#ff4655]/40">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                  Instalar Spike News
                  <span className="text-[10px] bg-[#ff4655]/20 text-[#ff4655] px-1.5 py-0.5 rounded font-bold">
                    PWA App
                  </span>
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  Adicione à tela inicial para placares em tempo real e acesso rápido.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-[#ff4655] hover:bg-[#e03a49] text-white text-xs font-bold px-3 py-2 rounded-lg uppercase tracking-wider transition-all shadow-md flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
