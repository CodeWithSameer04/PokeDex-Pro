import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TYPES_DATA, ALL_POKEMON_TYPES, TYPE_COLORS } from '../data/typesData';
import { PokemonType } from '../types/pokemon';
import { getLocalPokemonList, getLocalMovesList } from '../utils/pokeapi';
import { getDefensiveProfile } from '../utils/typeCalculations';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { TypeBadge } from '../components/common/TypeBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { Swords, Shield, Zap, Sparkles, BookOpen } from 'lucide-react';

export const TypeDetailPage: React.FC = () => {
  const { typeName } = useParams<{ typeName: string }>();
  const normalized = (typeName?.toLowerCase() || 'normal') as PokemonType;
  const typeData = TYPES_DATA[normalized];

  const allPokemon = useMemo(() => getLocalPokemonList(), []);
  const allMoves = useMemo(() => getLocalMovesList(), []);

  // Filter Pokémon of this type
  const matchingPokemon = useMemo(() => {
    return allPokemon.filter(p => p.types.includes(normalized));
  }, [allPokemon, normalized]);

  // Filter moves of this type
  const matchingMoves = useMemo(() => {
    return allMoves.filter(m => m.type === normalized);
  }, [allMoves, normalized]);

  // Defensive profile for pure type
  const defensiveSummary = getDefensiveProfile([normalized]);

  if (!typeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Type Not Found</h2>
        <p className="text-slate-400">The requested type &apos;{typeName}&apos; does not exist in the Pokémon system.</p>
        <Link to="/types" className="inline-block px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold">
          View All Types
        </Link>
      </div>
    );
  }

  const typeConfig = TYPE_COLORS[normalized];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      <Breadcrumbs
        items={[
          { label: 'Types', path: '/types' },
          { label: `${typeData.name} Type` },
        ]}
      />

      {/* Header Banner */}
      <div
        style={{ borderColor: typeData.borderColor }}
        className="rounded-3xl bg-gradient-to-br from-darkbg-800 to-darkbg-700 border p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: typeConfig.bg }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TypeBadge type={normalized} size="lg" asLink={false} />
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Introduced Gen {typeData.generation}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white">{typeData.name} Type</h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {typeData.description}
            </p>
          </div>

          <div className="flex sm:flex-col gap-4 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-darkbg-900/60 border border-slate-700/60 text-center">
              <span className="text-slate-400 block uppercase text-[10px]">Total Pokémon</span>
              <span className="text-xl font-bold text-white">{matchingPokemon.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-darkbg-900/60 border border-slate-700/60 text-center">
              <span className="text-slate-400 block uppercase text-[10px]">Total Moves</span>
              <span className="text-xl font-bold text-white">{matchingMoves.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Matchups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Offensive Matchups */}
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center">
            <Swords className="w-5 h-5 mr-2 text-red-400" />
            Offensive Matchups ({typeData.name} Attacks)
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Deals 2× Damage To (Super Effective):
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {typeData.damageRelations.doubleDamageTo.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  typeData.damageRelations.doubleDamageTo.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                Deals ½× Damage To (Not Very Effective):
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {typeData.damageRelations.halfDamageTo.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  typeData.damageRelations.halfDamageTo.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                Deals 0× Damage To (No Effect / Immune):
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {typeData.damageRelations.noDamageTo.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  typeData.damageRelations.noDamageTo.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Defensive Matchups */}
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            Defensive Matchups (Defending as pure {typeData.name})
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block mb-1">
                Takes 2× Damage From (Weaknesses):
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.doubleDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.doubleDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                Takes ½× Damage From (Resistances):
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.halfDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.halfDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                Takes 0× Damage From (Immunities):
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.noDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.noDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pokémon Belonging to Type */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {typeData.name}-Type Pokémon ({matchingPokemon.length})
          </h2>
          <span className="text-xs font-mono text-slate-400">All Main-Series Generations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {matchingPokemon.slice(0, 36).map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>

        {matchingPokemon.length > 36 && (
          <div className="text-center pt-4">
            <Link
              to={`/pokedex?type=${normalized}`}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <span>View all {matchingPokemon.length} {typeData.name} Pokémon in Pokédex</span>
            </Link>
          </div>
        )}
      </section>

      {/* Moves Belonging to Type */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {typeData.name}-Type Moves ({matchingMoves.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {matchingMoves.slice(0, 30).map(m => (
            <Link
              key={m.id}
              to={`/moves/${m.id}`}
              className="p-3.5 rounded-2xl bg-darkbg-800/80 hover:bg-darkbg-700/80 border border-slate-700/60 transition-all hover:border-slate-500 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-100">{m.displayName}</span>
                  <CategoryBadge category={m.category} size="sm" showIcon={false} />
                </div>
                <div className="text-xs text-slate-400 line-clamp-1">{m.shortDescription}</div>
              </div>
              <div className="text-xs text-right font-mono text-slate-400 ml-3 flex-shrink-0">
                <span className="block font-bold text-slate-200">
                  {m.power ? `PWR ${m.power}` : '—'}
                </span>
                <span className="text-[10px] text-slate-500">{m.accuracy ? `${m.accuracy}%` : '—'}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
