import React, { useState, useMemo } from 'react';
import { getLocalPokemonList } from '../utils/pokeapi';
import { ALL_POKEMON_TYPES } from '../data/typesData';
import { PokemonType } from '../types/pokemon';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useGameVersion } from '../context/GameVersionContext';
import {
  Search,
  Filter,
  ArrowUpDown,
  Compass,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const ITEMS_PER_PAGE = 24;

export const PokedexPage: React.FC = () => {
  const allPokemon = useMemo(() => getLocalPokemonList(), []);
  const { selectedGeneration, selectedVersion } = useGameVersion();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | 'all'>('all');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [typeFilterMode, setTypeFilterMode] = useState<'all' | 'single' | 'dual'>('all');
  const [specialFilter, setSpecialFilter] = useState<'all' | 'legendary' | 'mythical' | 'regional'>('all');
  const [minBST, setMinBST] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'bst' | 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered & Sorted Pokémon list
  const filteredPokemon = useMemo(() => {
    let list = allPokemon;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          String(p.id) === q ||
          p.types.some(t => t.toLowerCase().includes(q)) ||
          p.abilities.some(a => a.name.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      list = list.filter(p => p.types.includes(selectedType));
    }

    // Generation filter
    if (selectedGen !== 'all') {
      list = list.filter(p => p.generation === selectedGen);
    }

    // Single vs Dual Type
    if (typeFilterMode === 'single') {
      list = list.filter(p => p.types.length === 1);
    } else if (typeFilterMode === 'dual') {
      list = list.filter(p => p.types.length === 2);
    }

    // Special classification
    if (specialFilter === 'legendary') {
      list = list.filter(p => p.isLegendary);
    } else if (specialFilter === 'mythical') {
      list = list.filter(p => p.isMythical);
    } else if (specialFilter === 'regional') {
      list = list.filter(p => p.isRegional);
    }

    // Min BST
    if (minBST > 0) {
      list = list.filter(p => p.stats.total >= minBST);
    }

    // Sorting
    list = [...list].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') comparison = a.id - b.id;
      else if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortBy === 'bst') comparison = a.stats.total - b.stats.total;
      else if (sortBy === 'hp') comparison = a.stats.hp - b.stats.hp;
      else if (sortBy === 'attack') comparison = a.stats.attack - b.stats.attack;
      else if (sortBy === 'defense') comparison = a.stats.defense - b.stats.defense;
      else if (sortBy === 'spAttack') comparison = a.stats.specialAttack - b.stats.specialAttack;
      else if (sortBy === 'spDefense') comparison = a.stats.specialDefense - b.stats.specialDefense;
      else if (sortBy === 'speed') comparison = a.stats.speed - b.stats.speed;

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [
    allPokemon,
    searchQuery,
    selectedType,
    selectedGen,
    typeFilterMode,
    specialFilter,
    minBST,
    sortBy,
    sortDirection,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE) || 1;
  const paginatedPokemon = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPokemon.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPokemon, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedGen('all');
    setTypeFilterMode('all');
    setSpecialFilter('all');
    setMinBST(0);
    setSortBy('id');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Pokédex' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
            <Compass className="w-4 h-4" />
            Complete National Pokédex
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Pokédex Encyclopedia
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Explore all 1,025 Pokémon species, battle statistics, types, and competitive variants.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
          <span>Active Game:</span>
          <strong className="text-white">{selectedVersion.name} (Gen {selectedGeneration})</strong>
        </div>
      </div>

      {/* Controls: Search, Filters, and Sorters */}
      <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
        {/* Row 1: Search Bar & Sort Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Pokémon name, #ID, ability, or type..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="id">Sort by: Dex Number</option>
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="bst">Sort by: Base Stat Total</option>
              <option value="speed">Sort by: Speed</option>
              <option value="attack">Sort by: Attack</option>
              <option value="spAttack">Sort by: Sp. Attack</option>
              <option value="defense">Sort by: Defense</option>
              <option value="spDefense">Sort by: Sp. Defense</option>
              <option value="hp">Sort by: HP</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex gap-2">
            <button
              onClick={() => setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'))}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortDirection === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              title="Reset All Filters"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Filter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-700/50 text-xs">
          {/* Type Select */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Elemental Type</label>
            <select
              value={selectedType}
              onChange={e => {
                setSelectedType(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 capitalize focus:outline-none focus:border-red-500"
            >
              <option value="all">All 18 Types</option>
              {ALL_POKEMON_TYPES.map(t => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Gen Select */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Generation</label>
            <select
              value={selectedGen}
              onChange={e => {
                setSelectedGen(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Generations (1–9)</option>
              <option value="1">Gen 1 – Kanto</option>
              <option value="2">Gen 2 – Johto</option>
              <option value="3">Gen 3 – Hoenn</option>
              <option value="4">Gen 4 – Sinnoh</option>
              <option value="5">Gen 5 – Unova</option>
              <option value="6">Gen 6 – Kalos</option>
              <option value="7">Gen 7 – Alola</option>
              <option value="8">Gen 8 – Galar</option>
              <option value="9">Gen 9 – Paldea</option>
            </select>
          </div>

          {/* Single / Dual */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Typing Structure</label>
            <select
              value={typeFilterMode}
              onChange={e => {
                setTypeFilterMode(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">Single & Dual Types</option>
              <option value="single">Single-Type Only</option>
              <option value="dual">Dual-Type Only</option>
            </select>
          </div>

          {/* Special Categories */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Classification</label>
            <select
              value={specialFilter}
              onChange={e => {
                setSpecialFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Species</option>
              <option value="legendary">Legendary Pokémon</option>
              <option value="mythical">Mythical Pokémon</option>
              <option value="regional">Regional Variants</option>
            </select>
          </div>

          {/* Min Base Stat Total */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <label className="block text-slate-400 font-medium mb-1">
              Min BST: <span className="text-white font-mono">{minBST > 0 ? minBST : 'Any'}</span>
            </label>
            <input
              type="range"
              min="0"
              max="720"
              step="20"
              value={minBST}
              onChange={e => {
                setMinBST(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>
          Showing <strong className="text-slate-100">{paginatedPokemon.length}</strong> of{' '}
          <strong className="text-slate-100">{filteredPokemon.length}</strong> Pokémon matches
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Pokemon Grid */}
      {paginatedPokemon.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginatedPokemon.map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-darkbg-800/50 border border-slate-800 rounded-2xl space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="font-bold text-base text-slate-200">No Pokémon Match Your Filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms, clearing specific type filters, or lowering the minimum BST requirement.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-glow-fire transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="px-4 py-2 rounded-xl bg-darkbg-800 border border-slate-700/80 text-xs font-mono text-slate-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
