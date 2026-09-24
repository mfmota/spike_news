'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Agent, MapData, Weapon } from '@/types';
import { Shield, MapPin, Crosshair, Search, RefreshCw } from 'lucide-react';

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<'agents' | 'maps' | 'weapons'>('agents');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [maps, setMaps] = useState<MapData[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/catalog/agents'),
      api.get('/catalog/maps'),
      api.get('/catalog/weapons'),
    ])
      .then(([agentsRes, mapsRes, weaponsRes]) => {
        if (Array.isArray(agentsRes.data)) setAgents(agentsRes.data);
        if (Array.isArray(mapsRes.data)) setMaps(mapsRes.data);
        if (Array.isArray(weaponsRes.data)) setWeapons(weaponsRes.data);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados do catálogo:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredAgents = agents.filter((a) =>
    a.displayName.toLowerCase().includes(search.toLowerCase()) ||
    (a.roleName && a.roleName.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredMaps = maps.filter((m) =>
    m.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredWeapons = weapons.filter((w) =>
    w.displayName.toLowerCase().includes(search.toLowerCase()) ||
    (w.category && w.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#ff4655] uppercase tracking-widest font-mono">
            API OFICIAL VALORANT (PT-BR) & CACHE LOCAL
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
            Catálogo de Assets & Equipamentos
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1f2326] border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4655]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-8 space-x-8">
        <button
          onClick={() => setActiveTab('agents')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'agents'
              ? 'border-[#ff4655] text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <Shield className="w-4 h-4 text-[#ff4655]" />
          Agentes ({agents.length})
        </button>

        <button
          onClick={() => setActiveTab('maps')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'maps'
              ? 'border-[#ff4655] text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <MapPin className="w-4 h-4 text-[#ff4655]" />
          Mapas ({maps.length})
        </button>

        <button
          onClick={() => setActiveTab('weapons')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'weapons'
              ? 'border-[#ff4655] text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <Crosshair className="w-4 h-4 text-[#ff4655]" />
          Armas & Arsenal ({weapons.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-[#ff4655] animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Carregando catálogo do banco de dados SQLite...</p>
        </div>
      ) : (
        <>
          {/* Agents Grid */}
          {activeTab === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.uuid}
                  className="bg-[#1f2326] border border-gray-800 rounded-xl overflow-hidden hover:border-[#ff4655]/60 transition-all p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-[#ff4655] transition-colors">
                          {agent.displayName}
                        </h3>
                        {agent.roleName && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                            {agent.roleIcon && <img src={agent.roleIcon} alt="" className="w-3.5 h-3.5" />}
                            <span>{agent.roleName}</span>
                          </div>
                        )}
                      </div>

                      {agent.displayIcon && (
                        <img
                          src={agent.displayIcon}
                          alt={agent.displayName}
                          className="w-12 h-12 rounded-lg bg-gray-900/80 p-1 object-contain border border-gray-700"
                        />
                      )}
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">
                      {agent.description}
                    </p>
                  </div>

                  {agent.fullPortrait && (
                    <div className="mt-4 pt-3 border-t border-gray-800/80 flex justify-center">
                      <img
                        src={agent.fullPortrait}
                        alt={agent.displayName}
                        className="h-44 object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Maps Grid */}
          {activeTab === 'maps' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaps.map((map) => (
                <div
                  key={map.uuid}
                  className="bg-[#1f2326] border border-gray-800 rounded-xl overflow-hidden hover:border-[#ff4655]/60 transition-all group"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-900">
                    {map.splash ? (
                      <img
                        src={map.splash}
                        alt={map.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        Sem Splash
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f2326] via-transparent to-transparent"></div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-black text-white group-hover:text-[#ff4655] transition-colors">
                      {map.displayName}
                    </h3>
                    <p className="text-xs font-mono text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ff4655]" />
                      {map.coordinates || 'Coordenadas não disponíveis'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Weapons Grid */}
          {activeTab === 'weapons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWeapons.map((weapon) => (
                <div
                  key={weapon.uuid}
                  className="bg-[#1f2326] border border-gray-800 rounded-xl overflow-hidden hover:border-[#ff4655]/60 transition-all p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-black text-white group-hover:text-[#ff4655] transition-colors">
                        {weapon.displayName}
                      </h3>
                      {weapon.cost && (
                        <span className="text-xs font-mono font-bold bg-[#ff4655]/10 text-[#ff4655] px-2.5 py-1 rounded">
                          ¤ {weapon.cost}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {weapon.category}
                    </span>
                  </div>

                  <div className="my-6 flex justify-center items-center h-24">
                    {weapon.displayIcon && (
                      <img
                        src={weapon.displayIcon}
                        alt={weapon.displayName}
                        className="max-h-20 max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-800 pt-3 text-gray-400">
                    <div>
                      <span className="text-gray-500">Pente: </span>
                      <span className="font-semibold text-white">{weapon.magazineSize || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Cadência: </span>
                      <span className="font-semibold text-white">{weapon.fireRate || '-'} tps</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
