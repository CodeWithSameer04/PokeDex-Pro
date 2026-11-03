export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type DamageCategory = 'physical' | 'special' | 'status';

export interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
}

export interface PokemonSummary {
  id: number;
  name: string;
  types: PokemonType[];
  stats: BaseStats;
  generation: number;
  height: number; // in decimeters or meters
  weight: number; // in hectograms or kg
  species: string; // e.g. "Lizard Pokémon"
  sprite: string;
  artwork: string;
  abilities: {
    name: string;
    isHidden: boolean;
  }[];
  isLegendary?: boolean;
  isMythical?: boolean;
  isMega?: boolean;
  isRegional?: boolean;
  color?: string;
  flavorText?: string;
}

export interface MoveFlags {
  contact?: boolean;
  protect?: boolean;
  sound?: boolean;
  punch?: boolean;
  bite?: boolean;
  bullet?: boolean;
  heal?: boolean;
  snatch?: boolean;
  defrost?: boolean;
}

export interface MoveHistoricalChange {
  generation: number;
  power?: number;
  accuracy?: number;
  pp?: number;
  type?: PokemonType;
  category?: DamageCategory;
  notes?: string;
}

export interface MoveData {
  id: number;
  name: string;
  displayName: string;
  type: PokemonType;
  category: DamageCategory;
  power: number | null; // null for status or variable
  accuracy: number | null; // null for moves that never miss (Swift, Aerial Ace)
  pp: number;
  priority: number;
  target: string;
  generation: number;
  shortDescription: string;
  effectDescription: string;
  effectChance: number | null;
  flags: MoveFlags;
  statChanges?: {
    stat: string;
    change: number;
  }[];
  statusCondition?: string;
  critRate?: number;
  historicalChanges?: MoveHistoricalChange[];
  learnedBy?: number[]; // Pokémon IDs that learn this move
}

export interface AbilityData {
  id: number;
  name: string;
  displayName: string;
  generation: number;
  shortDescription: string;
  effectDescription: string;
  battleEffect?: string;
  competitiveRating?: number; // 1 to 5
  typeImmunities?: {
    type: PokemonType;
    multiplier: number; // e.g. 0 for Levitate against Ground, 0 for Flash Fire against Fire
    effectDescription: string;
  }[];
  typeModifiers?: {
    type: PokemonType;
    multiplier: number; // e.g. 0.5 for Thick Fat against Fire and Ice
  }[];
  isWonderGuard?: boolean;
  commonPokemon?: { id: number; name: string; isHidden: boolean }[];
}

export interface TypeDefensiveMatchup {
  multiplier: number;
  attackingType: PokemonType;
}

export interface TypeMatchupSummary {
  quadrupleDamageFrom: PokemonType[]; // 4x
  doubleDamageFrom: PokemonType[]; // 2x
  normalDamageFrom: PokemonType[]; // 1x
  halfDamageFrom: PokemonType[]; // 0.5x
  quarterDamageFrom: PokemonType[]; // 0.25x
  noDamageFrom: PokemonType[]; // 0x
}

export interface GameVersion {
  id: string;
  name: string;
  generation: number;
  releaseYear: number;
  region: string;
  color: string;
}

export interface QuizQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'type-weakness' | 'multiplier' | 'counter-move' | 'dual-type' | 'ability-defense';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  pokemonId?: number;
  types?: PokemonType[];
}
