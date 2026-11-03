import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getLocalAbilitiesList } from '../utils/pokeapi';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Search, Sparkles, X, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const ABILITIES_PER_PAGE = 24;

export const AbilitiesPage: React.FC = () => {
  const allAbilities = useMemo(() => getLocalAbilitiesList(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'gen'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAbilities = useMemo(() => {
    let list = allAbilities;

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        a =>
          a.displayName.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q)
      );
    }

    if (selectedGen !== 'all') {
      list = list.filter(a => a.generation === selectedGen);
    }

    list = [...list].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.displayName.localeCompare(b.displayName);
      else if (sortBy === 'gen') comparison = a.generation - b.generation;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [allAbilities, searchQuery, selectedGen, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredAbilities.length / ABILITIES_PER_PAGE) || 1;
  const paginatedAbilities = useMemo(() => {
    const start = (currentPage - 1) * ABILITIES_PER_PAGE;
    return filteredAbilities.slice(start, start + ABILITIES_PER_PAGE);
  }, [filteredAbilities, currentPage]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedGen('all');
    setSortBy('name');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      <Breadcrumbs items={[{ label: 'Abilities' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
          <Sparkles className="w-4 h-4" />
          Passive Traits & In-Battle Mechanics
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Pokémon Ability Database</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Explore all 300+ official abilities introduced from Generation 3 to Generation 9. Discover battle interactions, type immunities, and competitive ratings.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-4">
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
              placeholder="Search abilities by name or effect... (e.g. Intimidate, Levitate, Wonder Guard)"
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
              value={selectedGen}
              onChange={e => {
                setSelectedGen(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Generations (3–9)</option>
              {[3, 4, 5, 6, 7, 8, 9].map(g => (
                <option key={g} value={g}>
                  Gen {g}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex gap-2">
            <button
              onClick={() => setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'))}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortDirection === 'asc' ? 'A-Z' : 'Z-A'}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>
          Showing <strong className="text-slate-100">{paginatedAbilities.length}</strong> of{' '}
          <strong className="text-slate-100">{filteredAbilities.length}</strong> Abilities
        </span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Grid */}
      {paginatedAbilities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedAbilities.map(a => (
            <Link
              key={a.id}
              to={`/abilities/${a.id}`}
              className="group p-5 rounded-2xl bg-darkbg-800/80 hover:bg-darkbg-700/80 border border-slate-700/60 hover:border-slate-500 transition-all hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {a.displayName}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    Gen {a.generation}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {a.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/50 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span className="group-hover:text-emerald-400 font-semibold transition-colors">
                  View Ability Details & Pokémon →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-darkbg-800/50 border border-slate-800 rounded-2xl space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="font-bold text-base text-slate-200">No Abilities Match Your Search</h3>
          <p className="text-xs text-slate-400">Try adjusting your query or resetting the generation filter.</p>
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
