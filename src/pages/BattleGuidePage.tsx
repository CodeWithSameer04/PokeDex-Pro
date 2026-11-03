import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BookMarked, Swords, Shield, CloudSun, Zap, Award, Layers } from 'lucide-react';

export const BattleGuidePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Battle Guide' }]} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
          <BookMarked className="w-4 h-4" />
          Competitive Reference
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Competitive Battle Guide
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
          The comprehensive mathematical manual for Pokémon battling. Master the damage formula, stat stages, weather synergies, entry hazards, and advanced metagame mechanics.
        </p>
      </div>

      {/* SECTION 1: THE FULL DAMAGE FORMULA */}
      <section className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <Swords className="w-5 h-5 mr-2 text-red-400" />
          1. The Complete Main-Series Damage Formula
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Damage in Pokémon is calculated through a structured integer mathematical pipeline. Type effectiveness is multiplied into the formula alongside several other modifiers:
        </p>

        <div className="p-4 rounded-2xl bg-darkbg-900 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
          <code>
            Damage = ⌊⌊⌊⌊(2 × Level / 5 + 2) × BasePower × (A / D)⌋ / 50 + 2⌋ × Targets × Weather × Critical × Random(0.85 – 1.0) × STAB × TypeEffectiveness × Burn × Other⌋
          </code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-white block font-mono">A / D (Attack vs Defense Ratio)</strong>
            <p className="text-slate-400">
              For Physical moves, uses the attacker’s Attack and defender’s Defense. For Special moves, uses Special Attack and Special Defense.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <strong className="text-white block font-mono">Random Variance (0.85 to 1.00)</strong>
            <p className="text-slate-400">
              Damage has a 16-step random multiplier from 85% to 100%, meaning even identical moves on the same Pokémon can roll slightly different damage numbers.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: STAT STAGES (-6 TO +6) */}
      <section className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          2. Stat Modification Stages (-6 to +6)
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Moves like Swords Dance (+2 Atk), Dragon Dance (+1 Atk, +1 Spe), or Intimidate (-1 Atk) alter stats by stages:
        </p>

        <div className="overflow-x-auto border border-slate-700/60 rounded-2xl">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-darkbg-900 text-slate-400 font-mono">
                <th className="p-2.5 border-b border-slate-800">Stage</th>
                <th className="p-2.5 border-b border-slate-800">-6</th>
                <th className="p-2.5 border-b border-slate-800">-5</th>
                <th className="p-2.5 border-b border-slate-800">-4</th>
                <th className="p-2.5 border-b border-slate-800">-3</th>
                <th className="p-2.5 border-b border-slate-800">-2</th>
                <th className="p-2.5 border-b border-slate-800">-1</th>
                <th className="p-2.5 border-b border-slate-800 text-white font-bold">0</th>
                <th className="p-2.5 border-b border-slate-800">+1</th>
                <th className="p-2.5 border-b border-slate-800">+2</th>
                <th className="p-2.5 border-b border-slate-800">+3</th>
                <th className="p-2.5 border-b border-slate-800">+4</th>
                <th className="p-2.5 border-b border-slate-800">+5</th>
                <th className="p-2.5 border-b border-slate-800">+6</th>
              </tr>
            </thead>
            <tbody className="font-mono text-slate-300">
              <tr>
                <td className="p-2.5 border-b border-slate-800 font-bold bg-darkbg-900/60">Stat Multiplier</td>
                <td className="p-2.5 border-b border-slate-800 text-red-400">0.25×</td>
                <td className="p-2.5 border-b border-slate-800 text-red-400">0.28×</td>
                <td className="p-2.5 border-b border-slate-800 text-red-400">0.33×</td>
                <td className="p-2.5 border-b border-slate-800 text-red-400">0.40×</td>
                <td className="p-2.5 border-b border-slate-800 text-red-400">0.50×</td>
                <td className="p-2.5 border-b border-slate-800 text-red-400">0.67×</td>
                <td className="p-2.5 border-b border-slate-800 font-bold text-white">1.0×</td>
                <td className="p-2.5 border-b border-slate-800 text-emerald-400">1.5×</td>
                <td className="p-2.5 border-b border-slate-800 text-emerald-400">2.0×</td>
                <td className="p-2.5 border-b border-slate-800 text-emerald-400">2.5×</td>
                <td className="p-2.5 border-b border-slate-800 text-emerald-400">3.0×</td>
                <td className="p-2.5 border-b border-slate-800 text-emerald-400">3.5×</td>
                <td className="p-2.5 border-b border-slate-800 text-emerald-400 font-bold">4.0×</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: WEATHER & TERRAIN */}
      <section className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <CloudSun className="w-5 h-5 mr-2 text-amber-400" />
          3. Weather Field Effects
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-darkbg-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-orange-400">Harsh Sunlight</h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Fire moves deal <strong>1.5× damage</strong>.</li>
              <li>Water moves deal <strong>0.5× damage</strong>.</li>
              <li>Solar Beam & Solar Blade charge in 1 turn.</li>
              <li>Thunder & Hurricane accuracy drops to 50%.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-darkbg-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-blue-400">Rain</h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Water moves deal <strong>1.5× damage</strong>.</li>
              <li>Fire moves deal <strong>0.5× damage</strong>.</li>
              <li>Thunder & Hurricane have <strong>100% accuracy</strong>.</li>
              <li>Solar Beam & Solar Blade power is cut in half.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-darkbg-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-yellow-400">Sandstorm</h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Rock-type Pokémon receive a <strong>+50% Special Defense boost</strong>.</li>
              <li>Non-Rock, Ground, or Steel Pokémon lose 1/16th HP per turn.</li>
              <li>Solar Beam power is cut in half.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-darkbg-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-cyan-400">Snow (Generation 9)</h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Ice-type Pokémon receive a <strong>+50% Defense boost</strong>.</li>
              <li>Blizzard has <strong>100% accuracy</strong>.</li>
              <li>Aurora Veil can be set up to halve incoming damage.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: ENTRY HAZARDS */}
      <section className="bg-darkbg-800/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <Shield className="w-5 h-5 mr-2 text-emerald-400" />
          4. Entry Hazards & Stealth Rock Scaling
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed">
          Stealth Rock is a Rock-type hazard that inflicts damage scaled directly to the switch-in Pokémon&apos;s vulnerability to Rock:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800">
            <span className="text-[10px] text-slate-400 block uppercase">¼× Rock Resisted</span>
            <span className="text-base font-bold text-white">3.125% HP</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800">
            <span className="text-[10px] text-slate-400 block uppercase">½× Rock Resisted</span>
            <span className="text-base font-bold text-white">6.25% HP</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">1× Rock Neutral</span>
            <span className="text-base font-bold text-white">12.5% HP</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800">
            <span className="text-[10px] text-slate-400 block uppercase">2× Rock Weak</span>
            <span className="text-base font-bold text-white">25.0% HP</span>
          </div>
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800">
            <span className="text-[10px] text-slate-400 block uppercase">4× Rock Weak</span>
            <span className="text-base font-bold text-red-400">50.0% HP</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 italic">
          (e.g., Charizard or Volcarona lose half their maximum HP the moment they enter battle if Stealth Rock is present!)
        </p>
      </section>
    </div>
  );
};
