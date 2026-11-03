import { PokemonType, TypeMatchupSummary } from '../types/pokemon';
import { ALL_POKEMON_TYPES, TYPES_DATA } from '../data/typesData';

/**
 * Calculates single-type effectiveness multiplier (Attacking type vs Defending type)
 */
export function getTypeEffectiveness(
  attackType: PokemonType,
  defendType: PokemonType,
  gen: number = 9
): number {
  // Generation 1 Quirks
  if (gen === 1) {
    // Dark, Steel, Fairy didn't exist
    if (
      ['dark', 'steel', 'fairy'].includes(attackType) ||
      ['dark', 'steel', 'fairy'].includes(defendType)
    ) {
      return 1;
    }
    // Bug & Poison mutual 2x in Gen 1
    if (attackType === 'bug' && defendType === 'poison') return 2;
    if (attackType === 'poison' && defendType === 'bug') return 2;
    // Ghost had 0 effect on Psychic in Gen 1 due to a known programming bug
    if (attackType === 'ghost' && defendType === 'psychic') return 0;
    // Ice was neutral against Fire in Gen 1
    if (attackType === 'ice' && defendType === 'fire') return 1;
  }

  // Generation 2 to 5 Quirks
  if (gen >= 2 && gen <= 5) {
    // Fairy didn't exist
    if (attackType === 'fairy' || defendType === 'fairy') return 1;
    // Steel resisted Dark and Ghost prior to Gen 6
    if (defendType === 'steel' && (attackType === 'dark' || attackType === 'ghost')) {
      return 0.5;
    }
  }

  const attackData = TYPES_DATA[attackType];
  if (!attackData) return 1;

  if (attackData.damageRelations.noDamageTo.includes(defendType)) {
    return 0;
  }
  if (attackData.damageRelations.doubleDamageTo.includes(defendType)) {
    return 2;
  }
  if (attackData.damageRelations.halfDamageTo.includes(defendType)) {
    return 0.5;
  }

  return 1;
}

export interface DualTypeResult {
  multiplier: number;
  breakdown: string;
  individual: { type: PokemonType; multiplier: number }[];
  abilityEffect?: string;
  isImmuneByAbility?: boolean;
}

/**
 * Calculates the combined damage multiplier programmatically for single or dual-type defenders
 */
export function calculateDualTypeEffectiveness(
  attackType: PokemonType,
  defendingTypes: PokemonType[],
  options?: {
    ability?: string;
    gen?: number;
  }
): DualTypeResult {
  const gen = options?.gen ?? 9;
  const ability = options?.ability?.toLowerCase().trim();

  // Remove duplicates and invalid types
  const types = Array.from(new Set(defendingTypes.filter(Boolean)));

  if (types.length === 0) {
    return {
      multiplier: 1,
      breakdown: 'No defending types specified. Defaults to 1× neutral.',
      individual: [],
    };
  }

  const individual: { type: PokemonType; multiplier: number }[] = [];
  let rawMultiplier = 1;

  for (const defType of types) {
    const eff = getTypeEffectiveness(attackType, defType, gen);
    individual.push({ type: defType, multiplier: eff });
    rawMultiplier *= eff;
  }

  let finalMultiplier = rawMultiplier;
  let abilityEffect: string | undefined;
  let isImmuneByAbility = false;

  // Ability modifiers
  if (ability) {
    if (ability === 'levitate' && attackType === 'ground') {
      finalMultiplier = 0;
      abilityEffect = 'Levitate makes the Pokémon immune to Ground-type attacks.';
      isImmuneByAbility = true;
    } else if (
      (ability === 'flash fire' || ability === 'well-baked body') &&
      attackType === 'fire'
    ) {
      finalMultiplier = 0;
      abilityEffect = `${ability === 'flash fire' ? 'Flash Fire' : 'Well-Baked Body'} absorbs Fire attacks for immunity!`;
      isImmuneByAbility = true;
    } else if (
      (ability === 'volt absorb' || ability === 'motor drive' || ability === 'lightning rod') &&
      attackType === 'electric'
    ) {
      finalMultiplier = 0;
      abilityEffect = `${ability.toUpperCase()} nullifies Electric attacks completely.`;
      isImmuneByAbility = true;
    } else if (
      (ability === 'water absorb' || ability === 'storm drain' || ability === 'dry skin') &&
      attackType === 'water'
    ) {
      finalMultiplier = 0;
      abilityEffect = `${ability.toUpperCase()} nullifies Water attacks completely.`;
      isImmuneByAbility = true;
    } else if (ability === 'dry skin' && attackType === 'fire') {
      finalMultiplier *= 1.25;
      abilityEffect = 'Dry Skin increases damage taken from Fire-type moves by 25%.';
    } else if (ability === 'sap sipper' && attackType === 'grass') {
      finalMultiplier = 0;
      abilityEffect = 'Sap Sipper grants full immunity to Grass-type moves and boosts Attack.';
      isImmuneByAbility = true;
    } else if (ability === 'earth eater' && attackType === 'ground') {
      finalMultiplier = 0;
      abilityEffect = 'Earth Eater absorbs Ground moves to restore HP.';
      isImmuneByAbility = true;
    } else if (ability === 'thick fat' && (attackType === 'fire' || attackType === 'ice')) {
      finalMultiplier *= 0.5;
      abilityEffect = `Thick Fat halves damage from ${attackType.toUpperCase()} attacks.`;
    } else if (ability === 'wonder guard') {
      // Wonder Guard: Shedinja only takes damage from Super Effective attacks (> 1x)
      if (rawMultiplier <= 1) {
        finalMultiplier = 0;
        abilityEffect = 'Wonder Guard negates all attacks that are not super effective!';
        isImmuneByAbility = true;
      } else {
        abilityEffect = 'Wonder Guard: Attack is Super Effective and bypasses Wonder Guard!';
      }
    }
  }

  // Create human-friendly explanation breakdown
  let breakdown = '';
  if (individual.length === 1) {
    const t = individual[0];
    breakdown = `${capitalize(attackType)} deals ${t.multiplier}× damage against ${capitalize(t.type)}.`;
  } else if (individual.length === 2) {
    const [t1, t2] = individual;
    breakdown = `${capitalize(attackType)} deals ${t1.multiplier}× against ${capitalize(t1.type)} and ${t2.multiplier}× against ${capitalize(t2.type)} → Combined: ${rawMultiplier}× damage.`;
  }

  if (abilityEffect) {
    breakdown += ` [Ability Check: ${abilityEffect}]`;
  }

  return {
    multiplier: finalMultiplier,
    breakdown,
    individual,
    abilityEffect,
    isImmuneByAbility,
  };
}

