import './globals.css';
import type { Metadata, Viewport } from 'next';
import Providers from './Providers';
import Navbar from '@/components/Navbar';
import PwaHandler from '@/components/PwaHandler';

export const viewport: Viewport = {
  themeColor: '#0f1923',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Spike News — O Portal de Esports e VALORANT em Tempo Real',
  description: 'Cobertura completa, notícias, placares em tempo real via SSE e catálogo oficial de assets do VALORANT.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Spike News',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta name="application-name" content="Spike News" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Spike News" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#0f1923] text-[#ece8e1] min-h-screen flex flex-col font-sans antialiased selection:bg-[#ff4655] selection:text-white pb-16 md:pb-0">
        <Providers>
          <PwaHandler />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-[#0a1118] border-t border-gray-800 py-8 text-center text-xs text-gray-500 mb-14 md:mb-0">
            <div className="max-w-7xl mx-auto px-4">
              <p className="font-bold text-gray-400 mb-1">SPIKE NEWS © 2026 — Plataforma de Esports & PWA</p>
              <p>Este projeto utiliza a API pública valorant-api.com e dados do VLR.gg para fins educacionais e informativos.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
