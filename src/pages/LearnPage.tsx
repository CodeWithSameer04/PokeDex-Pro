import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEARNING_TOPICS, LearningTopic } from '../data/learningData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  GraduationCap,
  Layers,
  Zap,
  Shield,
  Sword,
  Flame,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const LearnPage: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(LEARNING_TOPICS[0].id);
  const [showAdvanced, setShowAdvanced] = useState<Record<string, boolean>>({});

  const toggleAdvanced = (id: string) => {
    setShowAdvanced(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentTopic = LEARNING_TOPICS.find(t => t.id === selectedTopicId) || LEARNING_TOPICS[0];

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Sword': return <Sword className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4" />;
      default: return <GraduationCap className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      <Breadcrumbs items={[{ label: 'Beginner Learning Center' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
          <GraduationCap className="w-4 h-4" />
          Pokémon Academy
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Beginner Learning Center
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
          Welcome new Trainer! Step-by-step interactive lessons explaining Pokémon types, battle advantages, STAB bonuses, accuracy, and core battle rules.
        </p>
      </div>

      {/* Main Learning Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
            Lessons & Topics
          </span>
          <div className="space-y-1">
            {LEARNING_TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs font-semibold transition-all ${
                  selectedTopicId === topic.id
                    ? 'bg-red-600 text-white shadow-glow-fire font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getTopicIcon(topic.icon)}
                  <span className="truncate">{topic.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Lesson Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-gradient-to-br from-darkbg-800 to-darkbg-700 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            {/* Title & Beginner Summary */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Lesson Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentTopic.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
                {currentTopic.beginnerSummary}
              </p>
            </div>

            {/* Beginner Key Points */}
            <div className="p-5 rounded-2xl bg-darkbg-900/80 border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Key Beginner Points:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {currentTopic.beginnerDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Real-World Example Box */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/70 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Battle Example: {currentTopic.example.title}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentTopic.example.description}
              </p>

              {currentTopic.example.result && (
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
                  <span>
                    Attacker: <strong className="text-slate-200">{currentTopic.example.attacker}</strong>
                  </span>
                  <span>
                    Outcome: <strong className="text-emerald-400">{currentTopic.example.result}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Optional Advanced Explanation Accordion */}
            <div className="pt-2">
              <button
                onClick={() => toggleAdvanced(currentTopic.id)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  {showAdvanced[currentTopic.id]
                    ? 'Hide Deep Technical Mechanics'
                    : 'Show Deep Technical Mechanics (Advanced Trainers)'}
                </span>
                {showAdvanced[currentTopic.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showAdvanced[currentTopic.id] && (
                <div className="p-5 mt-2 rounded-2xl bg-darkbg-900 border border-slate-800 space-y-3 text-xs sm:text-sm text-slate-300 animate-in fade-in duration-200">
                  <p className="font-semibold text-slate-200 leading-relaxed">
                    {currentTopic.advancedSummary}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                    {currentTopic.advancedDetails.map((det, i) => (
                      <li key={i}>{det}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action link */}
            <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] italic">{currentTopic.interactiveTip}</span>
              <Link
                to="/quiz"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-glow-fire"
              >
                <span>Test Knowledge in Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