/**
 * Computes the full 18-type defensive profile for any Pokémon single/dual type combination
 */
export function getDefensiveProfile(
  defendingTypes: PokemonType[],
  options?: {
    ability?: string;
    gen?: number;
  }
): TypeMatchupSummary {
  const summary: TypeMatchupSummary = {
    quadrupleDamageFrom: [],
    doubleDamageFrom: [],
    normalDamageFrom: [],
    halfDamageFrom: [],
    quarterDamageFrom: [],
    noDamageFrom: [],
  };

  const gen = options?.gen ?? 9;
  const availableTypes = gen === 1 
    ? ALL_POKEMON_TYPES.filter(t => !['dark', 'steel', 'fairy'].includes(t))
    : gen <= 5
    ? ALL_POKEMON_TYPES.filter(t => t !== 'fairy')
    : ALL_POKEMON_TYPES;

  for (const attackType of availableTypes) {
    const result = calculateDualTypeEffectiveness(attackType, defendingTypes, options);
    const m = result.multiplier;

    if (m === 0) {
      summary.noDamageFrom.push(attackType);
    } else if (m >= 4) {
      summary.quadrupleDamageFrom.push(attackType);
    } else if (m >= 2) {
      summary.doubleDamageFrom.push(attackType);
    } else if (m === 1) {
      summary.normalDamageFrom.push(attackType);
    } else if (m >= 0.5) {
      summary.halfDamageFrom.push(attackType);
    } else if (m <= 0.25) {
      summary.quarterDamageFrom.push(attackType);
    }
  }

  return summary;
}

/**
 * Formats multiplier to a readable string (e.g. 4×, 2×, ½×, ¼×, 0×)
 */
export function formatMultiplier(multiplier: number): string {
  if (multiplier === 0) return '0×';
  if (multiplier === 0.25) return '¼×';
  if (multiplier === 0.5) return '½×';
  if (multiplier === 1) return '1×';
  if (multiplier === 2) return '2×';
  if (multiplier === 4) return '4×';
  return `${multiplier}×`;
}

export function getEffectivenessLabel(multiplier: number): {
  label: string;
  badgeClass: string;
  colorClass: string;
} {
  if (multiplier === 0) {
    return {
      label: 'No Effect (Immune)',
      badgeClass: 'bg-slate-700 text-slate-200 border-slate-600',
      colorClass: 'text-slate-400',
    };
  }
  if (multiplier >= 4) {
    return {
      label: 'Extremely Effective (4×)',
      badgeClass: 'bg-red-950 text-red-200 border-red-500 font-bold',
      colorClass: 'text-red-400',
    };
  }
  if (multiplier >= 2) {
    return {
      label: 'Super Effective (2×)',
      badgeClass: 'bg-amber-950 text-amber-200 border-amber-500',
      colorClass: 'text-amber-400',
    };
  }
  if (multiplier === 1) {
    return {
      label: 'Normal Damage (1×)',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
      colorClass: 'text-slate-300',
    };
  }
  if (multiplier >= 0.5) {
    return {
      label: 'Not Very Effective (½×)',
      badgeClass: 'bg-blue-950 text-blue-200 border-blue-500',
      colorClass: 'text-blue-400',
    };
  }
  return {
    label: 'Highly Resisted (¼×)',
    badgeClass: 'bg-indigo-950 text-indigo-200 border-indigo-500',
    colorClass: 'text-indigo-400',
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
