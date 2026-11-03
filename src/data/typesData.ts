import { PokemonType } from '../types/pokemon';

export interface TypeDetailData {
  id: PokemonType;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  generation: number;
  // Modern (Gen 6-9) offensive interactions
  damageRelations: {
    doubleDamageTo: PokemonType[];
    halfDamageTo: PokemonType[];
    noDamageTo: PokemonType[];
  };
}

export const ALL_POKEMON_TYPES: PokemonType[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

export const TYPE_COLORS: Record<PokemonType, { bg: string; text: string; badge: string; border: string }> = {
  normal: { bg: '#A8A77A', text: '#FFFFFF', badge: 'bg-[#A8A77A]', border: 'border-[#A8A77A]' },
  fire: { bg: '#EE8130', text: '#FFFFFF', badge: 'bg-[#EE8130]', border: 'border-[#EE8130]' },
  water: { bg: '#6390F0', text: '#FFFFFF', badge: 'bg-[#6390F0]', border: 'border-[#6390F0]' },
  electric: { bg: '#F7D02C', text: '#000000', badge: 'bg-[#F7D02C] text-slate-900', border: 'border-[#F7D02C]' },
  grass: { bg: '#7AC74C', text: '#FFFFFF', badge: 'bg-[#7AC74C]', border: 'border-[#7AC74C]' },
  ice: { bg: '#96D9D6', text: '#000000', badge: 'bg-[#96D9D6] text-slate-900', border: 'border-[#96D9D6]' },
  fighting: { bg: '#C22E28', text: '#FFFFFF', badge: 'bg-[#C22E28]', border: 'border-[#C22E28]' },
  poison: { bg: '#A33EA1', text: '#FFFFFF', badge: 'bg-[#A33EA1]', border: 'border-[#A33EA1]' },
  ground: { bg: '#E2BF65', text: '#FFFFFF', badge: 'bg-[#E2BF65]', border: 'border-[#E2BF65]' },
  flying: { bg: '#A98FF3', text: '#FFFFFF', badge: 'bg-[#A98FF3]', border: 'border-[#A98FF3]' },
  psychic: { bg: '#F95587', text: '#FFFFFF', badge: 'bg-[#F95587]', border: 'border-[#F95587]' },
  bug: { bg: '#A6B91A', text: '#FFFFFF', badge: 'bg-[#A6B91A]', border: 'border-[#A6B91A]' },
  rock: { bg: '#B6A136', text: '#FFFFFF', badge: 'bg-[#B6A136]', border: 'border-[#B6A136]' },
  ghost: { bg: '#735797', text: '#FFFFFF', badge: 'bg-[#735797]', border: 'border-[#735797]' },
  dragon: { bg: '#6F35FC', text: '#FFFFFF', badge: 'bg-[#6F35FC]', border: 'border-[#6F35FC]' },
  dark: { bg: '#705746', text: '#FFFFFF', badge: 'bg-[#705746]', border: 'border-[#705746]' },
  steel: { bg: '#B7B7CE', text: '#000000', badge: 'bg-[#B7B7CE] text-slate-900', border: 'border-[#B7B7CE]' },
  fairy: { bg: '#D685AD', text: '#FFFFFF', badge: 'bg-[#D685AD]', border: 'border-[#D685AD]' },
};

export const TYPES_DATA: Record<PokemonType, TypeDetailData> = {
  normal: {
    id: 'normal',
    name: 'Normal',
    color: '#A8A77A',
    bgColor: 'rgba(168, 167, 122, 0.2)',
    borderColor: '#A8A77A',
    description: 'The most basic and versatile elemental type, known for wide learnsets and neutral offensive coverage.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: [],
      halfDamageTo: ['rock', 'steel'],
      noDamageTo: ['ghost'],
    },
  },
  fire: {
    id: 'fire',
    name: 'Fire',
    color: '#EE8130',
    bgColor: 'rgba(238, 129, 48, 0.2)',
    borderColor: '#EE8130',
    description: 'A powerful offensive elemental type capable of inflicting burns and melting icy barriers.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['grass', 'ice', 'bug', 'steel'],
      halfDamageTo: ['fire', 'water', 'rock', 'dragon'],
      noDamageTo: [],
    },
  },
  water: {
    id: 'water',
    name: 'Water',
    color: '#6390F0',
    bgColor: 'rgba(99, 144, 240, 0.2)',
    borderColor: '#6390F0',
    description: 'The most common type in the Pokémon world with excellent defensive qualities and strong rain synergy.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['fire', 'ground', 'rock'],
      halfDamageTo: ['water', 'grass', 'dragon'],
      noDamageTo: [],
    },
  },
  electric: {
    id: 'electric',
    name: 'Electric',
    color: '#F7D02C',
    bgColor: 'rgba(247, 208, 44, 0.2)',
    borderColor: '#F7D02C',
    description: 'Fast, shocking Pokémon with only one weakness (Ground) and high paralysis potential.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['water', 'flying'],
      halfDamageTo: ['electric', 'grass', 'dragon'],
      noDamageTo: ['ground'],
    },
  },
  grass: {
    id: 'grass',
    name: 'Grass',
    color: '#7AC74C',
    bgColor: 'rgba(122, 199, 76, 0.2)',
    borderColor: '#7AC74C',
    description: 'Nature-based Pokémon boasting diverse support, healing, and powder-based status moves.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['water', 'ground', 'rock'],
      halfDamageTo: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
      noDamageTo: [],
    },
  },
  ice: {
    id: 'ice',
    name: 'Ice',
    color: '#96D9D6',
    bgColor: 'rgba(150, 217, 214, 0.2)',
    borderColor: '#96D9D6',
    description: 'One of the supreme offensive types in the game, hitting Dragon, Flying, Grass, and Ground for super effective damage.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['grass', 'ground', 'flying', 'dragon'],
      halfDamageTo: ['fire', 'water', 'ice', 'steel'],
      noDamageTo: [],
    },
  },
  fighting: {
    id: 'fighting',
    name: 'Fighting',
    color: '#C22E28',
    bgColor: 'rgba(194, 46, 40, 0.2)',
    borderColor: '#C22E28',
    description: 'Disciplined martial combatants capable of shattering Normal, Rock, Steel, Ice, and Dark defenses.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['normal', 'ice', 'rock', 'dark', 'steel'],
      halfDamageTo: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
      noDamageTo: ['ghost'],
    },
  },
  poison: {
    id: 'poison',
    name: 'Poison',
    color: '#A33EA1',
    bgColor: 'rgba(163, 62, 161, 0.2)',
    borderColor: '#A33EA1',
    description: 'Toxic specialists known for enduring bulk, poison status, and checking potent Fairy and Grass types.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['grass', 'fairy'],
      halfDamageTo: ['poison', 'ground', 'rock', 'ghost'],
      noDamageTo: ['steel'],
    },
  },
  ground: {
    id: 'ground',
    name: 'Ground',
    color: '#E2BF65',
    bgColor: 'rgba(226, 191, 101, 0.2)',
    borderColor: '#E2BF65',
    description: 'Terrestrial titans wielding Earthquake and Earth Power, hitting 5 types super effectively.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['fire', 'electric', 'poison', 'rock', 'steel'],
      halfDamageTo: ['grass', 'bug'],
      noDamageTo: ['flying'],
    },
  },
  flying: {
    id: 'flying',
    name: 'Flying',
    color: '#A98FF3',
    bgColor: 'rgba(169, 143, 243, 0.2)',
    borderColor: '#A98FF3',
    description: 'Aerial species naturally immune to Ground moves and Hazards, ruling the sky with speed.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['grass', 'fighting', 'bug'],
      halfDamageTo: ['electric', 'rock', 'steel'],
      noDamageTo: [],
    },
  },
  psychic: {
    id: 'psychic',
    name: 'Psychic',
    color: '#F95587',
    bgColor: 'rgba(249, 85, 135, 0.2)',
    borderColor: '#F95587',
    description: 'Telekinetic masters that dominated Generation 1, still renowned for high Special Attack and utility.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['fighting', 'poison'],
      halfDamageTo: ['psychic', 'steel'],
      noDamageTo: ['dark'],
    },
  },
  bug: {
    id: 'bug',
    name: 'Bug',
    color: '#A6B91A',
    bgColor: 'rgba(166, 185, 26, 0.2)',
    borderColor: '#A6B91A',
    description: 'Resourceful invertebrate Pokémon with quick evolutionary lines and tactical tools like U-turn.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['grass', 'psychic', 'dark'],
      halfDamageTo: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
      noDamageTo: [],
    },
  },
  rock: {
    id: 'rock',
    name: 'Rock',
    color: '#B6A136',
    bgColor: 'rgba(182, 161, 54, 0.2)',
    borderColor: '#B6A136',
    description: 'Sturdy, rugged minerals that deal devastating damage to Flying, Fire, Ice, and Bug types.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['fire', 'ice', 'flying', 'bug'],
      halfDamageTo: ['fighting', 'ground', 'steel'],
      noDamageTo: [],
    },
  },
  ghost: {
    id: 'ghost',
    name: 'Ghost',
    color: '#735797',
    bgColor: 'rgba(115, 87, 151, 0.2)',
    borderColor: '#735797',
    description: 'Ethereal specters immune to Normal and Fighting moves, trapped cannot bind them in battle.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['psychic', 'ghost'],
      halfDamageTo: ['dark'],
      noDamageTo: ['normal'],
    },
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon',
    color: '#6F35FC',
    bgColor: 'rgba(111, 53, 252, 0.2)',
    borderColor: '#6F35FC',
    description: 'Ancient, mythical creatures with high base stats and formidable elemental resistances.',
    generation: 1,
    damageRelations: {
      doubleDamageTo: ['dragon'],
      halfDamageTo: ['steel'],
      noDamageTo: ['fairy'],
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    color: '#705746',
    bgColor: 'rgba(112, 87, 70, 0.2)',
    borderColor: '#705746',
    description: 'Cunning tricksters immune to Psychic attacks and Prankster status moves, introduced in Gen 2.',
    generation: 2,
    damageRelations: {
      doubleDamageTo: ['psychic', 'ghost'],
      halfDamageTo: ['fighting', 'dark', 'fairy'],
      noDamageTo: [],
    },
  },
  steel: {
    id: 'steel',
    name: 'Steel',
    color: '#B7B7CE',
    bgColor: 'rgba(183, 183, 206, 0.2)',
    borderColor: '#B7B7CE',
    description: 'The pinnacle of defensive typing, possessing 10 resistances and 1 complete immunity (Poison).',
    generation: 2,
    damageRelations: {
      doubleDamageTo: ['ice', 'rock', 'fairy'],
      halfDamageTo: ['fire', 'water', 'electric', 'steel'],
      noDamageTo: [],
    },
  },
  fairy: {
    id: 'fairy',
    name: 'Fairy',
    color: '#D685AD',
    bgColor: 'rgba(214, 133, 173, 0.2)',
    borderColor: '#D685AD',
    description: 'Mystical creatures introduced in Gen 6 to balance Dragon, Fighting, and Dark types.',
    generation: 6,
    damageRelations: {
      doubleDamageTo: ['fighting', 'dragon', 'dark'],
      halfDamageTo: ['fire', 'poison', 'steel'],
      noDamageTo: [],
    },
  },
};
