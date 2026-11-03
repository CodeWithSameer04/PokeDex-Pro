import pokemonJson from '../data/generated/pokemonList.json';
import movesJson from '../data/generated/movesList.json';
import abilitiesJson from '../data/generated/abilitiesList.json';
import { PokemonSummary, MoveData, AbilityData } from '../types/pokemon';

// Fast local references
const pokemonList = pokemonJson as unknown as (PokemonSummary & { slug: string; speciesId: number })[];
const movesList = movesJson as unknown as MoveData[];
const abilitiesList = abilitiesJson as unknown as AbilityData[];

export function getLocalPokemonList(): (PokemonSummary & { slug: string; speciesId: number })[] {
  return pokemonList;
}

export function getLocalPokemon(idOrSlug: string | number): (PokemonSummary & { slug: string; speciesId: number }) | undefined {
  const query = String(idOrSlug).toLowerCase().trim();
  const num = Number(query);
  if (!isNaN(num)) {
    return pokemonList.find(p => p.id === num);
  }
  return pokemonList.find(p => p.slug === query || p.name.toLowerCase() === query);
}

export function getLocalMovesList(): MoveData[] {
  return movesList;
}

export function getLocalMove(idOrName: string | number): MoveData | undefined {
  const query = String(idOrName).toLowerCase().trim();
  const num = Number(query);
  if (!isNaN(num)) {
    return movesList.find(m => m.id === num);
  }
  return movesList.find(m => m.name.toLowerCase() === query || m.displayName.toLowerCase() === query);
}

export function getLocalAbilitiesList(): AbilityData[] {
  return abilitiesList;
}

export function getLocalAbility(idOrName: string | number): AbilityData | undefined {
  const query = String(idOrName).toLowerCase().trim();
  const num = Number(query);
  if (!isNaN(num)) {
    return abilitiesList.find(a => a.id === num);
  }
  return abilitiesList.find(a => a.name.toLowerCase() === query || a.displayName.toLowerCase() === query);
}

// Live PokeAPI fetch with in-memory caching and fallback
const cache = new Map<string, any>();

export async function fetchLivePokemonDetail(idOrSlug: string | number) {
  const cacheKey = `poke_${idOrSlug}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrSlug}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`PokéAPI live fetch failed for ${idOrSlug}, falling back to local dataset:`, err);
    return null;
  }
}

export async function fetchLivePokemonSpecies(speciesIdOrName: string | number) {
  const cacheKey = `species_${speciesIdOrName}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesIdOrName}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`PokéAPI live species fetch failed for ${speciesIdOrName}:`, err);
    return null;
  }
}

export async function fetchLiveEvolutionChain(url: string) {
  const cacheKey = `evo_${url}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`PokéAPI live evolution chain fetch failed for ${url}:`, err);
    return null;
  }
}
