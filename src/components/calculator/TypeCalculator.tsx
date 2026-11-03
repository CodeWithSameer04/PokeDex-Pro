import React, { useState } from 'react';
import { PokemonType } from '../../types/pokemon';
import { ALL_POKEMON_TYPES, TYPES_DATA } from '../../data/typesData';
import {
  calculateDualTypeEffectiveness,
  getDefensiveProfile,
  formatMultiplier,
  getEffectivenessLabel,
} from '../../utils/typeCalculations';
import { TypeBadge } from '../common/TypeBadge';
import { Calculator, Shield, Swords, Sparkles, AlertCircle, Info } from 'lucide-react';

const COMMON_DEFENSIVE_ABILITIES = [
  { id: 'none', label: 'None (Standard)' },
  { id: 'levitate', label: 'Levitate (Ground Immunity)' },
  { id: 'flash fire', label: 'Flash Fire (Fire Immunity)' },
  { id: 'volt absorb', label: 'Volt Absorb (Electric Immunity)' },
  { id: 'water absorb', label: 'Water Absorb (Water Immunity)' },
  { id: 'dry skin', label: 'Dry Skin (Water Immunity, 1.25x Fire)' },
  { id: 'sap sipper', label: 'Sap Sipper (Grass Immunity)' },
  { id: 'earth eater', label: 'Earth Eater (Ground Immunity)' },
  { id: 'thick fat', label: 'Thick Fat (Halves Fire & Ice)' },
  { id: 'wonder guard', label: 'Wonder Guard (Only Super Effective hits)' },
];

