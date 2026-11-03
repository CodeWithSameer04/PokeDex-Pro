import React from 'react';
import { Link } from 'react-router-dom';
import { MoveData } from '../../types/pokemon';
import { TypeBadge } from '../common/TypeBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { Shield, Volume2, Hand, Flame, Heart } from 'lucide-react';

interface MoveCardProps {
  move: MoveData;
}

export const MoveCard: React.FC<MoveCardProps> = ({ move }) => {
  return (
    <Link
      to={`/moves/${move.id}`}
      className="group flex flex-col justify-between p-4 rounded-2xl bg-darkbg-800/80 hover:bg-darkbg-700/80 border border-slate-700/50 hover:border-slate-500/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div>
        {/* Header: Type, Category, Gen */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TypeBadge type={move.type} size="xs" asLink={false} />
            <CategoryBadge category={move.category} size="sm" showIcon={false} />
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            Gen {move.generation}
          </span>
        </div>

        {/* Move Name */}
        <h3 className="font-bold text-base text-slate-100 group-hover:text-red-400 transition-colors">
          {move.displayName}
        </h3>

        {/* Short Effect */}
        <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-3 min-h-[32px]">
          {move.shortDescription || 'No additional effect.'}
        </p>
      </div>

      <div>
        {/* Flags tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {move.flags.contact && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60" title="Makes contact">
              Contact
            </span>
          )}
          {move.flags.protect && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60" title="Blocked by Protect">
              Protect
            </span>
          )}
          {move.flags.sound && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/50" title="Sound-based">
              Sound
            </span>
          )}
          {move.flags.punch && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-700/50" title="Punching move">
              Punch
            </span>
          )}
          {move.flags.bite && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/50" title="Biting move">
              Bite
            </span>
          )}
        </div>

        {/* Stats footer: Power, Acc, PP */}
        <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs font-mono text-slate-300">
          <div>
            <span className="text-[10px] text-slate-500 uppercase mr-1">PWR</span>
            <span className="font-bold">{move.power !== null ? move.power : '—'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase mr-1">ACC</span>
            <span className="font-bold">{move.accuracy !== null ? `${move.accuracy}%` : '—'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase mr-1">PP</span>
            <span className="font-bold">{move.pp}</span>
          </div>
          {move.priority !== 0 && (
            <div className={move.priority > 0 ? 'text-emerald-400' : 'text-red-400'}>
              <span className="text-[10px] text-slate-500 uppercase mr-1">PRI</span>
              <span className="font-bold">{move.priority > 0 ? `+${move.priority}` : move.priority}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
