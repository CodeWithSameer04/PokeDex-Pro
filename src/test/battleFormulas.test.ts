import { describe, it, expect } from 'vitest';
import { analyzeMoveEffectiveness, calculateStatAtLevel100 } from '../utils/battleFormulas';

describe('Battle Formulas and Move Effectiveness Checker', () => {
  it('correctly checks Pikachu using Thunderbolt on Gyarados', () => {
    const result = analyzeMoveEffectiveness({
      move: {
        name: 'Thunderbolt',
        type: 'electric',
        category: 'special',
        power: 90,
        accuracy: 100,
      },
      attacker: {
        name: 'Pikachu',
        types: ['electric'],
        stats: { attack: 55, specialAttack: 50 },
      },
      defender: {
        name: 'Gyarados',
        types: ['water', 'flying'],
        stats: { hp: 95, defense: 79, specialDefense: 100 },
      },
    });

    expect(result.isSTAB).toBe(true);
    expect(result.stabMultiplier).toBe(1.5);
    expect(result.finalTypeMultiplier).toBe(4);
    expect(result.typeEffectiveness.multiplier).toBe(4);
    expect(result.estimatedDamageRange).toBeDefined();
    expect(result.estimatedDamageRange?.minDamage).toBeGreaterThan(0);
  });

  it('correctly handles Adaptability ability giving 2.0x STAB bonus', () => {
    const result = analyzeMoveEffectiveness({
      move: {
        name: 'Surf',
        type: 'water',
        category: 'special',
        power: 90,
        accuracy: 100,
      },
      attacker: {
        name: 'Crawdaunt',
        types: ['water', 'dark'],
        ability: 'adaptability',
      },
      defender: {
        name: 'Snorlax',
        types: ['normal'],
      },
    });

    expect(result.isSTAB).toBe(true);
    expect(result.stabMultiplier).toBe(2.0);
    expect(result.abilityNotes).toContain('Adaptability');
  });

  it('correctly handles Earthquake vs Flying defender (0x immunity)', () => {
    const result = analyzeMoveEffectiveness({
      move: {
        name: 'Earthquake',
        type: 'ground',
        category: 'physical',
        power: 100,
        accuracy: 100,
      },
      attacker: {
        name: 'Garchomp',
        types: ['dragon', 'ground'],
      },
      defender: {
        name: 'Corviknight',
        types: ['flying', 'steel'],
      },
    });

    expect(result.isSTAB).toBe(true);
    expect(result.finalTypeMultiplier).toBe(0);
    expect(result.estimatedDamageRange?.minDamage).toBe(0);
  });

  it('calculates level 100 base stat correctly', () => {
    // Mew base 100 HP with 31 IVs and 252 EVs should be 404
    const mewHP = calculateStatAtLevel100(100, true, 31, 252);
    expect(mewHP).toBe(404);

    // Shedinja base 1 HP is always 1
    const shedinjaHP = calculateStatAtLevel100(1, true, 31, 252);
    expect(shedinjaHP).toBe(1);
  });
});
