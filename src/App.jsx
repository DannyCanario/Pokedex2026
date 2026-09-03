import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { fetchPokemonList } from './services/pokeApi';
import { PokemonCard } from './components/PokemonCard';
import { PokemonDetailModal } from './components/PokemonDetailModal';
import { LanguageSelector } from './components/LanguageSelector';
import { Search, Cpu } from 'lucide-react';

const MainApp = () => {
  const { t } = useLanguage();
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      try {
        // Carga ligera de los 1025 Pokémon en 1 sola petición
        const data = await fetchPokemonList();
        const list = Array.isArray(data) ? data : (data.results || []);
        setPokemonList(list);
      } catch (err) {
        console.error('Error al inicializar la Pokédex:', err);
      } finally {
        setLoading(false);
      }
    };
    initLoad();
  }, []);

  // Filtrado instantáneo por Nombre o ID (#25, pikachu, etc.)
  const filteredPokemon = pokemonList.filter((p) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;

    const matchesName = p.name.toLowerCase().includes(query);
    const matchesId = p.id.toString() === query || `#${p.id}`.includes(query);

    return matchesName || matchesId;
  });

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 scanline relative pb-16">
      {/* Navbar futurista */}
      <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-cyber-border backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cyber-cyan animate-pulse" />
            <h1 className="text-xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-pink tracking-wider">
              {t('title') || 'POKÉDEX NACIONAL'}
            </h1>
          </div>

          {/* Buscador Ciberpunk */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-cyan" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder') || 'Buscar por nombre o #ID...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-cyber-border focus:border-cyber-cyan rounded-lg text-xs font-mono text-slate-100 outline-none focus:shadow-cyber-cyan transition-all"
            />
          </div>
        </div>
      </header>

      {/* Grid Principal */}
      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 font-mono text-cyber-cyan tracking-widest animate-pulse gap-3">
            <Cpu className="w-10 h-10 animate-spin" />
            <span>{t('loading') || 'CARGANDO REGISTRO NACIONAL (1025 POKÉMON)...'}</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onSelect={(name) => setSelectedPokemon(name)}
                />
              ))}
            </div>

            {!loading && filteredPokemon.length === 0 && (
              <div className="text-center py-20 font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
                [!] NO SE ENCONTRÓ NINGÚN REGISTRO PARA "{searchTerm}"
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Detalle */}
      <PokemonDetailModal
        pokemonName={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />

      {/* Selector de Idioma (Fijo Abajo a la Derecha) */}
      <LanguageSelector />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}