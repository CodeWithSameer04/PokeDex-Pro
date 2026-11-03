import { PokemonType, DamageCategory } from '../types/pokemon';
import { calculateDualTypeEffectiveness, DualTypeResult } from './typeCalculations';

export interface MoveCheckerResult {
  moveName: string;
  moveType: PokemonType;
  category: DamageCategory;
  basePower: number | null;
  accuracy: number | null;
  attackerName: string;
  attackerTypes: PokemonType[];
  defenderName: string;
  defenderTypes: PokemonType[];
  isSTAB: boolean;
  stabMultiplier: number; // 1.5x (or 2.0x for Adaptability)
  typeEffectiveness: DualTypeResult;
  finalTypeMultiplier: number;
  abilityNotes?: string;
  estimatedDamageRange?: {
    minDamage: number;
    maxDamage: number;
    minPercent: number;
    maxPercent: number;
  };
  damageFormulaExplanation: string;
}

/**
 * Calculates level 100 stat from base stat
 */
export function calculateStatAtLevel100(
  base: number,
  isHP: boolean = false,
  iv: number = 31,
  ev: number = 252,
  natureMultiplier: number = 1.0
): number {
  if (isHP) {
    if (base === 1) return 1; // Shedinja
    return Math.floor(0.01 * (2 * base + iv + Math.floor(0.25 * ev)) * 100) + 100 + 10;
  }
  const raw = Math.floor(0.01 * (2 * base + iv + Math.floor(0.25 * ev)) * 100) + 5;
  return Math.floor(raw * natureMultiplier);
}

/**
 * Full Move Effectiveness analysis combining Move + Attacker + Defender
 */
export function analyzeMoveEffectiveness(params: {
  move: {
    name: string;
    type: PokemonType;
    category: DamageCategory;
    power: number | null;
    accuracy: number | null;
  };
  attacker: {
    name: string;
    types: PokemonType[];
    stats?: { attack: number; specialAttack: number };
    ability?: string;
  };
  defender: {
    name: string;
    types: PokemonType[];
    stats?: { hp: number; defense: number; specialDefense: number };
    ability?: string;
  };
}): MoveCheckerResult {
  const { move, attacker, defender } = params;

  // STAB: Same-Type Attack Bonus
  const isSTAB = attacker.types.includes(move.type);
  const attackerAbility = attacker.ability?.toLowerCase().trim();
  const stabMultiplier = !isSTAB ? 1.0 : attackerAbility === 'adaptability' ? 2.0 : 1.5;

  // Defensive calculation against defender's dual types
  const typeResult = calculateDualTypeEffectiveness(move.type, defender.types, {
    ability: defender.ability,
  });

  let abilityNotes = typeResult.abilityEffect;
  if (isSTAB && attackerAbility === 'adaptability') {
    abilityNotes = (abilityNotes ? abilityNotes + ' ' : '') + 'Adaptability increases STAB boost from 1.5× to 2.0×!';
  }

  // Damage estimation if physical or special with base power
  let estimatedDamageRange: MoveCheckerResult['estimatedDamageRange'] | undefined;
  if (typeResult.multiplier === 0) {
    estimatedDamageRange = {
      minDamage: 0,
      maxDamage: 0,
      minPercent: 0,
      maxPercent: 0,
    };
  } else if (move.category !== 'status' && move.power && move.power > 0) {
    const isPhysical = move.category === 'physical';
    const atkVal = attacker.stats ? (isPhysical ? attacker.stats.attack : attacker.stats.specialAttack) : 100;
    const defVal = defender.stats ? (isPhysical ? defender.stats.defense : defender.stats.specialDefense) : 100;
    const hpVal = defender.stats ? defender.stats.hp : 100;

    const atkStat = calculateStatAtLevel100(atkVal, false, 31, 252, 1.1); // Max positive nature
    const defStat = calculateStatAtLevel100(defVal, false, 31, 0, 1.0); // Neutral nature
    const defenderHP = calculateStatAtLevel100(hpVal, true, 31, 252);

    // Standard Generation 9 Damage Formula:
    // Base = floor(floor(floor((2 * 100 / 5 + 2) * Power * A / D) / 50 + 2) * STAB * TypeMod)
    const levelFactor = 42; // (2 * 100 / 5 + 2)
    const baseDmg = Math.floor(Math.floor((levelFactor * move.power * (atkStat / defStat)) / 50) + 2);
    
    const modifiedWithModifiers = baseDmg * stabMultiplier * typeResult.multiplier;
    const minRoll = Math.floor(modifiedWithModifiers * 0.85);
    const maxRoll = Math.floor(modifiedWithModifiers * 1.0);

    estimatedDamageRange = {
      minDamage: Math.max(1, minRoll),
      maxDamage: Math.max(1, maxRoll),
      minPercent: Math.round((Math.max(1, minRoll) / defenderHP) * 1000) / 10,
      maxPercent: Math.round((Math.max(1, maxRoll) / defenderHP) * 1000) / 10,
    };
  }

  const damageFormulaExplanation = `Standard damage formula: Damage = [(((2 × Level / 5 + 2) × BasePower × (A / D)) / 50 + 2) × Targets × Weather × Critical × Random(0.85–1.0) × STAB(${stabMultiplier}×) × Type(${typeResult.multiplier}×) × Burn × Other]. Note: Type effectiveness is one component of the multi-factor calculation.`;

  return {
    moveName: move.name,
    moveType: move.type,
    category: move.category,
    basePower: move.power,
    accuracy: move.accuracy,
    attackerName: attacker.name,
    attackerTypes: attacker.types,
    defenderName: defender.name,
    defenderTypes: defender.types,
    isSTAB,
    stabMultiplier,
    typeEffectiveness: typeResult,
    finalTypeMultiplier: typeResult.multiplier,
    abilityNotes,
    estimatedDamageRange,
    damageFormulaExplanation,
  };
}
