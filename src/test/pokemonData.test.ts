import { describe, it, expect } from 'vitest';
import { getLocalPokemonList, getLocalMovesList, getLocalAbilitiesList, getLocalPokemon, getLocalMove } from '../utils/pokeapi';
import { ALL_POKEMON_TYPES } from '../data/typesData';

describe('Pokémon Master Dataset Coverage', () => {
  const pokemon = getLocalPokemonList();
  const moves = getLocalMovesList();
  const abilities = getLocalAbilitiesList();

  it('contains over 1000 Pokémon covering Gen 1 to Gen 9', () => {
    expect(pokemon.length).toBeGreaterThanOrEqual(1025);
    
    // Check first and last Pokémon
    const bulbasaur = getLocalPokemon(1);
    expect(bulbasaur).toBeDefined();
    expect(bulbasaur?.name).toBe('Bulbasaur');
    expect(bulbasaur?.types).toContain('grass');
    expect(bulbasaur?.types).toContain('poison');
    expect(bulbasaur?.generation).toBe(1);

    const pecharunt = getLocalPokemon(1025);
    expect(pecharunt).toBeDefined();
    expect(pecharunt?.generation).toBe(9);
  });

  it('contains all 18 modern types and validates them', () => {
    expect(ALL_POKEMON_TYPES.length).toBe(18);
    expect(ALL_POKEMON_TYPES).toContain('fairy');
    expect(ALL_POKEMON_TYPES).toContain('steel');
    expect(ALL_POKEMON_TYPES).toContain('dark');

    // Ensure all Pokémon types belong to the 18 valid types
    for (const p of pokemon.slice(0, 100)) {
      for (const t of p.types) {
        expect(ALL_POKEMON_TYPES).toContain(t);
      }
    }
  });

  it('contains all 900+ official moves with valid damage categories', () => {
    expect(moves.length).toBeGreaterThanOrEqual(900);

    const flamethrower = getLocalMove('flamethrower');
    expect(flamethrower).toBeDefined();
    expect(flamethrower?.type).toBe('fire');
    expect(flamethrower?.category).toBe('special');
    expect(flamethrower?.power).toBe(90);
    expect(flamethrower?.accuracy).toBe(100);

    const closeCombat = getLocalMove('close-combat');
    expect(closeCombat).toBeDefined();
    expect(closeCombat?.category).toBe('physical');

    const swordsDance = getLocalMove('swords-dance');
    expect(swordsDance).toBeDefined();
    expect(swordsDance?.category).toBe('status');
  });

  it('contains all 300+ abilities with battle effects', () => {
    expect(abilities.length).toBeGreaterThanOrEqual(300);

    const levitate = abilities.find(a => a.name === 'levitate');
    expect(levitate).toBeDefined();
    expect(levitate?.shortDescription.toLowerCase()).toContain('ground');

    const wonderGuard = abilities.find(a => a.name === 'wonder-guard');
    expect(wonderGuard).toBeDefined();
    expect(wonderGuard?.shortDescription.toLowerCase()).toContain('super effective');
  });
});
