import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PokemonSummary } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { TYPE_COLORS } from '../../data/typesData';

interface PokemonCardProps {
  pokemon: PokemonSummary & { slug?: string };
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [imgError, setImgError] = useState(false);
  const primaryType = pokemon.types[0] || 'normal';
  const typeConfig = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-darkbg-800/80 hover:bg-darkbg-700/80 border border-slate-700/50 hover:border-slate-500/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
    >
      {/* Background radial glow based on primary type */}
      <div
        className="absolute -right-12 -top-12 w-36 h-36 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity pointer-events-none"
        style={{ backgroundColor: typeConfig.bg }}
      />

      {/* Top Header: Dex # and Gen */}
      <div className="flex items-center justify-between text-xs mb-2 z-10">
        <span className="font-mono font-bold text-slate-400 group-hover:text-slate-200">
          #{String(pokemon.id).padStart(3, '0')}
        </span>
        <div className="flex items-center gap-1">
          {pokemon.isLegendary && (
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Legend
            </span>
          )}
          {pokemon.isMythical && (
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Mythic
            </span>
          )}
          <span className="text-[10px] font-medium text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
            Gen {pokemon.generation}
          </span>
        </div>
      </div>

      {/* Official Artwork / Sprite */}
      <div className="relative py-4 flex items-center justify-center min-h-[140px] z-10">
        <img
          src={imgError ? pokemon.sprite : pokemon.artwork}
          alt={pokemon.name}
          onError={() => setImgError(true)}
          className="w-32 h-32 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md select-none"
          loading="lazy"
        />
      </div>

      {/* Name and Types */}
      <div className="z-10 mt-1">
        <h3 className="font-bold text-base text-slate-100 group-hover:text-white truncate">
          {pokemon.name}
        </h3>
        <p className="text-[11px] text-slate-400 truncate mb-2">{pokemon.species}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {pokemon.types.map(t => (
            <TypeBadge key={t} type={t} size="xs" asLink={false} />
          ))}
        </div>

        {/* Base Stat Preview Pill */}
        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>BST: <strong className="text-slate-200">{pokemon.stats.total}</strong></span>
          <span className="text-slate-500">
            Spe: <span className="text-slate-300">{pokemon.stats.speed}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};
