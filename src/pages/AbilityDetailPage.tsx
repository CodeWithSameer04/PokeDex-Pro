import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocalAbility, getLocalPokemonList } from '../utils/pokeapi';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { Sparkles, Shield, Zap, Info, BookOpen, Swords } from 'lucide-react';

export const AbilityDetailPage: React.FC = () => {
  const { idOrName } = useParams<{ idOrName: string }>();
  const ability = getLocalAbility(idOrName || '1');
  const allPokemon = useMemo(() => getLocalPokemonList(), []);

  // Find all Pokémon that possess this ability (standard or hidden)
  const matchingPokemon = useMemo(() => {
    if (!ability) return [];
    const query = ability.displayName.toLowerCase();
    return allPokemon.filter(p =>
      p.abilities.some(a => a.name.toLowerCase() === query)
    );
  }, [allPokemon, ability]);

  if (!ability) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Ability Not Found</h2>
        <p className="text-slate-400">The ability requested could not be located in the database.</p>
        <Link to="/abilities" className="inline-block px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold">
          View All Abilities
        </Link>
      </div>
    );
  }

  // Check special battle interactions
  const isImmunityAbility = [
    'levitate',
    'flash fire',
    'volt absorb',
    'water absorb',
    'dry skin',
    'sap sipper',
    'motor drive',
    'lightning rod',
    'storm drain',
    'earth eater',
    'well-baked body',
    'wonder guard',
  ].includes(ability.name.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      <Breadcrumbs
        items={[
          { label: 'Abilities', path: '/abilities' },
          { label: ability.displayName },
        ]}
      />

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
            Introduced in Gen {ability.generation}
          </span>
          {isImmunityAbility && (
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2.5 py-1 rounded-full">
              Type Immunity Trait
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">{ability.displayName}</h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          {ability.effectDescription || ability.shortDescription}
        </p>
      </div>

      {/* Technical In-Battle Mechanics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-3">
          <h3 className="font-bold text-base text-white flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-emerald-400" />
            Competitive Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {ability.shortDescription}
          </p>
        </div>

        <div className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-3">
          <h3 className="font-bold text-base text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            Battle Modifiers & Type Synergies
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isImmunityAbility
              ? `${ability.displayName} nullifies or modifies specific incoming elemental moves. This ability is fully factored into our Interactive Type Calculator and Move Effectiveness Checker!`
              : `Operates during combat phases without directly nullifying elemental typings. Interacts with stat stages, entry hazards, contact flags, or weather states.`}
          </p>
        </div>
      </div>

      {/* Pokémon with this Ability */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Pokémon with {ability.displayName} ({matchingPokemon.length})
          </h2>
          <span className="text-xs font-mono text-slate-400">Regular and Hidden Trait</span>
        </div>

        {matchingPokemon.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {matchingPokemon.map(p => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-darkbg-800/50 border border-slate-800 text-center text-slate-400 text-xs">
            Signature trait or non-standard distribution in main species tables.
          </div>
        )}
      </section>
    </div>
  );
};
