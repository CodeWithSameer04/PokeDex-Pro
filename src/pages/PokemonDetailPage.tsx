import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getLocalPokemon,
  getLocalPokemonList,
  fetchLivePokemonDetail,
  fetchLivePokemonSpecies,
  fetchLiveEvolutionChain,
} from '../utils/pokeapi';
import { TypeBadge } from '../components/common/TypeBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { StatBar } from '../components/common/StatBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { getDefensiveProfile, formatMultiplier } from '../utils/typeCalculations';
import { TYPE_COLORS } from '../data/typesData';
import { useGameVersion } from '../context/GameVersionContext';
import {
  Volume2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Swords,
  BookOpen,
  ArrowRight,
  Info,
} from 'lucide-react';

export const PokemonDetailPage: React.FC = () => {
  const { idOrName } = useParams<{ idOrName: string }>();
  const { selectedVersion } = useGameVersion();

  const [isShiny, setIsShiny] = useState(false);
  const [isPlayingCry, setIsPlayingCry] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'defenses' | 'moves' | 'evolution'>('stats');
  const [liveData, setLiveData] = useState<any>(null);
  const [evolutionData, setEvolutionData] = useState<any>(null);
  const [movesFilterMethod, setMovesFilterMethod] = useState<'all' | 'level-up' | 'machine' | 'egg'>('all');

  const localPoke = getLocalPokemon(idOrName || '1');
  const allPokemon = getLocalPokemonList();

  const prevPokemon = localPoke && localPoke.id > 1 ? allPokemon.find(p => p.id === localPoke.id - 1) : null;
  const nextPokemon = localPoke && localPoke.id < 1025 ? allPokemon.find(p => p.id === localPoke.id + 1) : null;

  // Fetch live PokeAPI details (learnsets, cries, species evolutions)
  useEffect(() => {
    if (!localPoke) return;
    let isMounted = true;

    async function loadLiveData() {
      const detail = await fetchLivePokemonDetail(localPoke!.id);
      if (!isMounted) return;
      if (detail) {
        setLiveData(detail);
        if (detail.species?.url) {
          const speciesData = await fetchLivePokemonSpecies(localPoke!.id);
          if (speciesData?.evolution_chain?.url) {
            const evo = await fetchLiveEvolutionChain(speciesData.evolution_chain.url);
            if (isMounted) setEvolutionData(evo);
          }
        }
      }
    }

    loadLiveData();
    return () => {
      isMounted = false;
    };
  }, [localPoke]);

  if (!localPoke) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Pokémon Not Found</h2>
        <p className="text-slate-400">The Pokémon you requested could not be located in the Pokédex.</p>
        <Link to="/pokedex" className="inline-block px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold">
          Return to Pokédex
        </Link>
      </div>
    );
  }

  const primaryType = localPoke.types[0] || 'normal';
  const typeConfig = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  // Cry audio
  const cryAudioUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${localPoke.id}.ogg`;

  const handlePlayCry = () => {
    try {
      setIsPlayingCry(true);
      const audio = new Audio(cryAudioUrl);
      audio.onended = () => setIsPlayingCry(false);
      audio.onerror = () => setIsPlayingCry(false);
      audio.play().catch(() => setIsPlayingCry(false));
    } catch {
      setIsPlayingCry(false);
    }
  };

  // Type Defenses
  const defensiveSummary = getDefensiveProfile(localPoke.types);

  // Artwork & Sprite
  const currentArtwork = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${localPoke.id}.png`
    : localPoke.artwork;

  // Process live moves
  const movesLearnset = liveData?.moves
    ? (liveData.moves as any[]).map(m => {
        const latestVG = m.version_group_details[m.version_group_details.length - 1];
        return {
          name: m.move.name,
          url: m.move.url,
          method: latestVG?.move_learn_method?.name || 'unknown',
          levelLearnedAt: latestVG?.level_learned_at || 0,
        };
      })
    : [];

  const filteredMoves = movesLearnset.filter(m => {
    if (movesFilterMethod === 'all') return true;
    return m.method === movesFilterMethod;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumbs
        items={[
          { label: 'Pokédex', path: '/pokedex' },
          { label: `${localPoke.name} (#${String(localPoke.id).padStart(3, '0')})` },
        ]}
      />

      {/* Top Prev / Next Navigation Bar */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800 text-xs font-mono">
        {prevPokemon ? (
          <Link
            to={`/pokemon/${prevPokemon.id}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>#{String(prevPokemon.id).padStart(3, '0')} {prevPokemon.name}</span>
          </Link>
        ) : (
          <div />
        )}

        <span className="text-slate-500 hidden sm:inline">National Pokédex</span>

        {nextPokemon ? (
          <Link
            to={`/pokemon/${nextPokemon.id}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <span>{nextPokemon.name} #{String(nextPokemon.id).padStart(3, '0')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Hero Overview Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: typeConfig.bg }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Visual Artwork Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center bg-slate-900/60 rounded-3xl border border-slate-700/50 p-6 shadow-inner">
              <img
                src={currentArtwork}
                alt={localPoke.name}
                className="w-full h-full object-contain filter drop-shadow-2xl transition-all duration-300 hover:scale-105 select-none"
              />
            </div>

            {/* Visual Controls: Shiny Toggle & Cry Sound */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsShiny(s => !s)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isShiny
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-fire'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>{isShiny ? 'Shiny Form Active' : 'View Shiny'}</span>
              </button>

              <button
                onClick={handlePlayCry}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700 transition-colors ${
                  isPlayingCry ? 'text-red-400 border-red-500/50 animate-pulse' : ''
                }`}
                title="Play Official Pokémon Cry"
              >
                <Volume2 className="w-3.5 h-3.5 text-red-400" />
                <span>{isPlayingCry ? 'Playing Cry...' : 'Play Cry'}</span>
              </button>
            </div>
          </div>

          {/* Right Data Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-400">
                  #{String(localPoke.id).padStart(3, '0')}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  Generation {localPoke.generation}
                </span>
                {localPoke.isLegendary && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                    Legendary
                  </span>
                )}
                {localPoke.isMythical && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                    Mythical
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white">{localPoke.name}</h1>
              <p className="text-base text-slate-400">{localPoke.species}</p>
            </div>

            {/* Types Badges */}
            <div className="flex flex-wrap gap-2">
              {localPoke.types.map(t => (
                <TypeBadge key={t} type={t} size="lg" />
              ))}
            </div>

            {/* Physical Attributes Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-2xl bg-darkbg-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Height</span>
                <span className="text-base font-bold text-white">{localPoke.height} m</span>
              </div>
              <div className="p-3 rounded-2xl bg-darkbg-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Weight</span>
                <span className="text-base font-bold text-white">{localPoke.weight} kg</span>
              </div>
              <div className="p-3 rounded-2xl bg-darkbg-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Base Stat Total</span>
                <span className="text-base font-bold text-red-400">{localPoke.stats.total}</span>
              </div>
              <div className="p-3 rounded-2xl bg-darkbg-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Primary Type</span>
                <span className="text-base font-bold capitalize text-slate-200">{primaryType}</span>
              </div>
            </div>

            {/* Abilities */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Abilities
              </span>
              <div className="flex flex-wrap gap-2">
                {localPoke.abilities.map((a, i) => (
                  <Link
                    key={i}
                    to={`/abilities/${a.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 ${
                      a.isHidden
                        ? 'bg-purple-950/40 text-purple-300 border-purple-700/60'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span>{a.name}</span>
                    {a.isHidden && (
                      <span className="ml-1.5 text-[10px] font-mono uppercase text-purple-400 font-bold">
                        (Hidden)
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Stats, Defenses, Learnset, Evolution */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'stats'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Base Stats & Level 100</span>
        </button>

        <button
          onClick={() => setActiveTab('defenses')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'defenses'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Type Defenses</span>
        </button>

        <button
          onClick={() => setActiveTab('moves')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'moves'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Learnable Moves ({movesLearnset.length > 0 ? movesLearnset.length : 'Learnset'})</span>
        </button>

        <button
          onClick={() => setActiveTab('evolution')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'evolution'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Evolution Chain</span>
        </button>
      </div>

      {/* TAB CONTENT 1: STATS */}
      {activeTab === 'stats' && (
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
            <div>
              <h3 className="font-bold text-lg text-white">Base Stats</h3>
              <p className="text-xs text-slate-400">
                Calculated ranges assume Level 100 Pokémon with 0 IV / 0 EV (Min) vs 31 IV / 252 EV / Beneficial Nature (Max).
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400">Total: </span>
              <strong className="text-xl text-red-400 font-extrabold">{localPoke.stats.total}</strong>
            </div>
          </div>

          <div className="space-y-3">
            <StatBar label="HP" value={localPoke.stats.hp} isHP={true} />
            <StatBar label="Attack" value={localPoke.stats.attack} />
            <StatBar label="Defense" value={localPoke.stats.defense} />
            <StatBar label="Sp. Atk" value={localPoke.stats.specialAttack} />
            <StatBar label="Sp. Def" value={localPoke.stats.specialDefense} />
            <StatBar label="Speed" value={localPoke.stats.speed} />
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: TYPE DEFENSES */}
      {activeTab === 'defenses' && (
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-700/60 pb-4">
            <h3 className="font-bold text-lg text-white">Defensive Type Matchups</h3>
            <p className="text-xs text-slate-400">
              The effectiveness of each attacking type against {localPoke.name}&apos;s typing ({localPoke.types.join('/')}).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 4x */}
            <div className="p-4 rounded-2xl bg-darkbg-900 border border-red-500/30 space-y-2">
              <span className="font-bold text-sm text-red-400 block">Double Weakness (4×)</span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.quadrupleDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.quadrupleDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 2x */}
            <div className="p-4 rounded-2xl bg-darkbg-900 border border-amber-500/30 space-y-2">
              <span className="font-bold text-sm text-amber-400 block">Weakness (2×)</span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.doubleDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.doubleDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 0x */}
            <div className="p-4 rounded-2xl bg-darkbg-900 border border-purple-500/30 space-y-2">
              <span className="font-bold text-sm text-purple-300 block">Immunity (0×)</span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.noDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.noDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 0.5x */}
            <div className="p-4 rounded-2xl bg-darkbg-900 border border-blue-500/30 space-y-2">
              <span className="font-bold text-sm text-blue-400 block">Resistance (½×)</span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.halfDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.halfDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 0.25x */}
            <div className="p-4 rounded-2xl bg-darkbg-900 border border-emerald-500/30 space-y-2">
              <span className="font-bold text-sm text-emerald-400 block">Double Resistance (¼×)</span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.quarterDamageFrom.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None</span>
                ) : (
                  defensiveSummary.quarterDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)
                )}
              </div>
            </div>

            {/* 1x */}
            <div className="p-4 rounded-2xl bg-darkbg-900 border border-slate-800 space-y-2">
              <span className="font-bold text-sm text-slate-400 block">Neutral Damage (1×)</span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
                {defensiveSummary.normalDamageFrom.map(t => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: LEARNABLE MOVES */}
      {activeTab === 'moves' && (
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
            <div>
              <h3 className="font-bold text-lg text-white">Learnable Moves</h3>
              <p className="text-xs text-slate-400">
                Moves learnable in modern main-series games by level-up, TM/machine, or breeding.
              </p>
            </div>

            {/* Filter Method Pills */}
            <div className="flex flex-wrap gap-1 text-xs">
              {(['all', 'level-up', 'machine', 'egg'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setMovesFilterMethod(method)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    movesFilterMethod === method
                      ? 'bg-red-500 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {method.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredMoves.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredMoves.map((m, idx) => (
                <Link
                  key={idx}
                  to={`/moves/${m.name}`}
                  className="p-3 rounded-xl bg-darkbg-900/70 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-semibold text-sm text-slate-200 capitalize">
                      {m.name.replace('-', ' ')}
                    </span>
                    <span className="block text-[10px] text-slate-400 capitalize">
                      Method: {m.method}
                    </span>
                  </div>
                  {m.levelLearnedAt > 0 && (
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                      Lv. {m.levelLearnedAt}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Swords className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">Extended move learnset is loading or not available offline for this filter.</p>
              <Link to="/moves" className="text-xs text-red-400 hover:underline">
                Search all moves in the Move Database →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: EVOLUTION CHAIN */}
      {activeTab === 'evolution' && (
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-700/60 pb-4">
            <h3 className="font-bold text-lg text-white">Evolutionary Line</h3>
            <p className="text-xs text-slate-400">
              Stages and triggers in this Pokémon&apos;s evolutionary branch.
            </p>
          </div>

          {evolutionData ? (
            <div className="flex flex-wrap items-center justify-center gap-6 py-6">
              <EvolutionStageNode node={evolutionData.chain} />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">Evolution chain data is synchronized with PokéAPI when online.</p>
              <p className="text-xs text-slate-500">Species ID: {localPoke.speciesId}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper recursive evolution stage node
const EvolutionStageNode: React.FC<{ node: any }> = ({ node }) => {
  if (!node) return null;
  const name = node.species?.name;
  const evoDetails = node.evolution_details?.[0];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Link
        to={`/pokemon/${name}`}
        className="flex flex-col items-center p-4 rounded-2xl bg-darkbg-900 border border-slate-700/70 hover:border-red-500 transition-all hover:scale-105 group"
      >
        <span className="font-bold text-sm text-slate-100 group-hover:text-red-400 capitalize">
          {name}
        </span>
        {evoDetails && (
          <span className="text-[10px] text-slate-400 mt-1 font-mono">
            {evoDetails.min_level ? `Level ${evoDetails.min_level}` : evoDetails.trigger?.name}
          </span>
        )}
      </Link>

      {node.evolves_to && node.evolves_to.length > 0 && (
        <div className="flex items-center gap-4">
          <ArrowRight className="w-5 h-5 text-slate-500 rotate-90 sm:rotate-0" />
          <div className="flex flex-col gap-4">
            {node.evolves_to.map((subNode: any, idx: number) => (
              <EvolutionStageNode key={idx} node={subNode} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
