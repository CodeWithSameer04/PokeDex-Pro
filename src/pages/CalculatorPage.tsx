import React from 'react';
import { TypeCalculator } from '../components/calculator/TypeCalculator';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Calculator, ShieldAlert, Sparkles } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'Type Calculator' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
          <Calculator className="w-4 h-4" />
          Battle Analysis Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Type Effectiveness Calculator
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Instantly calculate attack damage multipliers against single or dual-type defenders. Includes ability modifiers (Levitate, Wonder Guard, Flash Fire) and full defensive vulnerability profiling.
        </p>
      </div>

      {/* Calculator Body */}
      <TypeCalculator />
    </div>
  );
};
