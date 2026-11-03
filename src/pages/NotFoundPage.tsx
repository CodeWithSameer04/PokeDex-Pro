import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Home, Compass, HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-8">
      <Breadcrumbs items={[{ label: '404 Not Found' }]} />

      <div className="bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative Pokéball graphic */}
        <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-red-500/80 overflow-hidden relative shadow-glow-fire mb-6 animate-pulse">
          <div className="w-full h-1/2 bg-red-600/90" />
          <div className="w-full h-1/2 bg-slate-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 border-4 border-slate-200 rounded-full flex items-center justify-center">
              <span className="text-white font-mono font-black text-xs sm:text-sm">?</span>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          Error 404
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="max-w-md mx-auto text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
          Looks like you ventured into tall grass where no wild Pokémon or pages exist! The route you followed could not be found.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors shadow-lg shadow-red-600/30"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/pokedex"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-colors"
          >
            <Compass className="w-4 h-4 text-red-400" />
            Explore Pokédex
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">
            Popular Destinations
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link to="/types" className="px-3 py-1.5 rounded-lg bg-darkbg-900/60 hover:bg-slate-700 text-slate-300 border border-slate-800 transition-colors">
              Types Explorer
            </Link>
            <Link to="/moves" className="px-3 py-1.5 rounded-lg bg-darkbg-900/60 hover:bg-slate-700 text-slate-300 border border-slate-800 transition-colors">
              Moves Database
            </Link>
            <Link to="/abilities" className="px-3 py-1.5 rounded-lg bg-darkbg-900/60 hover:bg-slate-700 text-slate-300 border border-slate-800 transition-colors">
              Abilities
            </Link>
            <Link to="/calculator" className="px-3 py-1.5 rounded-lg bg-darkbg-900/60 hover:bg-slate-700 text-slate-300 border border-slate-800 transition-colors">
              Matchup Calculator
            </Link>
            <Link to="/quiz" className="px-3 py-1.5 rounded-lg bg-darkbg-900/60 hover:bg-slate-700 text-slate-300 border border-slate-800 transition-colors">
              Battle Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
