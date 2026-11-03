import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_POKEMON_TYPES, TYPES_DATA, TYPE_COLORS } from '../data/typesData';
import { PokemonType } from '../types/pokemon';
import { getTypeEffectiveness, formatMultiplier } from '../utils/typeCalculations';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { TypeBadge } from '../components/common/TypeBadge';
import { Layers, Grid, Info, ArrowRight } from 'lucide-react';

export const TypesPage: React.FC = () => {
  const [selectedHoverType, setSelectedHoverType] = useState<PokemonType | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Types' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
          <Layers className="w-4 h-4" />
          Elemental System
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Pokémon Type Explorer</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Complete encyclopedia of all 18 modern elemental types. Explore offensive strengths, defensive resistances, and the full 18×18 battle effectiveness matrix.
        </p>
      </div>

      {/* 18 Type Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_POKEMON_TYPES.map(type => {
          const data = TYPES_DATA[type];
          return (
            <Link
              key={type}
              to={`/types/${type}`}
              style={{ borderColor: data.borderColor }}
              className="group p-5 rounded-3xl bg-darkbg-800/80 hover:bg-darkbg-700/80 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <TypeBadge type={type} size="md" asLink={false} />
                  <span className="text-xs font-mono text-slate-400">Gen {data.generation}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[38px] mb-4">
                  {data.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-semibold">Super Effective (2×):</span>
                  <span className="font-mono text-slate-200">
                    {data.damageRelations.doubleDamageTo.length} types
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-semibold">Resisted by (½×):</span>
                  <span className="font-mono text-slate-200">
                    {data.damageRelations.halfDamageTo.length} types
                  </span>
                </div>
                {data.damageRelations.noDamageTo.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">No Effect (0×):</span>
                    <span className="font-mono text-slate-200">
                      {data.damageRelations.noDamageTo.length} types
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Interactive 18x18 Battle Chart Matrix */}
      <section className="bg-darkbg-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
            <Grid className="w-4 h-4" />
            Complete Battle Matrix
          </div>
          <h2 className="text-2xl font-bold text-white">18×18 Type Effectiveness Table</h2>
          <p className="text-xs text-slate-400 mt-1">
            Rows represent the <strong>Attacking Move Type</strong>. Columns represent the <strong>Defending Pokémon Type</strong>.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
            <strong>2×</strong> Super Effective
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
            <strong>1×</strong> Neutral
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
            <strong>½×</strong> Not Very Effective
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
            <strong>0×</strong> No Effect / Immune
          </span>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto border border-slate-700/60 rounded-2xl">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-darkbg-900 text-slate-400 font-mono">
                <th className="p-2 border-b border-r border-slate-700 text-left font-bold min-w-[90px]">
                  Atk ↓ \ Def →
                </th>
                {ALL_POKEMON_TYPES.map(t => (
                  <th key={t} className="p-2 border-b border-slate-700 uppercase font-bold min-w-[42px]">
                    <span className="text-[10px]">{t.slice(0, 3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_POKEMON_TYPES.map(atk => (
                <tr
                  key={atk}
                  className="hover:bg-slate-800/40 transition-colors"
                  onMouseEnter={() => setSelectedHoverType(atk)}
                  onMouseLeave={() => setSelectedHoverType(null)}
                >
                  <td className="p-2 border-r border-slate-700 text-left font-semibold capitalize bg-darkbg-900/60">
                    <span className="truncate block">{atk}</span>
                  </td>

                  {ALL_POKEMON_TYPES.map(def => {
                    const eff = getTypeEffectiveness(atk, def);

                    let cellBg = 'text-slate-400';
                    if (eff === 2) cellBg = 'bg-emerald-950/60 text-emerald-300 font-bold';
                    else if (eff === 0.5) cellBg = 'bg-blue-950/60 text-blue-300';
                    else if (eff === 0) cellBg = 'bg-purple-950/80 text-purple-300 font-bold';

                    return (
                      <td
                        key={def}
                        className={`p-2 border-b border-slate-800 font-mono transition-colors ${cellBg}`}
                        title={`${atk} vs ${def}: ${formatMultiplier(eff)}`}
                      >
                        {eff === 1 ? '—' : formatMultiplier(eff)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
