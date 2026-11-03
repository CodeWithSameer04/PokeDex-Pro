import React, { useState, useMemo } from 'react';
import { getLocalPokemonList, getLocalMovesList } from '../../utils/pokeapi';
import { analyzeMoveEffectiveness } from '../../utils/battleFormulas';
import { TypeBadge } from '../common/TypeBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatMultiplier, getEffectivenessLabel } from '../../utils/typeCalculations';
import { Swords, Shield, Zap, AlertCircle, Sparkles, Activity } from 'lucide-react';

export const MoveEffectivenessChecker: React.FC = () => {
  const allPokemon = useMemo(() => getLocalPokemonList(), []);
  const allMoves = useMemo(() => getLocalMovesList(), []);

  // Selection state
  const [selectedMoveId, setSelectedMoveId] = useState<number>(85); // Thunderbolt
  const [attackerId, setAttackerId] = useState<number>(25); // Pikachu
  const [defenderId, setDefenderId] = useState<number>(130); // Gyarados
  const [defenderAbility, setDefenderAbility] = useState<string>('none');

  // Search filter inputs inside dropdowns
  const [moveSearch, setMoveSearch] = useState('');
  const [attackerSearch, setAttackerSearch] = useState('');
  const [defenderSearch, setDefenderSearch] = useState('');

  const currentMove = allMoves.find(m => m.id === selectedMoveId) || allMoves[0];
  const attacker = allPokemon.find(p => p.id === attackerId) || allPokemon[0];
  const defender = allPokemon.find(p => p.id === defenderId) || allPokemon[1];

  // Filtered lists for quick selection
  const filteredMoves = useMemo(() => {
    const q = moveSearch.toLowerCase().trim();
    if (!q) return allMoves.slice(0, 50);
    return allMoves.filter(m => m.displayName.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)).slice(0, 50);
  }, [allMoves, moveSearch]);

  const filteredAttackers = useMemo(() => {
    const q = attackerSearch.toLowerCase().trim();
    if (!q) return allPokemon.slice(0, 50);
    return allPokemon.filter(p => p.name.toLowerCase().includes(q) || String(p.id) === q).slice(0, 50);
  }, [allPokemon, attackerSearch]);

  const filteredDefenders = useMemo(() => {
    const q = defenderSearch.toLowerCase().trim();
    if (!q) return allPokemon.slice(0, 50);
    return allPokemon.filter(p => p.name.toLowerCase().includes(q) || String(p.id) === q).slice(0, 50);
  }, [allPokemon, defenderSearch]);

  // Run battle analysis
  const result = useMemo(() => {
    return analyzeMoveEffectiveness({
      move: {
        name: currentMove.displayName,
        type: currentMove.type,
        category: currentMove.category,
        power: currentMove.power,
        accuracy: currentMove.accuracy,
      },
      attacker: {
        name: attacker.name,
        types: attacker.types,
        stats: { attack: attacker.stats.attack, specialAttack: attacker.stats.specialAttack },
      },
      defender: {
        name: defender.name,
        types: defender.types,
        stats: {
          hp: defender.stats.hp,
          defense: defender.stats.defense,
          specialDefense: defender.stats.specialDefense,
        },
        ability: defenderAbility !== 'none' ? defenderAbility : undefined,
      },
    });
  }, [currentMove, attacker, defender, defenderAbility]);

  const effInfo = getEffectivenessLabel(result.finalTypeMultiplier);

  return (
    <div className="space-y-8">
      {/* Three-Column Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attacking Pokémon Selector */}
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Zap className="w-4 h-4 mr-1.5 text-yellow-400" />
              1. Attacking Pokémon
            </span>
            <span className="font-mono text-xs text-slate-500">#{String(attacker.id).padStart(3, '0')}</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <img src={attacker.sprite} alt={attacker.name} className="w-14 h-14 object-contain" />
            <div>
              <div className="font-bold text-sm text-slate-100">{attacker.name}</div>
              <div className="flex gap-1 mt-1">
                {attacker.types.map(t => (
                  <TypeBadge key={t} type={t} size="xs" asLink={false} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={attackerSearch}
              onChange={e => setAttackerSearch(e.target.value)}
              placeholder="Search attacker..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mb-2 focus:outline-none focus:border-red-500"
            />
            <select
              value={attackerId}
              onChange={e => setAttackerId(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
            >
              {filteredAttackers.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.id} {p.name} ({p.types.join('/')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Move Selector */}
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Swords className="w-4 h-4 mr-1.5 text-red-400" />
              2. Selected Move
            </span>
            <CategoryBadge category={currentMove.category} size="sm" showIcon={false} />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-slate-100">{currentMove.displayName}</span>
              <TypeBadge type={currentMove.type} size="xs" asLink={false} />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>PWR: <strong className="text-slate-200">{currentMove.power ?? '—'}</strong></span>
              <span>ACC: <strong className="text-slate-200">{currentMove.accuracy ? `${currentMove.accuracy}%` : '—'}</strong></span>
              <span>PP: <strong className="text-slate-200">{currentMove.pp}</strong></span>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={moveSearch}
              onChange={e => setMoveSearch(e.target.value)}
              placeholder="Search moves..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mb-2 focus:outline-none focus:border-red-500"
            />
            <select
              value={selectedMoveId}
              onChange={e => setSelectedMoveId(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
            >
              {filteredMoves.map(m => (
                <option key={m.id} value={m.id}>
                  {m.displayName} ({m.type} • {m.category} • PWR {m.power ?? '—'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Defender Selector */}
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <Shield className="w-4 h-4 mr-1.5 text-blue-400" />
              3. Defending Pokémon
            </span>
            <span className="font-mono text-xs text-slate-500">#{String(defender.id).padStart(3, '0')}</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <img src={defender.sprite} alt={defender.name} className="w-14 h-14 object-contain" />
            <div>
              <div className="font-bold text-sm text-slate-100">{defender.name}</div>
              <div className="flex gap-1 mt-1">
                {defender.types.map(t => (
                  <TypeBadge key={t} type={t} size="xs" asLink={false} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={defenderSearch}
              onChange={e => setDefenderSearch(e.target.value)}
              placeholder="Search defender..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mb-2 focus:outline-none focus:border-red-500"
            />
            <select
              value={defenderId}
              onChange={e => {
                setDefenderId(Number(e.target.value));
                setDefenderAbility('none');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
            >
              {filteredDefenders.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.id} {p.name} ({p.types.join('/')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Analysis Display */}
      <div className="bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-700/70 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Battle Effectiveness Analysis
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <span>{attacker.name}</span>
              <span className="text-slate-500 text-base font-normal">uses</span>
              <span className="text-red-400">{currentMove.displayName}</span>
              <span className="text-slate-500 text-base font-normal">on</span>
              <span>{defender.name}</span>
            </h2>
          </div>

          {/* Big Multiplier Pill */}
          <div className={`px-5 py-3 rounded-2xl border text-center ${effInfo.badgeClass}`}>
            <span className="text-3xl sm:text-4xl font-black block tracking-tight">
              {formatMultiplier(result.finalTypeMultiplier)}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider block">
              {effInfo.label}
            </span>
          </div>
        </div>

        {/* Factors Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Factor 1: Move Type & Category */}
          <div className="p-4 rounded-xl bg-darkbg-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Move Elemental Class
            </span>
            <div className="flex items-center gap-2 mt-1">
              <TypeBadge type={currentMove.type} size="sm" asLink={false} />
              <CategoryBadge category={currentMove.category} size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Base Power: {currentMove.power ?? 'N/A (Status)'}
            </p>
          </div>

          {/* Factor 2: STAB Check */}
          <div className="p-4 rounded-xl bg-darkbg-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              STAB (Same-Type Bonus)
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                  result.isSTAB
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {result.isSTAB ? `YES (${result.stabMultiplier}× Boost)` : 'NO (1.0× Normal)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {result.isSTAB
                ? `${attacker.name} matches move type (${currentMove.type})`
                : `${attacker.name} does not match move type`}
            </p>
          </div>

          {/* Factor 3: Dual-Type Multiplier */}
          <div className="p-4 rounded-xl bg-darkbg-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Type Matchup Breakdown
            </span>
            <div className="text-xs text-slate-300 font-mono mt-1">
              {defender.types.map((t, i) => (
                <div key={t} className="capitalize">
                  vs {t}: <strong className="text-white">{formatMultiplier(result.typeEffectiveness.individual[i]?.multiplier ?? 1)}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Factor 4: Estimated Damage Range */}
          <div className="p-4 rounded-xl bg-darkbg-900/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Est. Lv. 100 Damage
            </span>
            {result.estimatedDamageRange ? (
              <div className="mt-1">
                <span className="text-sm font-bold text-white font-mono">
                  {result.estimatedDamageRange.minPercent}% – {result.estimatedDamageRange.maxPercent}%
                </span>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  ({result.estimatedDamageRange.minDamage} – {result.estimatedDamageRange.maxDamage} HP)
                </p>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic mt-1 block">Status move deals no direct damage</span>
            )}
          </div>
        </div>

        {/* Clear Distinction Notice */}
        <div className="p-4 rounded-2xl bg-darkbg-900/90 border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-red-400" />
            Important Battle Mechanic Distinction:
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {result.damageFormulaExplanation}
          </p>
        </div>
      </div>
    </div>
  );
};
