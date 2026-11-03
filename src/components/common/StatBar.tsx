import React from 'react';
import { calculateStatAtLevel100 } from '../../utils/battleFormulas';

interface StatBarProps {
  label: string;
  value: number;
  isHP?: boolean;
  showCalculatedRange?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  isHP = false,
  showCalculatedRange = true,
}) => {
  const maxPossible = 255;
  const percentage = Math.min(100, Math.round((value / maxPossible) * 100));

  // Color tiering
  let barColor = 'bg-red-500';
  let badgeColor = 'text-red-400 bg-red-500/10';
  let ratingText = 'Low';

  if (value >= 140) {
    barColor = 'bg-gradient-to-r from-purple-500 to-indigo-500';
    badgeColor = 'text-purple-400 bg-purple-500/10';
    ratingText = 'Godly';
  } else if (value >= 110) {
    barColor = 'bg-cyan-500';
    badgeColor = 'text-cyan-400 bg-cyan-500/10';
    ratingText = 'Great';
  } else if (value >= 80) {
    barColor = 'bg-emerald-500';
    badgeColor = 'text-emerald-400 bg-emerald-500/10';
    ratingText = 'Good';
  } else if (value >= 50) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-400 bg-amber-500/10';
    ratingText = 'Average';
  }

  // Level 100 calculations: Min (0 IVs, 0 EVs, Hindering Nature 0.9) vs Max (31 IVs, 252 EVs, Positive Nature 1.1)
  const minStat = isHP
    ? calculateStatAtLevel100(value, true, 0, 0, 1.0)
    : calculateStatAtLevel100(value, false, 0, 0, 0.9);

  const maxStat = isHP
    ? calculateStatAtLevel100(value, true, 31, 252, 1.0)
    : calculateStatAtLevel100(value, false, 31, 252, 1.1);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300 w-16">{label}</span>
          <span className="font-bold text-slate-100 text-sm w-10 text-right">{value}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${badgeColor}`}>
            {ratingText}
          </span>
        </div>

        {showCalculatedRange && (
          <span className="text-[11px] text-slate-400 font-mono">
            Lv. 100: <span className="text-slate-300 font-medium">{minStat}</span> – <span className="text-slate-200 font-medium">{maxStat}</span>
          </span>
        )}
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${Math.max(6, percentage)}%` }}
        />
      </div>
    </div>
  );
};
