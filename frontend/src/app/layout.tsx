import './globals.css';
import type { Metadata } from 'next';
import Providers from './Providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Spike News — O Portal de Esports e VALORANT em Tempo Real',
  description: 'Cobertura completa, notícias, placares em tempo real via SSE e catálogo oficial de assets do VALORANT.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0f1923] text-[#ece8e1] min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-[#0a1118] border-t border-gray-800 py-8 text-center text-xs text-gray-500">
            <div className="max-w-7xl mx-auto px-4">
              <p className="font-bold text-gray-400 mb-1">SPIKE NEWS © 2026 — Plataforma de Esports</p>
              <p>Este projeto utiliza a API pública valorant-api.com e dados do VLR.gg para fins educacionais e informativos.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
