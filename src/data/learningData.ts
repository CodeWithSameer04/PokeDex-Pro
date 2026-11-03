export interface LearningTopic {
  id: string;
  title: string;
  category: 'basics' | 'battle-stats' | 'mechanics' | 'status-effects';
  icon: string;
  beginnerSummary: string;
  beginnerDetails: string[];
  advancedSummary: string;
  advancedDetails: string[];
  example: {
    title: string;
    description: string;
    attacker?: string;
    move?: string;
    defender?: string;
    result?: string;
  };
  interactiveTip: string;
}

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'types',
    title: 'What are Pokémon Types?',
    category: 'basics',
    icon: 'Layers',
    beginnerSummary: 'Every Pokémon and every move belongs to an elemental Type, like Fire, Water, or Grass. It is like an expanded game of Rock-Paper-Scissors!',
    beginnerDetails: [
      'There are currently 18 official elemental types in the Pokémon franchise.',
      'A Pokémon can have either ONE type (single-type, like Pikachu which is purely Electric) or TWO types (dual-type, like Charizard which is Fire and Flying).',
      'Types determine what moves a Pokémon resists and what moves hit it hard.',
    ],
    advancedSummary: 'Types form an 18×18 mathematical matrix governing damage multipliers ranging from 0× to 4×.',
    advancedDetails: [
      'Type effectiveness is calculated multiplicatively across a defender’s dual typing.',
      'Types also grant special passive immunities: Fire cannot be Burned, Grass is immune to powder/spore moves, Electric cannot be Paralyzed, Ice cannot be Frozen, and Poison/Steel cannot be Poisoned.',
      'Ghost-types cannot be trapped in battle, and Flying-types ignore Spikes, Toxic Spikes, Sticky Web, and Terrain.',
    ],
    example: {
      title: 'Water vs Fire',
      description: 'Squirtle (Water) splashes Charmander (Fire) with Water Gun. Water extinguishes Fire, so Charmander takes double damage!',
      attacker: 'Squirtle',
      move: 'Water Gun (Water)',
      defender: 'Charmander (Fire)',
      result: '2× Super Effective Damage',
    },
    interactiveTip: 'Check out the Type Explorer to view the complete 18-type matrix and interactive matchup grid.',
  },
  {
    id: 'type-advantage',
    title: 'Type Advantage & Super Effective',
    category: 'basics',
    icon: 'Zap',
    beginnerSummary: 'When you strike an opponent with a move they are weak to, the game announces: "It\'s super effective!" and deals double (or quadruple) damage.',
    beginnerDetails: [
      'Super effective moves deal 2× damage to single-type Pokémon.',
      'If the target has two types and is weak to both, it deals a massive 4× damage (Extremely Effective)!',
      'Learning which types beat which is the single most important skill in Pokémon battling.',
    ],
    advancedSummary: 'Type multipliers apply directly to the base damage roll before random damage variation.',
    advancedDetails: [
      'A 4× weakness can knock out even the bulkiest Pokémon in a single blow (e.g. Rock vs Charizard, Electric vs Gyarados, Grass vs Swampert).',
      'Items like Expert Belt boost super effective attacks by 20%, and Super Effective Berries (like Yache Berry) halve incoming super effective damage once.',
    ],
    example: {
      title: 'Double Weakness (4× Damage)',
      description: 'Pikachu uses Thunderbolt against Gyarados (Water / Flying). Gyarados’s Water typing is 2× weak to Electric, and its Flying typing is also 2× weak to Electric. 2 × 2 = 4× damage!',
      attacker: 'Pikachu',
      move: 'Thunderbolt (Electric)',
      defender: 'Gyarados (Water / Flying)',
      result: '4× Extremely Effective!',
    },
    interactiveTip: 'Use our Type Calculator to test any combination of dual types to spot critical 4× vulnerabilities.',
  },
  {
    id: 'resistances-and-immunities',
    title: 'Resistances & Immunities',
    category: 'basics',
    icon: 'Shield',
    beginnerSummary: 'If an opponent is resistant to your attack, it deals half damage ("It\'s not very effective..."). If they are immune, it deals ZERO damage!',
    beginnerDetails: [
      'Resistant moves deal ½× (0.5×) damage to single types, or ¼× (0.25×) to double-resistant dual types.',
      'Immunity means 0× damage: the attack completely misses or has no effect at all.',
      'Example immunities: Flying Pokémon ignore Ground attacks, Ghost Pokémon ignore Normal and Fighting attacks, and Dark Pokémon ignore Psychic attacks.',
    ],
    advancedSummary: 'Immunities override all other positive multipliers: any number multiplied by zero equals zero.',
    advancedDetails: [
      'Steel has the most resistances in Pokémon (10 resistances and 1 complete Poison immunity).',
      'Certain abilities grant synthetic immunities: Levitate (Ground), Flash Fire (Fire), Volt Absorb (Electric), Water Absorb (Water), and Sap Sipper (Grass).',
    ],
    example: {
      title: 'Immunity in Action',
      description: 'Diglett uses Earthquake against Pidgeot (Flying). Pidgeot is soaring in the sky, so the ground tremor cannot touch it at all!',
      attacker: 'Diglett',
      move: 'Earthquake (Ground)',
      defender: 'Pidgeot (Flying)',
      result: '0× Damage (Immunity)',
    },
    interactiveTip: 'Switch on the Defensive Type Checker on the Calculator page to see all immunities for any Pokémon.',
  },
  {
    id: 'physical-special-status',
    title: 'Physical vs Special vs Status Moves',
    category: 'mechanics',
    icon: 'Sword',
    beginnerSummary: 'Moves are split into three categories: Physical (punches, bites, tackles), Special (beams, fire blasts, psychics), and Status (boosting, healing, debuffing).',
    beginnerDetails: [
      'Physical moves use your Attack stat vs the defender’s Defense stat.',
      'Special moves use your Special Attack stat vs the defender’s Special Defense stat.',
      'Status moves deal no direct HP damage. Instead, they inflict status conditions, heal HP, or raise/lower stats.',
    ],
    advancedSummary: 'Prior to Generation 4 (2006), a move’s category was determined solely by its elemental type. Gen 4 introduced the modern Physical/Special split.',
    advancedDetails: [
      'Some moves break the standard rule: Psyshock is a Special move that targets the enemy’s physical Defense; Body Press is a Physical move that calculates damage using the user’s Defense instead of Attack.',
      'Physical moves frequently make direct contact, triggering abilities like Rough Skin, Static, Flame Body, or items like Rocky Helmet.',
    ],
    example: {
      title: 'Close Combat vs Psychic',
      description: 'Lucario using Close Combat strikes physically with its fists, targeting Defense. Lucario using Aura Sphere unleashes energy waves, targeting Special Defense.',
      attacker: 'Lucario',
      move: 'Close Combat vs Aura Sphere',
      defender: 'Blissey (High HP & SpDef, Low Def)',
      result: 'Close Combat deals huge physical damage because Blissey has virtually no physical Defense!',
    },
    interactiveTip: 'Filter the Move Database by Physical, Special, or Status to compare competitive options.',
  },
  {
    id: 'stab',
    title: 'STAB (Same-Type Attack Bonus)',
    category: 'mechanics',
    icon: 'Flame',
    beginnerSummary: 'When a Pokémon uses a move that matches its own elemental type, that move gets a free 50% power boost!',
    beginnerDetails: [
      'STAB stands for Same-Type Attack Bonus.',
      'Example: If Charizard (Fire/Flying) uses Flamethrower (Fire), it deals 1.5× normal damage because Charizard is a Fire type!',
      'If Charizard uses Dragon Claw (Dragon), it does NOT get STAB because Charizard is not a Dragon type in normal form.',
    ],
    advancedSummary: 'STAB multiplies the base power factor by 1.5×, stacking multiplicatively with type effectiveness and items.',
    advancedDetails: [
      'Pokémon with the Adaptability ability (like Porygon-Z or Crawdaunt) receive a 2.0× STAB bonus instead of 1.5×.',
      'In Generation 9, Terastallizing into the same type boosts STAB further to 2.0×.',
      'A 4× super-effective STAB move deals a gargantuan 6.0× total damage multiplier (1.5 × 4 = 6.0)!',
    ],
    example: {
      title: 'Pikachu Thunderbolt Boost',
      description: 'Pikachu using Thunderbolt (90 base power) effectively hits with 135 power because of its 1.5× Electric STAB bonus.',
      attacker: 'Pikachu (Electric)',
      move: 'Thunderbolt (Electric, 90 BP)',
      defender: 'Neutral Target',
      result: '135 Effective Power (1.5× STAB)',
    },
    interactiveTip: 'The Move Effectiveness Checker highlights whether your chosen attacker earns a 1.5× or 2.0× STAB bonus.',
  },
  {
    id: 'move-stats',
    title: 'Base Power, Accuracy & PP',
    category: 'battle-stats',
    icon: 'Activity',
    beginnerSummary: 'Every move has three key numbers: Base Power (how hard it hits), Accuracy (chance to hit), and PP (how many times you can use it).',
    beginnerDetails: [
      'Base Power: Higher is stronger. Tackle has 40 power, Flamethrower has 90, and Explosion has 250!',
      'Accuracy: Shown as a percentage (e.g. 100% hits reliably, 70% miss frequently). Moves with "—" accuracy never miss!',
      'PP (Power Points): The number of uses remaining before you must heal at a Pokémon Center.',
    ],
    advancedSummary: 'High-power moves generally carry strategic trade-offs such as lower accuracy (Hydro Pump 80%), recoil (Double-Edge), or stat drops (Close Combat).',
    advancedDetails: [
      'PP can be increased up to 1.6× its base value using PP Up and PP Max items.',
      'Certain abilities like Pressure increase opponent PP consumption from 1 to 2 points per move.',
      'Priority brackets determine move order: Quick Attack has +1 priority, while Trick Room has -7 priority.',
    ],
    example: {
      title: 'Flamethrower vs Fire Blast',
      description: 'Flamethrower has 90 Power, 100% Accuracy, and 15 PP (reliable). Fire Blast has 110 Power, 85% Accuracy, and 5 PP (risky nuke).',
      attacker: 'Trainer Decision',
      move: 'Flamethrower (Reliable) vs Fire Blast (High Risk)',
      defender: 'Opponent',
      result: '100% Accuracy guarantees consistency in competitive play.',
    },
    interactiveTip: 'Sort moves by Power, Accuracy, or PP in our Move Database.',
  },
  {
    id: 'status-conditions',
    title: 'Major Status Conditions',
    category: 'status-effects',
    icon: 'AlertTriangle',
    beginnerSummary: 'Pokémon can be afflicted with Burn, Freeze, Paralysis, Poison, Bad Poison (Toxic), or Sleep during combat.',
    beginnerDetails: [
      'Burn (BRN): Halves physical Attack damage and chips away 1/16 HP every turn.',
      'Paralysis (PAR): Cuts Speed in half and creates a 25% chance of being fully unable to move each turn.',
      'Poison (PSN): Takes 1/8 HP damage every turn. Toxic (Bad Poison) ramps up damage each turn (1/16, 2/16, 3/16...).',
      'Sleep (SLP): Cannot move for 1 to 3 turns.',
      'Freeze (FRZ): Cannot move, with a 20% chance to thaw each turn (or thawed immediately if hit by Fire moves).',
    ],
    advancedSummary: 'A Pokémon can only have ONE major status condition at a time. Confusion, Infatuation, and Flinching are volatile conditions that can stack.',
    advancedDetails: [
      'Abilities like Guts turn Burn into an advantage by boosting Attack by 50% while ignoring the physical damage penalty.',
      'Electric types cannot be paralyzed; Fire types cannot be burned; Poison and Steel types cannot be poisoned.',
    ],
    example: {
      title: 'Crippling a Physical Attacker',
      description: 'Using Will-O-Wisp to Burn an enemy Garchomp instantly reduces its physical offensive power by 50%!',
      attacker: 'Rotom-Wash',
      move: 'Will-O-Wisp (Status)',
      defender: 'Garchomp (Physical Sweeper)',
      result: 'Garchomp’s Attack is halved!',
    },
    interactiveTip: 'View the Battle Guide for a full rundown of status effects, weather conditions, and stat stages.',
  },
];
