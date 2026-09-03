const BASE_URL = 'https://pokeapi.co/api/v2';

// Cache en memoria para optimizar peticiones recurrentes
const cache = {
  details: new Map(),
  species: new Map(),
  abilities: new Map(),
  moves: new Map(),
};

export const fetchPokemonList = async (limit = 151, offset = 0) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Error recuperando lista');
  return await response.json();
};

export const fetchPokemonDetail = async (identifier) => {
  const key = String(identifier).toLowerCase();
  if (cache.details.has(key)) return cache.details.get(key);

  const response = await fetch(`${BASE_URL}/pokemon/${key}`);
  if (!response.ok) throw new Error('Pokémon no encontrado');
  const data = await response.json();
  
  cache.details.set(key, data);
  return data;
};

export const fetchPokemonSpecies = async (identifier) => {
  const key = String(identifier).toLowerCase();
  if (cache.species.has(key)) return cache.species.get(key);

  const response = await fetch(`${BASE_URL}/pokemon-species/${key}`);
  if (!response.ok) return null;
  const data = await response.json();

  cache.species.set(key, data);
  return data;
};

export const fetchAbilityDescription = async (url, lang = 'es') => {
  if (cache.abilities.has(url)) {
    const cached = cache.abilities.get(url);
    return cached[lang] || cached['en'] || 'Sin descripción';
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    const esText = data.flavor_text_entries.find((entry) => entry.language.name === 'es')?.flavor_text;
    const enText = data.flavor_text_entries.find((entry) => entry.language.name === 'en')?.flavor_text;

    const descriptions = {
      es: esText ? esText.replace(/\f|\n/g, ' ') : 'Sin descripción en español.',
      en: enText ? enText.replace(/\f|\n/g, ' ') : 'No English description available.',
    };

    cache.abilities.set(url, descriptions);
    return descriptions[lang] || descriptions['en'];
  } catch {
    return 'Error al cargar habilidad';
  }
};

export const fetchMoveDescription = async (url, lang = 'es') => {
  if (cache.moves.has(url)) {
    const cached = cache.moves.get(url);
    return cached[lang] || cached['en'];
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    const esEntry = data.flavor_text_entries?.find((e) => e.language.name === 'es');
    const enEntry = data.flavor_text_entries?.find((e) => e.language.name === 'en');

    const descriptions = {
      es: esEntry ? esEntry.flavor_text.replace(/\f|\n/g, ' ') : 'Sin descripción de movimiento.',
      en: enEntry ? enEntry.flavor_text.replace(/\f|\n/g, ' ') : 'No move description.',
      type: data.type.name,
      power: data.power || '—',
      accuracy: data.accuracy || '—',
      pp: data.pp || '—'
    };

    cache.moves.set(url, descriptions);
    return descriptions;
  } catch {
    return { es: 'Error', en: 'Error' };
  }
};