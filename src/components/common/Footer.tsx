import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Database, ShieldCheck, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-darkbg-900/90 text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full border border-red-500 overflow-hidden">
                <div className="w-full h-1/2 bg-red-600" />
                <div className="w-full h-1/2 bg-white" />
              </div>
              <span className="font-bold text-slate-200 text-sm tracking-wide">POKÉDEX PRO</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Complete Pokémon knowledge & battle platform covering main-series Generations 1 through 9. Powered by open data and modern battle engines.
            </p>
          </div>

          {/* Col 2: Encyclopedia */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Database</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/pokedex" className="hover:text-red-400 transition-colors">
                  Complete Pokédex (1-1025)
                </Link>
              </li>
              <li>
                <Link to="/types" className="hover:text-red-400 transition-colors">
                  18 Elemental Types
                </Link>
              </li>
              <li>
                <Link to="/moves" className="hover:text-red-400 transition-colors">
                  Moves Database (900+)
                </Link>
              </li>
              <li>
                <Link to="/abilities" className="hover:text-red-400 transition-colors">
                  Abilities Database (300+)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Battle Tools & Learning */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Battle Tools & Training</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/calculator" className="hover:text-red-400 transition-colors">
                  Type Matchup Calculator
                </Link>
              </li>
              <li>
                <Link to="/move-checker" className="hover:text-red-400 transition-colors">
                  Move Effectiveness Checker
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-red-400 transition-colors">
                  Beginner Learning Center
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-red-400 transition-colors">
                  Type Effectiveness Quiz
                </Link>
              </li>
              <li>
                <Link to="/battle-guide" className="hover:text-red-400 transition-colors">
                  Competitive Battle Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Data Sources & Attribution */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">Data & Credits</h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://pokeapi.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-red-400 transition-colors"
                >
                  <Database className="w-3.5 h-3.5 mr-1" />
                  PokéAPI REST v2
                  <ExternalLink className="w-3 h-3 ml-1 text-slate-500" />
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-400 transition-colors">
                  About & Methodology
                </Link>
              </li>
              <li>
                <span className="text-slate-500 text-[11px] block mt-2">
                  Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and Game Freak.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <div>
            Built with precision for Pokémon trainers, casual explorers, and competitive battlers.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Generations 1–9 Supported</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
