import { describe, it, expect } from 'vitest';
import {
  getTypeEffectiveness,
  calculateDualTypeEffectiveness,
  getDefensiveProfile,
} from '../utils/typeCalculations';

describe('Type Effectiveness Engine', () => {
  describe('Single-Type Effectiveness', () => {
    it('calculates Fire advantages and disadvantages correctly', () => {
      expect(getTypeEffectiveness('fire', 'grass')).toBe(2);
      expect(getTypeEffectiveness('fire', 'ice')).toBe(2);
      expect(getTypeEffectiveness('fire', 'steel')).toBe(2);
      expect(getTypeEffectiveness('fire', 'bug')).toBe(2);

      expect(getTypeEffectiveness('fire', 'water')).toBe(0.5);
      expect(getTypeEffectiveness('fire', 'rock')).toBe(0.5);
      expect(getTypeEffectiveness('fire', 'fire')).toBe(0.5);
      expect(getTypeEffectiveness('fire', 'dragon')).toBe(0.5);

      expect(getTypeEffectiveness('fire', 'normal')).toBe(1);
    });

    it('calculates immunities correctly', () => {
      expect(getTypeEffectiveness('normal', 'ghost')).toBe(0);
      expect(getTypeEffectiveness('ghost', 'normal')).toBe(0);
      expect(getTypeEffectiveness('electric', 'ground')).toBe(0);
      expect(getTypeEffectiveness('ground', 'flying')).toBe(0);
      expect(getTypeEffectiveness('fighting', 'ghost')).toBe(0);
      expect(getTypeEffectiveness('poison', 'steel')).toBe(0);
      expect(getTypeEffectiveness('psychic', 'dark')).toBe(0);
      expect(getTypeEffectiveness('dragon', 'fairy')).toBe(0);
    });
  });

  describe('Dual-Type Calculations', () => {
    it('correctly calculates Charizard (Fire / Flying)', () => {
      const defTypes = ['fire', 'flying'] as const;

      // 4x Rock (2x Fire * 2x Flying = 4x)
      const rockResult = calculateDualTypeEffectiveness('rock', [...defTypes]);
      expect(rockResult.multiplier).toBe(4);

      // 2x Water (2x Fire * 1x Flying = 2x)
      const waterResult = calculateDualTypeEffectiveness('water', [...defTypes]);
      expect(waterResult.multiplier).toBe(2);

      // 2x Electric (1x Fire * 2x Flying = 2x)
      const electricResult = calculateDualTypeEffectiveness('electric', [...defTypes]);
      expect(electricResult.multiplier).toBe(2);

      // 0x Ground (2x Fire * 0x Flying = 0x)
      const groundResult = calculateDualTypeEffectiveness('ground', [...defTypes]);
      expect(groundResult.multiplier).toBe(0);

      // 0.25x Grass (0.5x Fire * 0.5x Flying = 0.25x)
      const grassResult = calculateDualTypeEffectiveness('grass', [...defTypes]);
      expect(grassResult.multiplier).toBe(0.25);

      // 0.25x Bug (0.5x Fire * 0.5x Flying = 0.25x)
      const bugResult = calculateDualTypeEffectiveness('bug', [...defTypes]);
      expect(bugResult.multiplier).toBe(0.25);
    });

    it('correctly calculates Gyarados (Water / Flying)', () => {
      const defTypes = ['water', 'flying'] as const;

      // 4x Electric (2x Water * 2x Flying = 4x)
      expect(calculateDualTypeEffectiveness('electric', [...defTypes]).multiplier).toBe(4);

      // 2x Rock (1x Water * 2x Flying = 2x)
      expect(calculateDualTypeEffectiveness('rock', [...defTypes]).multiplier).toBe(2);

      // 0x Ground (1x Water * 0x Flying = 0x)
      expect(calculateDualTypeEffectiveness('ground', [...defTypes]).multiplier).toBe(0);

      // 0.5x Water (0.5x Water * 1x Flying = 0.5x)
      expect(calculateDualTypeEffectiveness('water', [...defTypes]).multiplier).toBe(0.5);
    });

    it('correctly calculates Swampert (Water / Ground)', () => {
      const defTypes = ['water', 'ground'] as const;

      // 4x Grass (2x Water * 2x Ground = 4x)
      expect(calculateDualTypeEffectiveness('grass', [...defTypes]).multiplier).toBe(4);

      // 0x Electric (Ground immunity)
      expect(calculateDualTypeEffectiveness('electric', [...defTypes]).multiplier).toBe(0);
    });
  });

  describe('Defensive Profile Generator', () => {
    it('summarizes Charizard weaknesses, resistances, and immunities', () => {
      const profile = getDefensiveProfile(['fire', 'flying']);
      expect(profile.quadrupleDamageFrom).toContain('rock');
      expect(profile.doubleDamageFrom).toContain('water');
      expect(profile.doubleDamageFrom).toContain('electric');
      expect(profile.noDamageFrom).toContain('ground');
      expect(profile.quarterDamageFrom).toContain('grass');
      expect(profile.quarterDamageFrom).toContain('bug');
    });
  });

  describe('Special Ability Interactions', () => {
    it('handles Wonder Guard on Shedinja (Bug / Ghost)', () => {
      const defTypes = ['bug', 'ghost'] as const;

      // Super effective hits bypass Wonder Guard
      expect(calculateDualTypeEffectiveness('fire', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(2);
      expect(calculateDualTypeEffectiveness('flying', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(2);
      expect(calculateDualTypeEffectiveness('rock', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(2);
      expect(calculateDualTypeEffectiveness('ghost', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(2);
      expect(calculateDualTypeEffectiveness('dark', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(2);

      // Neutral and resisted attacks are completely negated to 0x by Wonder Guard
      expect(calculateDualTypeEffectiveness('water', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(0);
      expect(calculateDualTypeEffectiveness('grass', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(0);
      expect(calculateDualTypeEffectiveness('electric', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(0);
      expect(calculateDualTypeEffectiveness('normal', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(0);
      expect(calculateDualTypeEffectiveness('fighting', [...defTypes], { ability: 'wonder guard' }).multiplier).toBe(0);
    });

    it('handles Levitate immunity to Ground', () => {
      // Rotom-Heat is Electric / Fire (would normally take 4x Ground damage)
      const withoutLevitate = calculateDualTypeEffectiveness('ground', ['electric', 'fire']);
      expect(withoutLevitate.multiplier).toBe(4);

      const withLevitate = calculateDualTypeEffectiveness('ground', ['electric', 'fire'], { ability: 'levitate' });
      expect(withLevitate.multiplier).toBe(0);
      expect(withLevitate.isImmuneByAbility).toBe(true);
    });

    it('handles Flash Fire immunity to Fire', () => {
      const res = calculateDualTypeEffectiveness('fire', ['steel'], { ability: 'flash fire' });
      expect(res.multiplier).toBe(0);
      expect(res.isImmuneByAbility).toBe(true);
    });

    it('handles Thick Fat halving Fire and Ice', () => {
      // Snorlax (Normal)
      const resFire = calculateDualTypeEffectiveness('fire', ['normal'], { ability: 'thick fat' });
      expect(resFire.multiplier).toBe(0.5);
      const resIce = calculateDualTypeEffectiveness('ice', ['normal'], { ability: 'thick fat' });
      expect(resIce.multiplier).toBe(0.5);
    });
  });

  describe('Historical Generation Type Mechanics', () => {
    it('Gen 1: Ghost dealt 0x to Psychic (famous Gen 1 glitch)', () => {
      expect(getTypeEffectiveness('ghost', 'psychic', 1)).toBe(0);
      // Gen 2+ fixed it to 2x
      expect(getTypeEffectiveness('ghost', 'psychic', 2)).toBe(2);
      expect(getTypeEffectiveness('ghost', 'psychic', 9)).toBe(2);
    });

    it('Gen 1: Bug and Poison dealt 2x to each other', () => {
      expect(getTypeEffectiveness('bug', 'poison', 1)).toBe(2);
      expect(getTypeEffectiveness('poison', 'bug', 1)).toBe(2);

      // In Gen 2+, Bug was 0.5x vs Poison, and Poison was 1x vs Bug (until modern)
      expect(getTypeEffectiveness('bug', 'poison', 9)).toBe(0.5);
    });

    it('Gen 2-5: Steel resisted Dark and Ghost', () => {
      expect(getTypeEffectiveness('dark', 'steel', 3)).toBe(0.5);
      expect(getTypeEffectiveness('ghost', 'steel', 4)).toBe(0.5);

      // In Gen 6+, Steel lost resistances to Dark and Ghost (now neutral 1x)
      expect(getTypeEffectiveness('dark', 'steel', 6)).toBe(1);
      expect(getTypeEffectiveness('ghost', 'steel', 9)).toBe(1);
    });
  });
});
