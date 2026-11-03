import React, { useState, useMemo } from 'react';
import { getLocalMovesList } from '../utils/pokeapi';
import { ALL_POKEMON_TYPES } from '../data/typesData';
import { PokemonType, DamageCategory } from '../types/pokemon';
import { MoveCard } from '../components/moves/MoveCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Search, Filter, ArrowUpDown, Swords, X, ChevronLeft, ChevronRight } from 'lucide-react';

const MOVES_PER_PAGE = 24;

export const MovesPage: React.FC = () => {
  const allMoves = useMemo(() => getLocalMovesList(), []);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<DamageCategory | 'all'>('all');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [selectedFlag, setSelectedFlag] = useState<string>('all');
  const [minPower, setMinPower] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'name' | 'power' | 'accuracy' | 'pp' | 'priority' | 'gen'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMoves = useMemo(() => {
    let list = allMoves;

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        m =>
          m.displayName.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          m.shortDescription.toLowerCase().includes(q)
      );
    }

    if (selectedType !== 'all') {
      list = list.filter(m => m.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      list = list.filter(m => m.category === selectedCategory);
    }

    if (selectedGen !== 'all') {
      list = list.filter(m => m.generation === selectedGen);
    }

    if (selectedFlag !== 'all') {
      list = list.filter(m => {
        if (selectedFlag === 'contact') return m.flags.contact;
        if (selectedFlag === 'protect') return m.flags.protect;
        if (selectedFlag === 'sound') return m.flags.sound;
        if (selectedFlag === 'punch') return m.flags.punch;
        if (selectedFlag === 'bite') return m.flags.bite;
        return true;
      });
    }

    if (minPower > 0) {
      list = list.filter(m => m.power !== null && m.power >= minPower);
    }

    // Sort
    list = [...list].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.displayName.localeCompare(b.displayName);
      else if (sortBy === 'power') comparison = (a.power ?? -1) - (b.power ?? -1);
      else if (sortBy === 'accuracy') comparison = (a.accuracy ?? -1) - (b.accuracy ?? -1);
      else if (sortBy === 'pp') comparison = a.pp - b.pp;
      else if (sortBy === 'priority') comparison = a.priority - b.priority;
      else if (sortBy === 'gen') comparison = a.generation - b.generation;

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [
    allMoves,
    searchQuery,
    selectedType,
    selectedCategory,
    selectedGen,
    selectedFlag,
    minPower,
    sortBy,
    sortDirection,
  ]);

  const totalPages = Math.ceil(filteredMoves.length / MOVES_PER_PAGE) || 1;
  const paginatedMoves = useMemo(() => {
    const start = (currentPage - 1) * MOVES_PER_PAGE;
    return filteredMoves.slice(start, start + MOVES_PER_PAGE);
  }, [filteredMoves, currentPage]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedGen('all');
    setSelectedFlag('all');
    setMinPower(0);
    setSortBy('name');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      <Breadcrumbs items={[{ label: 'Moves' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
          <Swords className="w-4 h-4" />
          Techniques & Combat Moves
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Pokémon Move Database</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Search and compare over 900 official moves across Generations 1 through 9. Filter by Physical, Special, or Status category, base power, accuracy, flags, and generation.
        </p>
      </div>

      {/* Filter Controls Box */}
      <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
        {/* Row 1: Search & Sorting */}
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
              placeholder="Search moves by name or description... (e.g. Earthquake, Close Combat)"
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
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="power">Sort by: Base Power</option>
              <option value="accuracy">Sort by: Accuracy</option>
              <option value="pp">Sort by: PP</option>
              <option value="priority">Sort by: Priority</option>
              <option value="gen">Sort by: Generation</option>
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
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters */}
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

          {/* Category Select */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Damage Category</label>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 capitalize focus:outline-none focus:border-red-500"
            >
              <option value="all">All Categories</option>
              <option value="physical">Physical (Uses Atk / Def)</option>
              <option value="special">Special (Uses SpAtk / SpDef)</option>
              <option value="status">Status (Non-Damaging)</option>
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => (
                <option key={g} value={g}>
                  Gen {g}
                </option>
              ))}
            </select>
          </div>

          {/* Special Flags */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Move Flag / Mechanics</label>
            <select
              value={selectedFlag}
              onChange={e => {
                setSelectedFlag(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Move Flags</option>
              <option value="contact">Makes Contact</option>
              <option value="protect">Blocked by Protect</option>
              <option value="sound">Sound-based Move</option>
              <option value="punch">Punching Move (Iron Fist)</option>
              <option value="bite">Biting Move (Strong Jaw)</option>
            </select>
          </div>

          {/* Min Base Power Slider */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <label className="block text-slate-400 font-medium mb-1">
              Min Power: <span className="text-white font-mono">{minPower > 0 ? minPower : 'Any'}</span>
            </label>
            <input
              type="range"
              min="0"
              max="150"
              step="10"
              value={minPower}
              onChange={e => {
                setMinPower(Number(e.target.value));
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
          Showing <strong className="text-slate-100">{paginatedMoves.length}</strong> of{' '}
          <strong className="text-slate-100">{filteredMoves.length}</strong> Moves
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Moves Grid */}
      {paginatedMoves.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedMoves.map(m => (
            <MoveCard key={m.id} move={m} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-darkbg-800/50 border border-slate-800 rounded-2xl space-y-3">
          <Swords className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="font-bold text-base text-slate-200">No Moves Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing specific category and power filters.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-glow-fire transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
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