export const TypeCalculator: React.FC = () => {
  const [mode, setMode] = useState<'matchup' | 'defensive'>('matchup');

  // Matchup State
  const [attackType, setAttackType] = useState<PokemonType>('rock');
  const [defendType1, setDefendType1] = useState<PokemonType>('fire');
  const [defendType2, setDefendType2] = useState<PokemonType | 'none'>('flying');
  const [selectedAbility, setSelectedAbility] = useState<string>('none');

  // Defensive Checker State
  const [targetType1, setTargetType1] = useState<PokemonType>('fire');
  const [targetType2, setTargetType2] = useState<PokemonType | 'none'>('flying');
  const [targetAbility, setTargetAbility] = useState<string>('none');

  // Calculations
  const defTypes = defendType2 === 'none' ? [defendType1] : [defendType1, defendType2];
  const matchupResult = calculateDualTypeEffectiveness(attackType, defTypes, {
    ability: selectedAbility !== 'none' ? selectedAbility : undefined,
  });
  const effectivenessInfo = getEffectivenessLabel(matchupResult.multiplier);

  // Defensive Profile
  const profileTypes = targetType2 === 'none' ? [targetType1] : [targetType1, targetType2];
  const defensiveSummary = getDefensiveProfile(profileTypes, {
    ability: targetAbility !== 'none' ? targetAbility : undefined,
  });

  return (
    <div className="space-y-8">
      {/* Mode Tabs */}
      <div className="flex border-b border-slate-700/80">
        <button
          onClick={() => setMode('matchup')}
          className={`flex items-center space-x-2 py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
            mode === 'matchup'
              ? 'border-red-500 text-red-400 bg-red-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Attacking Matchup Calculator</span>
        </button>

        <button
          onClick={() => setMode('defensive')}
          className={`flex items-center space-x-2 py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
            mode === 'defensive'
              ? 'border-red-500 text-red-400 bg-red-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Defensive Type Checker</span>
        </button>
      </div>

      {/* MODE 1: ATTACKING MATCHUP CALCULATOR */}
      {mode === 'matchup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Left Column */}
          <div className="lg:col-span-5 bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-base text-slate-100 flex items-center">
              <Swords className="w-4 h-4 mr-2 text-red-400" />
              1. Select Attacking Move Type
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ALL_POKEMON_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setAttackType(type)}
                  className={`p-1.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    attackType === type
                      ? 'border-red-500 bg-red-500/20 text-white shadow-glow-fire scale-105'
                      : 'border-slate-700/60 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <TypeBadge type={type} size="xs" asLink={false} />
                </button>
              ))}
            </div>

            <div className="border-t border-slate-700/60 pt-6 space-y-4">
              <h3 className="font-bold text-base text-slate-100 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-400" />
                2. Select Defending Pokémon Types
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Primary Defending Type
                  </label>
                  <select
                    value={defendType1}
                    onChange={e => setDefendType1(e.target.value as PokemonType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 capitalize"
                  >
                    {ALL_POKEMON_TYPES.map(t => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Secondary Type (Optional)
                  </label>
                  <select
                    value={defendType2}
                    onChange={e => setDefendType2(e.target.value as PokemonType | 'none')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 capitalize"
                  >
                    <option value="none">None (Single Type)</option>
                    {ALL_POKEMON_TYPES.filter(t => t !== defendType1).map(t => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Defender Ability Interaction
                </label>
                <select
                  value={selectedAbility}
                  onChange={e => setSelectedAbility(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                >
                  {COMMON_DEFENSIVE_ABILITIES.map(ab => (
                    <option key={ab.id} value={ab.id}>
                      {ab.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Right Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Calculated Result
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <TypeBadge type={attackType} size="md" />
                    <span className="text-slate-400 font-bold text-sm">VS</span>
                    <div className="flex items-center gap-1.5">
                      <TypeBadge type={defendType1} size="md" />
                      {defendType2 !== 'none' && <TypeBadge type={defendType2} size="md" />}
                    </div>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-2xl border text-center ${effectivenessInfo.badgeClass}`}>
                  <span className="text-2xl sm:text-3xl font-black block tracking-tight">
                    {formatMultiplier(matchupResult.multiplier)}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider block">
                    {effectivenessInfo.label}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="p-4 rounded-2xl bg-darkbg-900/80 border border-slate-700/60 space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-slate-300">
                  <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed font-medium">{matchupResult.breakdown}</p>
                </div>

                {matchupResult.individual.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                    {matchupResult.individual.map(item => (
                      <div key={item.type} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40">
                        <span className="capitalize">Against {item.type}:</span>
                        <strong className="text-slate-200 font-mono">{formatMultiplier(item.multiplier)}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {matchupResult.abilityEffect && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>{matchupResult.abilityEffect}</span>
                </div>
              )}
            </div>

            {/* Quick Quickfire Presets */}
            <div className="bg-darkbg-800/50 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Popular Competitive Dual-Type Presets:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => {
                    setAttackType('rock');
                    setDefendType1('fire');
                    setDefendType2('flying');
                    setSelectedAbility('none');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Charizard (Fire/Flying vs Rock = 4×)
                </button>
                <button
                  onClick={() => {
                    setAttackType('electric');
                    setDefendType1('water');
                    setDefendType2('flying');
                    setSelectedAbility('none');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Gyarados (Water/Flying vs Elec = 4×)
                </button>
                <button
                  onClick={() => {
                    setAttackType('grass');
                    setDefendType1('water');
                    setDefendType2('ground');
                    setSelectedAbility('none');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Swampert (Water/Ground vs Grass = 4×)
                </button>
                <button
                  onClick={() => {
                    setAttackType('ground');
                    setDefendType1('electric');
                    setDefendType2('fire');
                    setSelectedAbility('levitate');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Rotom-Heat (Levitate vs Ground = 0×)
                </button>
                <button
                  onClick={() => {
                    setAttackType('water');
                    setDefendType1('bug');
                    setDefendType2('ghost');
                    setSelectedAbility('wonder guard');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Shedinja (Wonder Guard vs Water = 0×)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DEFENSIVE TYPE CHECKER */}
      {mode === 'defensive' && (
        <div className="space-y-6">
          {/* Defender Selector Header */}
          <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-6">
            <h3 className="font-bold text-base text-slate-100 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-400" />
              Configure Defending Pokémon Typing & Ability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Primary Type</label>
                <select
                  value={targetType1}
                  onChange={e => setTargetType1(e.target.value as PokemonType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 capitalize"
                >
                  {ALL_POKEMON_TYPES.map(t => (
                    <option key={t} value={t} className="capitalize">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Secondary Type</label>
                <select
                  value={targetType2}
                  onChange={e => setTargetType2(e.target.value as PokemonType | 'none')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500 capitalize"
                >
                  <option value="none">None (Single Type)</option>
                  {ALL_POKEMON_TYPES.filter(t => t !== targetType1).map(t => (
                    <option key={t} value={t} className="capitalize">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Defensive Ability</label>
                <select
                  value={targetAbility}
                  onChange={e => setTargetAbility(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-red-500"
                >
                  {COMMON_DEFENSIVE_ABILITIES.map(ab => (
                    <option key={ab.id} value={ab.id}>
                      {ab.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Defensive Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 4x Double Weaknesses */}
            <div className="bg-darkbg-800/80 border border-red-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1.5 text-red-400" />
                  Double Weaknesses (4×)
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  {defensiveSummary.quadrupleDamageFrom.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {defensiveSummary.quadrupleDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.quadrupleDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 2x Weaknesses */}
            <div className="bg-darkbg-800/80 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-400 flex items-center">
                  <Swords className="w-4 h-4 mr-1.5 text-amber-400" />
                  Weaknesses (2×)
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  {defensiveSummary.doubleDamageFrom.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {defensiveSummary.doubleDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.doubleDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 0x Immunities */}
            <div className="bg-darkbg-800/80 border border-purple-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-purple-300 flex items-center">
                  <Shield className="w-4 h-4 mr-1.5 text-purple-400" />
                  Immunities (0×)
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {defensiveSummary.noDamageFrom.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {defensiveSummary.noDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.noDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 0.5x Resistances */}
            <div className="bg-darkbg-800/80 border border-blue-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-blue-400">Resistances (½×)</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {defensiveSummary.halfDamageFrom.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {defensiveSummary.halfDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.halfDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 0.25x Double Resistances */}
            <div className="bg-darkbg-800/80 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-400">Double Resistances (¼×)</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {defensiveSummary.quarterDamageFrom.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {defensiveSummary.quarterDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.quarterDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 1x Neutral */}
            <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-400">Neutral Damage (1×)</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                  {defensiveSummary.normalDamageFrom.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {defensiveSummary.normalDamageFrom.map(t => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
