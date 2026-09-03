const BASE_URL = 'https://pokeapi.co/api/v2';
export const TOTAL_POKEMON = 1025;

// Caché en memoria para optimizar peticiones recurrentes
const cache = {
  details: new Map(),
  species: new Map(),
  abilities: new Map(),
  moves: new Map(),
};

/**
 * Obtiene la lista base de Pokémon.
 * Mantiene la estructura { count, results } para compatibilidad con tu App.jsx.
 */
export const fetchPokemonList = async (limit = TOTAL_POKEMON, offset = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Error recuperando lista de Pokémon');

    const data = await response.json();

    // Mapeamos los resultados para asegurar ID, Imagen HD e hipercompatibilidad con sprites
    const mappedResults = data.results.map((pokemon) => {
      const urlParts = pokemon.url.split('/').filter(Boolean);
      const id = parseInt(urlParts[urlParts.length - 1], 10);
      const officialArtworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

      return {
        id,
        name: pokemon.name,
        url: pokemon.url,
        // Ruta directa a la ilustración oficial en alta calidad
        image: officialArtworkUrl,
        // Objeto de compatibilidad si algún componente busca 'sprites.front_default' o 'sprites.other'
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          other: {
            'official-artwork': {
              front_default: officialArtworkUrl,
            },
          },
        },
      };
    });

    return {
      count: data.count,
      results: mappedResults,
    };
  } catch (error) {
    console.error('Error en fetchPokemonList:', error);
    return { count: 0, results: [] };
  }
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

    const esText = data.flavor_text_entries?.find((entry) => entry.language.name === 'es')?.flavor_text;
    const enText = data.flavor_text_entries?.find((entry) => entry.language.name === 'en')?.flavor_text;

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

export const fetchMoveDescription = async (url) => {
  if (cache.moves.has(url)) {
    return cache.moves.get(url);
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    const esEntry = data.flavor_text_entries?.find((e) => e.language.name === 'es');
    const enEntry = data.flavor_text_entries?.find((e) => e.language.name === 'en');

    const moveInfo = {
      es: esEntry ? esEntry.flavor_text.replace(/\f|\n/g, ' ') : 'Sin descripción de movimiento.',
      en: enEntry ? enEntry.flavor_text.replace(/\f|\n/g, ' ') : 'No move description.',
      type: data.type?.name || 'normal',
      power: data.power ?? '—',
      accuracy: data.accuracy ?? '—',
      pp: data.pp ?? '—',
      damageClass: data.damage_class?.name || null,
    };

    cache.moves.set(url, moveInfo);
    return moveInfo;
  } catch {
    return { es: 'Error de carga', en: 'Load error' };
  }
};