import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Database, ShieldCheck, Cpu, Code2, ExternalLink, Globe, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      <Breadcrumbs items={[{ label: 'About & Data Sources' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
          <Database className="w-4 h-4" />
          Technical & Data Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          About PokéDex Pro
        </h1>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">
          The architectural principles, data sources, calculation engines, and synchronization systems behind the platform.
        </p>
      </div>

      {/* Primary Data Source */}
      <section className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-400" />
          Primary Data Source: PokéAPI
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          The application is powered by PokéAPI (v2 REST API), the most comprehensive open-source Pokémon database in existence.
        </p>

        <div className="p-4 rounded-2xl bg-darkbg-900 border border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">API Documentation:</span>
            <a
              href="https://pokeapi.co/docs/v2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:underline inline-flex items-center"
            >
              pokeapi.co/docs/v2 <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Data Coverage:</span>
            <span>Generations 1–9 (Kanto through Paldea, 1025 species)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Moves & Abilities:</span>
            <span>919 Moves, 314 Abilities, 18 Modern Elemental Types</span>
          </div>
        </div>
      </section>

      {/* Offline Caching & High Performance Architecture */}
      <section className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-emerald-400" />
          Zero-Latency Data Pipeline & Offline Resilience
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Unlike basic wrappers that fire hundreds of network calls on every render, PokéDex Pro implements an embedded canonical dataset architecture:
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
          <li>
            <strong>Precompiled Master Index:</strong> All 1,351 Pokémon entries (1025 species + regional forms), 919 moves, and 314 abilities are stored locally in compressed JSON format.
          </li>
          <li>
            <strong>Instant Sub-Millisecond Search:</strong> Full-text instant filtering across names, numbers, types, abilities, and base stat total thresholds without network latency.
          </li>
          <li>
            <strong>Graceful PokéAPI Live Synchronization:</strong> Deep details such as extended multi-version learnsets, flavor texts across 30+ game titles, and official sound cries are fetched dynamically with local fallback.
          </li>
          <li>
            <strong>Data Sync Script:</strong> The CLI command <code className="bg-slate-800 text-red-400 px-1.5 py-0.5 rounded font-mono">npm run sync-data</code> updates and verifies local data against PokéAPI master tables.
          </li>
        </ul>
      </section>

      {/* Mathematical Accuracy */}
      <section className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-purple-400" />
          Mathematical Precision & Battle Mechanics
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          All type matchups are calculated programmatically rather than using hardcoded lookups. The calculation engine verifies:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-darkbg-900 border border-slate-800">
            <strong className="text-white block mb-1">Dual-Type Multiplicative Logic</strong>
            <span>Charizard (Fire/Flying) taking 4× from Rock, 0× from Ground, and 0.25× from Grass.</span>
          </div>
          <div className="p-3 rounded-xl bg-darkbg-900 border border-slate-800">
            <strong className="text-white block mb-1">Wonder Guard Handling</strong>
            <span>Shedinja completely negates any non-super effective attacks (1×, 0.5×, 0.25× become 0×).</span>
          </div>
          <div className="p-3 rounded-xl bg-darkbg-900 border border-slate-800">
            <strong className="text-white block mb-1">Synthetic Ability Immunities</strong>
            <span>Levitate (Ground), Flash Fire (Fire), Volt Absorb (Electric), Water Absorb (Water), Sap Sipper (Grass).</span>
          </div>
          <div className="p-3 rounded-xl bg-darkbg-900 border border-slate-800">
            <strong className="text-white block mb-1">Historical Generation Rules</strong>
            <span>Gen 1 Ghost/Psychic glitch, Gen 2-5 Steel Dark/Ghost resistances, Gen 6 rebalances.</span>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <div className="p-5 rounded-2xl bg-darkbg-900 border border-slate-800 text-xs text-slate-400 space-y-2">
        <strong className="text-slate-200 block uppercase tracking-wider text-[11px]">Disclaimer:</strong>
        <p className="leading-relaxed">
          Pokémon and Pokémon character names, moves, types, and stats are trademarks and copyrights of Nintendo, Creatures Inc., and Game Freak. This application is an educational and battle reference companion tool intended for personal and competitive game enjoyment.
        </p>
      </div>
    </div>
  );
};
