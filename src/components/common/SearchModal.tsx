import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, Swords, BookOpen, Layers } from 'lucide-react';
import { getLocalPokemonList, getLocalMovesList, getLocalAbilitiesList } from '../../utils/pokeapi';
import { ALL_POKEMON_TYPES } from '../../data/typesData';
import { TypeBadge } from './TypeBadge';
import { CategoryBadge } from './CategoryBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search logic
  const pokemonResults = trimmed
    ? getLocalPokemonList()
        .filter(
          p =>
            p.name.toLowerCase().includes(trimmed) ||
            p.slug.toLowerCase().includes(trimmed) ||
            String(p.id) === trimmed ||
            p.types.some(t => t.includes(trimmed))
        )
        .slice(0, 6)
    : [];

  const moveResults = trimmed
    ? getLocalMovesList()
        .filter(
          m =>
            m.displayName.toLowerCase().includes(trimmed) ||
            m.name.toLowerCase().includes(trimmed) ||
            m.type.includes(trimmed)
        )
        .slice(0, 5)
    : [];

  const abilityResults = trimmed
    ? getLocalAbilitiesList()
        .filter(
          a =>
            a.displayName.toLowerCase().includes(trimmed) ||
            a.name.toLowerCase().includes(trimmed) ||
            a.shortDescription.toLowerCase().includes(trimmed)
        )
        .slice(0, 4)
    : [];

  const typeResults = trimmed
    ? ALL_POKEMON_TYPES.filter(t => t.includes(trimmed)).slice(0, 3)
    : [];

  const hasResults =
    pokemonResults.length > 0 ||
    moveResults.length > 0 ||
    abilityResults.length > 0 ||
    typeResults.length > 0;

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-darkbg-800 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-700/60 bg-darkbg-900/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Pokémon, Moves, Abilities, or Types... (e.g. Charizard, Earthquake, Intimidate)"
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/50 transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-6">
          {!trimmed && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">Quick Global Search</p>
              <p className="text-xs text-slate-500">
                Type any Pokémon name (e.g. &apos;Pikachu&apos;), Dex number (#025), move (&apos;Flamethrower&apos;), ability, or type.
              </p>
            </div>
          )}

          {trimmed && !hasResults && (
            <div className="text-center py-10 text-slate-400 space-y-1">
              <p className="text-sm font-medium text-slate-300">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500">Try searching for a different name, ID number, or category.</p>
            </div>
          )}

          {/* Type Matches */}
          {typeResults.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                Types
              </div>
              <div className="flex flex-wrap gap-2">
                {typeResults.map(type => (
                  <button
                    key={type}
                    onClick={() => handleSelect(`/types/${type}`)}
                    className="focus:outline-none"
                  >
                    <TypeBadge type={type} size="md" asLink={false} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pokémon Matches */}
          {pokemonResults.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                Pokémon ({pokemonResults.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pokemonResults.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(`/pokemon/${p.id}`)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/40 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <img
                      src={p.sprite}
                      alt={p.name}
                      className="w-12 h-12 object-contain bg-slate-900/60 rounded-lg p-1"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-100 truncate">{p.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">#{String(p.id).padStart(3, '0')}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {p.types.map(t => (
                          <TypeBadge key={t} type={t} size="xs" asLink={false} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Move Matches */}
          {moveResults.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Swords className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Moves ({moveResults.length})
              </div>
              <div className="space-y-1.5">
                {moveResults.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleSelect(`/moves/${m.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <TypeBadge type={m.type} size="xs" asLink={false} />
                      <span className="font-medium text-sm text-slate-100">{m.displayName}</span>
                      <CategoryBadge category={m.category} size="sm" showIcon={false} />
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {m.power ? `PWR ${m.power}` : '—'} • {m.accuracy ? `${m.accuracy}%` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ability Matches */}
          {abilityResults.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Abilities ({abilityResults.length})
              </div>
              <div className="space-y-1.5">
                {abilityResults.map(a => (
                  <div
                    key={a.id}
                    onClick={() => handleSelect(`/abilities/${a.id}`)}
                    className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/40 cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-sm text-slate-100">{a.displayName}</div>
                    <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{a.shortDescription}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/60 bg-darkbg-900/60 text-xs text-slate-400 flex items-center justify-between">
          <span className="text-[11px]">Navigate using mouse or click any item</span>
          <span className="text-[11px] font-mono">PokéDex Pro Search</span>
        </div>
      </div>
    </div>
  );
};
