import React, { useState, useMemo } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { QuizQuestion } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';

export const InteractiveQuiz: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Filter and shuffle questions
  const questions: QuizQuestion[] = useMemo(() => {
    let pool = QUIZ_QUESTIONS;
    if (difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }
    // Shuffle
    return [...pool].sort(() => Math.random() - 0.5);
  }, [difficulty]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsQuizComplete(false);
  };

  const percentage = Math.round((score / questions.length) * 100) || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-darkbg-800/80 border border-slate-700/60 rounded-2xl p-4">
        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-400 mr-1.5">Difficulty:</span>
          {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                handleRestart();
              }}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                difficulty === d
                  ? 'bg-red-500 text-white shadow-glow-fire font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Score & Streak Counters */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center gap-1 text-slate-300">
            <Target className="w-3.5 h-3.5 text-red-400" />
            <span>Score: <strong className="text-white">{score}</strong>/{questions.length}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Streak: <strong className="text-white">{streak}</strong> 🔥</span>
          </div>
        </div>
      </div>

      {/* QUIZ COMPLETION SCREEN */}
      {isQuizComplete ? (
        <div className="bg-darkbg-800 border border-slate-700/80 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-glow-fire">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Quiz Completed!</h2>
            <p className="text-slate-400 text-sm mt-1">Here is how well you mastered Pokémon battle matchups:</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-2xl font-black text-white">{score}/{questions.length}</span>
              <span className="block text-[11px] text-slate-400 uppercase mt-1">Total Score</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-2xl font-black text-amber-400">{percentage}%</span>
              <span className="block text-[11px] text-slate-400 uppercase mt-1">Accuracy</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-2xl font-black text-yellow-400">{bestStreak} 🔥</span>
              <span className="block text-[11px] text-slate-400 uppercase mt-1">Best Streak</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm font-medium">
            {percentage >= 90
              ? '🏆 Master Trainer Rank! Your knowledge of Pokémon typing and battle mechanics is elite.'
              : percentage >= 70
              ? '🌟 Ace Trainer! You have strong grasp of battle advantages and dual-type matchups.'
              : '⚡ Rising Challenger! Practice more in the Learning Center and Type Calculator to sharpen your edge.'}
          </p>

          <button
            onClick={handleRestart}
            className="inline-flex items-center px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-glow-fire"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </button>
        </div>
      ) : (
        /* ACTIVE QUESTION CARD */
        <div className="bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                {currentQ.difficulty}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQ.question}
            </h3>
            {currentQ.types && currentQ.types.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentQ.types.map(t => (
                  <TypeBadge key={t} type={t} size="xs" asLink={false} />
                ))}
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map(opt => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === currentQ.correctAnswer;

              let btnClass = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-md';
                } else if (isSelected) {
                  btnClass = 'bg-red-950/80 border-red-500 text-red-200 font-bold shadow-md';
                } else {
                  btnClass = 'opacity-50 bg-slate-800/50 border-slate-700/50 text-slate-400';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-sm text-left flex items-center justify-between transition-all select-none ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box After Answering */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-darkbg-900 border border-slate-700/80 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                {selectedOption === currentQ.correctAnswer ? (
                  <span className="flex items-center text-emerald-400 font-bold text-sm">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Correct!
                  </span>
                ) : (
                  <span className="flex items-center text-red-400 font-bold text-sm">
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Incorrect
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-100 block mb-0.5">Explanation:</strong>
                {currentQ.explanation}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-glow-fire"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
