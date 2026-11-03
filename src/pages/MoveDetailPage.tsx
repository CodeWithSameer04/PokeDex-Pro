import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocalMove, getLocalMovesList, getLocalPokemonList } from '../utils/pokeapi';
import { ALL_POKEMON_TYPES, TYPES_DATA } from '../data/typesData';
import { getTypeEffectiveness, formatMultiplier } from '../utils/typeCalculations';
import { FAMOUS_MOVE_CHANGES } from '../data/gamesData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { TypeBadge } from '../components/common/TypeBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import {
  Swords,
  Shield,
  Zap,
  Info,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Volume2,
  Hand,
  Flame,
} from 'lucide-react';

export const MoveDetailPage: React.FC = () => {
  const { idOrName } = useParams<{ idOrName: string }>();
  const move = getLocalMove(idOrName || '1');
  const allMoves = useMemo(() => getLocalMovesList(), []);
  const allPokemon = useMemo(() => getLocalPokemonList(), []);

  // Famous historical change check
  const famousHistory = useMemo(() => {
    if (!move) return [];
    return FAMOUS_MOVE_CHANGES.filter(
      h => h.moveName.toLowerCase() === move.displayName.toLowerCase()
    );
  }, [move]);

  // Find sample Pokémon that learn or match this move's type
  const matchingTypePokemon = useMemo(() => {
    if (!move) return [];
    // Show Pokémon matching move type who get STAB from it
    return allPokemon.filter(p => p.types.includes(move.type)).slice(0, 18);
  }, [allPokemon, move]);

  if (!move) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Move Not Found</h2>
        <p className="text-slate-400">The move requested could not be found in the database.</p>
        <Link to="/moves" className="inline-block px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold">
          View All Moves
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      <Breadcrumbs
        items={[
          { label: 'Moves', path: '/moves' },
          { label: move.displayName },
        ]}
      />

      {/* Main Move Header Banner */}
      <div className="bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TypeBadge type={move.type} size="md" />
              <CategoryBadge category={move.category} size="md" />
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Gen {move.generation}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white">{move.displayName}</h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {move.effectDescription || move.shortDescription}
            </p>
          </div>

          {/* Key Stats Pill Box */}
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-4 rounded-2xl bg-darkbg-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Base Power</span>
              <span className="text-2xl sm:text-3xl font-black text-red-400">
                {move.power !== null ? move.power : '—'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-darkbg-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Accuracy</span>
              <span className="text-2xl sm:text-3xl font-black text-blue-400">
                {move.accuracy !== null ? `${move.accuracy}%` : '—'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-darkbg-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Power Points</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {move.pp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Mechanics & Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core Attributes */}
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            Combat Attributes
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-400">Damage Category</span>
              <strong className="text-slate-200 capitalize">{move.category}</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-400">Priority Bracket</span>
              <strong className={move.priority > 0 ? 'text-emerald-400' : move.priority < 0 ? 'text-red-400' : 'text-slate-200'}>
                {move.priority > 0 ? `+${move.priority}` : move.priority}
              </strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-400">Target Area</span>
              <strong className="text-slate-200">{move.target}</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-400">Secondary Effect Chance</span>
              <strong className="text-slate-200">
                {move.effectChance !== null ? `${move.effectChance}%` : 'N/A'}
              </strong>
            </div>
          </div>
        </div>

        {/* Move Flags (Contact, Protect, Sound, Punch, Bite) */}
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-400" />
            Special Move Flags
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-300">Makes Physical Contact</span>
              {move.flags.contact ? (
                <span className="flex items-center text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4 mr-1" /> Yes
                </span>
              ) : (
                <span className="flex items-center text-slate-500 font-medium">
                  <XCircle className="w-4 h-4 mr-1" /> No
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-300">Blocked by Protect / Detect</span>
              {move.flags.protect ? (
                <span className="flex items-center text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4 mr-1" /> Yes
                </span>
              ) : (
                <span className="flex items-center text-slate-500 font-medium">
                  <XCircle className="w-4 h-4 mr-1" /> No
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-300">Sound-based Move</span>
              {move.flags.sound ? (
                <span className="flex items-center text-purple-400 font-bold">
                  <CheckCircle className="w-4 h-4 mr-1" /> Yes (Bypasses Sub)
                </span>
              ) : (
                <span className="flex items-center text-slate-500 font-medium">
                  <XCircle className="w-4 h-4 mr-1" /> No
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-300">Punching Move (Iron Fist Boost)</span>
              {move.flags.punch ? (
                <span className="flex items-center text-red-400 font-bold">
                  <CheckCircle className="w-4 h-4 mr-1" /> Yes (+20%)
                </span>
              ) : (
                <span className="flex items-center text-slate-500 font-medium">
                  <XCircle className="w-4 h-4 mr-1" /> No
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-darkbg-900 border border-slate-800">
              <span className="text-slate-300">Biting Move (Strong Jaw Boost)</span>
              {move.flags.bite ? (
                <span className="flex items-center text-amber-400 font-bold">
                  <CheckCircle className="w-4 h-4 mr-1" /> Yes (+50%)
                </span>
              ) : (
                <span className="flex items-center text-slate-500 font-medium">
                  <XCircle className="w-4 h-4 mr-1" /> No
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Historical Balance Changes */}
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center">
            <Clock className="w-4 h-4 mr-2 text-purple-400" />
            Historical Generation Changes
          </h3>

          {famousHistory.length > 0 ? (
            <div className="space-y-3">
              {famousHistory.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-darkbg-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-amber-400">
                    <span>Changed in Gen {h.genChanged}</span>
                    <span>{h.stat}: {h.oldValue} → {h.newValue}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{h.explanation}</p>
                </div>
              ))}
            </div>
          ) : move.historicalChanges && move.historicalChanges.length > 0 ? (
            <div className="space-y-2">
              {move.historicalChanges.map((hc, i) => (
                <div key={i} className="p-3 rounded-xl bg-darkbg-900 border border-slate-800 text-xs">
                  <span className="font-bold text-purple-400">Version Change:</span>
                  <div className="font-mono text-slate-300 mt-1">
                    {hc.power && <span>Power: {hc.power} </span>}
                    {hc.accuracy && <span>Acc: {hc.accuracy}% </span>}
                    {hc.pp && <span>PP: {hc.pp}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-darkbg-900 border border-slate-800 text-xs text-slate-400">
              No significant stat rebalances recorded across generations for this move.
            </div>
          )}
        </div>
      </div>

      {/* Move Type Effectiveness against All 18 Types */}
      <section className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-base text-white">
          Offensive Type Effectiveness ({move.displayName} vs All 18 Types)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {ALL_POKEMON_TYPES.map(defType => {
            const mult = getTypeEffectiveness(move.type, defType);

            let multClass = 'text-slate-400 bg-slate-900 border-slate-800';
            if (mult === 2) multClass = 'text-emerald-300 bg-emerald-950/70 border-emerald-700 font-bold';
            else if (mult === 0.5) multClass = 'text-blue-300 bg-blue-950/70 border-blue-800';
            else if (mult === 0) multClass = 'text-purple-300 bg-purple-950/80 border-purple-800 font-bold';

            return (
              <div
                key={defType}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${multClass}`}
              >
                <span className="capitalize">{defType}</span>
                <span className="font-mono font-bold">{formatMultiplier(mult)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pokémon with STAB from this Move */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Notable Pokémon Featuring {move.type.toUpperCase()} STAB ({matchingTypePokemon.length})
          </h2>
          <Link
            to={`/move-checker`}
            className="text-xs font-semibold text-red-400 hover:underline"
          >
            Test this move in Battle Checker →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {matchingTypePokemon.map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      </section>
    </div>
  );
};
