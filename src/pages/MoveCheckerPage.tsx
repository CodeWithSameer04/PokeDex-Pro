import React from 'react';
import { MoveEffectivenessChecker } from '../components/checker/MoveEffectivenessChecker';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Crosshair, Swords, Zap } from 'lucide-react';

export const MoveCheckerPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'Move Checker' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
          <Crosshair className="w-4 h-4" />
          Direct Matchup Simulator
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Move Effectiveness Checker
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Simulate an exact move attack between an attacking Pokémon and a defending Pokémon. Computes STAB (Same-Type Attack Bonus), type effectiveness against dual typings, and ability interactions.
        </p>
      </div>

      <MoveEffectivenessChecker />
    </div>
  );
};
