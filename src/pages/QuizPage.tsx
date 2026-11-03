import React from 'react';
import { InteractiveQuiz } from '../components/quiz/InteractiveQuiz';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Gamepad2, Award, Zap } from 'lucide-react';

export const QuizPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'Battle Quiz' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
          <Gamepad2 className="w-4 h-4" />
          Interactive Trainer Evaluation
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Pokémon Battle Quiz
        </h1>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">
          Put your battle instincts to the test! Answer randomized questions across Easy, Medium, and Hard difficulties covering dual-type matchups, immunities, and damage multipliers.
        </p>
      </div>

      <InteractiveQuiz />
    </div>
  );
};
