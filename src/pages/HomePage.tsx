import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Swords,
  Layers,
  Calculator,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shuffle,
  Shield,
  Zap,
} from 'lucide-react';
import { getLocalPokemonList, getLocalMovesList } from '../utils/pokeapi';
import { ALL_POKEMON_TYPES, TYPE_COLORS, TYPES_DATA } from '../data/typesData';
import { TypeBadge } from '../components/common/TypeBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { PokemonCard } from '../components/pokemon/PokemonCard';

export const HomePage: React.FC = () => {
  const allPokemon = useMemo(() => getLocalPokemonList(), []);
  const allMoves = useMemo(() => getLocalMovesList(), []);

  // Daily or Random Pokémon
  const [randomPokemonIndex, setRandomPokemonIndex] = useState(() => {
    // Generate deterministic "daily" index based on current date
    const today = new Date();
    const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
    return seed % 1025;
  });

  const featuredPokemon = useMemo(() => {
    // Showcase some iconic Pokémon across generations
    const ids = [6, 25, 94, 130, 248, 282, 445, 658, 888, 1008];
    return allPokemon.filter(p => ids.includes(p.id));
  }, [allPokemon]);

  const popularMoves = useMemo(() => {
    // Popular battle staples
    const moveIds = [85, 53, 58, 89, 56, 412, 399, 416];
    return allMoves.filter(m => moveIds.includes(m.id));
  }, [allMoves]);

  const spotlightPokemon = allPokemon[randomPokemonIndex] || allPokemon[0];

  const handleRandomizeSpotlight = () => {
    const randomIndex = Math.floor(Math.random() * 1025);
    setRandomPokemonIndex(randomIndex);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden text-center">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generations 1–9 Modern Knowledge Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Everything About Pokémon.{' '}
            <span className="block mt-2 bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              One Place.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore Pokémon, discover moves, understand type matchups, and become a better trainer.
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/pokedex"
              className="flex items-center px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-glow-fire hover:scale-105"
            >
              <Compass className="w-4 h-4 mr-2" />
              Explore Pokédex
            </Link>

            <Link
              to="/moves"
              className="flex items-center px-6 py-3.5 rounded-2xl bg-darkbg-800 hover:bg-darkbg-700 text-slate-200 border border-slate-700/80 font-bold text-sm transition-all hover:scale-105"
            >
              <Swords className="w-4 h-4 mr-2 text-blue-400" />
              Browse Moves
            </Link>

            <Link
              to="/calculator"
              className="flex items-center px-6 py-3.5 rounded-2xl bg-darkbg-800 hover:bg-darkbg-700 text-slate-200 border border-slate-700/80 font-bold text-sm transition-all hover:scale-105"
            >
              <Calculator className="w-4 h-4 mr-2 text-emerald-400" />
              Check Type Matchups
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SPOTLIGHT / DAILY POKÉMON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-darkbg-800 via-darkbg-700 to-darkbg-800 border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-amber-400" />
                  Pokémon Spotlight of the Day
                </span>
                <button
                  onClick={handleRandomizeSpotlight}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  title="Randomize Spotlight Pokémon"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="font-mono text-xs text-slate-400">
                  #{String(spotlightPokemon.id).padStart(3, '0')} • Gen {spotlightPokemon.generation}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {spotlightPokemon.name}
                </h2>
                <p className="text-sm text-slate-400">{spotlightPokemon.species}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {spotlightPokemon.types.map(t => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-darkbg-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Base Stat Total</span>
                  <span className="text-lg font-bold text-white">{spotlightPokemon.stats.total}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-darkbg-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Height</span>
                  <span className="text-lg font-bold text-slate-200">{spotlightPokemon.height}m</span>
                </div>
                <div className="p-2.5 rounded-xl bg-darkbg-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Weight</span>
                  <span className="text-lg font-bold text-slate-200">{spotlightPokemon.weight}kg</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center lg:justify-start">
                <Link
                  to={`/pokemon/${spotlightPokemon.id}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-glow-fire"
                >
                  <span>View Full Pokédex Entry</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center p-4">
              <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-slate-900/80 border border-slate-700/60 flex items-center justify-center p-6 shadow-inner">
                <img
                  src={spotlightPokemon.artwork}
                  alt={spotlightPokemon.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BROWSE ALL 18 TYPES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
              <Layers className="w-4 h-4" />
              Elemental Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Browse All 18 Types</h2>
            <p className="text-slate-400 text-sm">
              Discover matchups, strengths, weaknesses, and every Pokémon belonging to each type.
            </p>
          </div>
          <Link
            to="/types"
            className="inline-flex items-center text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <span>Explore Type Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {ALL_POKEMON_TYPES.map(type => {
            const data = TYPES_DATA[type];
            return (
              <Link
                key={type}
                to={`/types/${type}`}
                style={{ backgroundColor: data.bgColor, borderColor: data.borderColor }}
                className="p-3.5 rounded-2xl border transition-all hover:scale-105 hover:shadow-lg flex flex-col justify-between min-h-[90px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm capitalize text-white">{data.name}</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  {data.damageRelations.doubleDamageTo.length} Strengths
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED POKÉMON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Compass className="w-4 h-4" />
              Species Database
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Pokémon</h2>
            <p className="text-slate-400 text-sm">
              Iconic champions across all 9 main-series generations from Kanto to Paldea.
            </p>
          </div>
          <Link
            to="/pokedex"
            className="inline-flex items-center text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <span>View All 1,025 Pokémon</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredPokemon.slice(0, 10).map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      </section>

      {/* 5. POPULAR MOVES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              <Swords className="w-4 h-4" />
              Arsenal & Techniques
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Competitive Moves</h2>
            <p className="text-slate-400 text-sm">
              Staple offensive attacks, priority tools, and strategic status techniques.
            </p>
          </div>
          <Link
            to="/moves"
            className="inline-flex items-center text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <span>View All 900+ Moves</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularMoves.map(m => (
            <Link
              key={m.id}
              to={`/moves/${m.id}`}
              className="p-4 rounded-2xl bg-darkbg-800/80 hover:bg-darkbg-700/80 border border-slate-700/60 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <TypeBadge type={m.type} size="xs" asLink={false} />
                  <CategoryBadge category={m.category} size="sm" showIcon={false} />
                </div>
                <h3 className="font-bold text-base text-white">{m.displayName}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px]">
                  {m.shortDescription}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs font-mono text-slate-300 mt-3">
                <span>PWR: <strong className="text-white">{m.power ?? '—'}</strong></span>
                <span>ACC: <strong className="text-white">{m.accuracy ? `${m.accuracy}%` : '—'}</strong></span>
                <span>PP: <strong className="text-white">{m.pp}</strong></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. TRAINING & LEARNING CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Beginner Learning Center</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              New to Pokémon battling? Learn the fundamentals: types, physical vs special moves, STAB bonuses, accuracy, PP, abilities, and status ailments with beginner-friendly guides.
            </p>
            <Link
              to="/learn"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-glow-fire"
            >
              <span>Start Learning Fundamentals</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Interactive Battle Quiz</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Test your battle knowledge! Guess super-effective multipliers, test dual-type counters, identify ability interactions, and climb the trainer ranks.
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-md"
            >
              <span>Take the Pokémon Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
