import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv';

async function fetchCSV(filename) {
  console.log(`Fetching ${filename}...`);
  const res = await fetch(`${BASE_URL}/${filename}`);
  if (!res.ok) throw new Error(`Failed to fetch ${filename}: ${res.statusText}`);
  const text = await res.text();
  return parseCSV(text);
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return [];
  const header = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row = {};
    for (let j = 0; j < header.length; j++) {
      row[header[j]] = values[j] !== undefined ? values[j] : '';
    }
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function formatName(identifier) {
  if (!identifier) return '';
  return identifier
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function main() {
  const outDir = path.resolve(__dirname, '../src/data/generated');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Downloading PokeAPI master data tables...');

  const [
    pokemonRaw,
    pokemonTypesRaw,
    pokemonStatsRaw,
    pokemonAbilitiesRaw,
    pokemonSpeciesRaw,
    pokemonSpeciesNamesRaw,
    typesRaw,
    movesRaw,
    moveNamesRaw,
    moveEffectProseRaw,
    moveFlagsRaw,
    moveFlagMapRaw,
    moveChangelogRaw,
    abilitiesRaw,
    abilityNamesRaw,
    abilityProseRaw,
  ] = await Promise.all([
    fetchCSV('pokemon.csv'),
    fetchCSV('pokemon_types.csv'),
    fetchCSV('pokemon_stats.csv'),
    fetchCSV('pokemon_abilities.csv'),
    fetchCSV('pokemon_species.csv'),
    fetchCSV('pokemon_species_names.csv'),
    fetchCSV('types.csv'),
    fetchCSV('moves.csv'),
    fetchCSV('move_names.csv'),
    fetchCSV('move_effect_prose.csv'),
    fetchCSV('move_flags.csv'),
    fetchCSV('move_flag_map.csv'),
    fetchCSV('move_changelog.csv'),
    fetchCSV('abilities.csv'),
    fetchCSV('ability_names.csv'),
    fetchCSV('ability_prose.csv'),
  ]);

  console.log('Processing Types...');
  const typeMap = {};
  for (const t of typesRaw) {
    typeMap[t.id] = t.identifier.toLowerCase();
  }

  console.log('Processing Moves...');
  const moveNamesMap = {};
  for (const m of moveNamesRaw) {
    if (m.local_language_id === '9') { // English
      moveNamesMap[m.move_id] = m.name;
    }
  }

  const moveProseMap = {};
  for (const p of moveEffectProseRaw) {
    if (p.local_language_id === '9') {
      moveProseMap[p.move_effect_id] = {
        short: p.short_effect || '',
        detailed: p.effect || '',
      };
    }
  }

  const moveFlagNames = {};
  for (const f of moveFlagsRaw) {
    moveFlagNames[f.id] = f.identifier;
  }

  const moveFlagsAssigned = {};
  for (const m of moveFlagMapRaw) {
    if (!moveFlagsAssigned[m.move_id]) moveFlagsAssigned[m.move_id] = {};
    const flagName = moveFlagNames[m.move_flag_id];
    if (flagName) {
      if (flagName === 'contact') moveFlagsAssigned[m.move_id].contact = true;
      if (flagName === 'protect') moveFlagsAssigned[m.move_id].protect = true;
      if (flagName === 'sound') moveFlagsAssigned[m.move_id].sound = true;
      if (flagName === 'punch') moveFlagsAssigned[m.move_id].punch = true;
      if (flagName === 'bite') moveFlagsAssigned[m.move_id].bite = true;
      if (flagName === 'heal') moveFlagsAssigned[m.move_id].heal = true;
      if (flagName === 'defrost') moveFlagsAssigned[m.move_id].defrost = true;
    }
  }

  const moveChangelogs = {};
  for (const c of moveChangelogRaw) {
    if (!moveChangelogs[c.move_id]) moveChangelogs[c.move_id] = [];
    moveChangelogs[c.move_id].push({
      versionGroupId: Number(c.changed_in_version_group_id),
      power: c.power ? Number(c.power) : undefined,
      accuracy: c.accuracy ? Number(c.accuracy) : undefined,
      pp: c.pp ? Number(c.pp) : undefined,
      effectChance: c.effect_chance ? Number(c.effect_chance) : undefined,
    });
  }

  const damageClasses = { '1': 'status', '2': 'physical', '3': 'special' };
  const targetMap = {
    '1': 'Specific Move',
    '2': 'Selected Pokémon Me First',
    '3': 'Random Opponent',
    '4': 'All Opponents',
    '5': 'All Other Pokémon',
    '6': 'User',
    '7': 'Both Sides',
    '8': 'User Side',
    '9': 'Opponents Field',
    '10': 'User Partner',
    '11': 'Single Target',
    '12': 'Entire Field',
    '13': 'Opponent',
    '14': 'User and All Allies',
  };

  const processedMoves = [];
  for (const m of movesRaw) {
    const id = Number(m.id);
    if (!id || id > 10000) continue; // Skip shadow or max moves if wanted, include all 900+ main moves
    const type = typeMap[m.type_id] || 'normal';
    const prose = moveProseMap[m.effect_id] || { short: '', detailed: '' };
    const power = m.power ? Number(m.power) : null;
    const accuracy = m.accuracy ? Number(m.accuracy) : null;
    const pp = m.pp ? Number(m.pp) : 0;
    const priority = Number(m.priority || 0);
    const category = damageClasses[m.damage_class_id] || 'status';
    const effectChance = m.effect_chance ? Number(m.effect_chance) : null;

    let shortDesc = prose.short;
    if (effectChance !== null && shortDesc.includes('$effect_chance%')) {
      shortDesc = shortDesc.replace('$effect_chance%', `${effectChance}%`);
    }

    processedMoves.push({
      id,
      name: m.identifier,
      displayName: moveNamesMap[m.id] || formatName(m.identifier),
      type,
      category,
      power,
      accuracy,
      pp,
      priority,
      target: targetMap[m.target_id] || 'Single Target',
      generation: Number(m.generation_id),
      shortDescription: shortDesc || 'No additional effect.',
      effectDescription: prose.detailed.replace(/\$effect_chance%/g, `${effectChance || 0}%`) || shortDesc,
      effectChance,
      flags: moveFlagsAssigned[m.id] || {},
      historicalChanges: moveChangelogs[m.id] || [],
    });
  }

  console.log(`Processed ${processedMoves.length} moves.`);

  console.log('Processing Abilities...');
  const abilityNamesMap = {};
  for (const a of abilityNamesRaw) {
    if (a.local_language_id === '9') {
      abilityNamesMap[a.ability_id] = a.name;
    }
  }

  const abilityProseMap = {};
  for (const p of abilityProseRaw) {
    if (p.local_language_id === '9') {
      abilityProseMap[p.ability_id] = {
        short: p.short_effect || '',
        detailed: p.effect || '',
      };
    }
  }

  const processedAbilities = [];
  for (const a of abilitiesRaw) {
    const id = Number(a.id);
    if (!id || id > 10000) continue;
    const prose = abilityProseMap[a.id] || { short: '', detailed: '' };
    processedAbilities.push({
      id,
      name: a.identifier,
      displayName: abilityNamesMap[a.id] || formatName(a.identifier),
      generation: Number(a.generation_id),
      shortDescription: prose.short || 'No in-depth description available.',
      effectDescription: prose.detailed || prose.short || 'In-battle ability.',
    });
  }

  console.log(`Processed ${processedAbilities.length} abilities.`);

  console.log('Processing Pokémon Species & Data...');
  const speciesMap = {};
  for (const s of pokemonSpeciesRaw) {
    speciesMap[s.id] = {
      generationId: Number(s.generation_id),
      isLegendary: s.is_legendary === '1',
      isMythical: s.is_mythical === '1',
      evolutionChainId: s.evolution_chain_id ? Number(s.evolution_chain_id) : null,
      evolvesFromSpeciesId: s.evolves_from_species_id ? Number(s.evolves_from_species_id) : null,
    };
  }

  const speciesGeneraMap = {};
  for (const sn of pokemonSpeciesNamesRaw) {
    if (sn.local_language_id === '9') {
      speciesGeneraMap[sn.pokemon_species_id] = sn.genus;
    }
  }

  const typesByPokemon = {};
  for (const pt of pokemonTypesRaw) {
    if (!typesByPokemon[pt.pokemon_id]) typesByPokemon[pt.pokemon_id] = [];
    typesByPokemon[pt.pokemon_id].push({
      type: typeMap[pt.type_id] || 'normal',
      slot: Number(pt.slot),
    });
  }

  const statsByPokemon = {};
  for (const ps of pokemonStatsRaw) {
    if (!statsByPokemon[ps.pokemon_id]) statsByPokemon[ps.pokemon_id] = {};
    const val = Number(ps.base_stat);
    const statId = ps.stat_id;
    if (statId === '1') statsByPokemon[ps.pokemon_id].hp = val;
    if (statId === '2') statsByPokemon[ps.pokemon_id].attack = val;
    if (statId === '3') statsByPokemon[ps.pokemon_id].defense = val;
    if (statId === '4') statsByPokemon[ps.pokemon_id].specialAttack = val;
    if (statId === '5') statsByPokemon[ps.pokemon_id].specialDefense = val;
    if (statId === '6') statsByPokemon[ps.pokemon_id].speed = val;
  }

  const abilitiesByPokemon = {};
  for (const pa of pokemonAbilitiesRaw) {
    if (!abilitiesByPokemon[pa.pokemon_id]) abilitiesByPokemon[pa.pokemon_id] = [];
    const abId = pa.ability_id;
    const abName = abilityNamesMap[abId] || formatName(pa.identifier || '');
    abilitiesByPokemon[pa.pokemon_id].push({
      id: Number(abId),
      name: abName,
      isHidden: pa.is_hidden === '1',
      slot: Number(pa.slot),
    });
  }

  const processedPokemon = [];
  for (const p of pokemonRaw) {
    const id = Number(p.id);
    const speciesId = p.species_id;
    const species = speciesMap[speciesId] || { generationId: 1, isLegendary: false, isMythical: false };

    // Sort types by slot
    const pokeTypes = (typesByPokemon[p.id] || [])
      .sort((a, b) => a.slot - b.slot)
      .map(t => t.type);

    const s = statsByPokemon[p.id] || { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 };
    const total = (s.hp || 0) + (s.attack || 0) + (s.defense || 0) + (s.specialAttack || 0) + (s.specialDefense || 0) + (s.speed || 0);

    const isRegional = p.identifier.includes('-alola') || p.identifier.includes('-galar') || p.identifier.includes('-hisui') || p.identifier.includes('-paldea');
    const isMega = p.identifier.includes('-mega');

    processedPokemon.push({
      id,
      name: formatName(p.identifier),
      slug: p.identifier,
      speciesId: Number(speciesId),
      types: pokeTypes.length > 0 ? pokeTypes : ['normal'],
      stats: {
        hp: s.hp || 0,
        attack: s.attack || 0,
        defense: s.defense || 0,
        specialAttack: s.specialAttack || 0,
        specialDefense: s.specialDefense || 0,
        speed: s.speed || 0,
        total,
      },
      generation: species.generationId || 1,
      height: Number(p.height) / 10, // meters
      weight: Number(p.weight) / 10, // kg
      species: speciesGeneraMap[speciesId] || 'Pokémon',
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      abilities: (abilitiesByPokemon[p.id] || []).map(a => ({ name: a.name, isHidden: a.isHidden })),
      isLegendary: species.isLegendary,
      isMythical: species.isMythical,
      isRegional,
      isMega,
    });
  }

  console.log(`Processed ${processedPokemon.length} Pokémon entries.`);

  console.log('Writing files to src/data/generated/...');
  fs.writeFileSync(path.join(outDir, 'pokemonList.json'), JSON.stringify(processedPokemon));
  fs.writeFileSync(path.join(outDir, 'movesList.json'), JSON.stringify(processedMoves));
  fs.writeFileSync(path.join(outDir, 'abilitiesList.json'), JSON.stringify(processedAbilities));

  console.log('Successfully generated complete datasets!');
}

main().catch(err => {
  console.error('Data generation error:', err);
  process.exit(1);
});
