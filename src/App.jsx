import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { fetchPokemonList } from './services/pokeApi';
import { PokemonCard } from './components/PokemonCard';
import { PokemonDetailModal } from './components/PokemonDetailModal';
import { LanguageSelector } from './components/LanguageSelector';
import { Search, Cpu, Radio, Sparkles, Terminal } from 'lucide-react';

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
        const data = await fetchPokemonList();
        const list = Array.isArray(data) ? data : data.results || [];
        setPokemonList(list);
      } catch (err) {
        console.error('Error al iniciar la matriz Pokédex:', err);
      } finally {
        setLoading(false);
      }
    };
    initLoad();
  }, []);

  // Filtrado ultra-rápido en memoria por Nombre o ID
  const filteredPokemon = pokemonList.filter((p) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;

    const matchesName = p.name.toLowerCase().includes(query);
    const matchesId = p.id.toString() === query || `#${p.id}`.includes(query);

    return matchesName || matchesId;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-cyber-grid scanline-overlay relative pb-20 font-sans">
      
      {/* Header / Navbar Cyberpunk */}
      <header className="sticky top-0 z-40 bg-slate-950/85 border-b border-cyan-900/80 backdrop-blur-md px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Título & Estado del Sistema */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fuchsia-500 rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-fuchsia-500 tracking-wider">
                {t('title') || 'POKÉDEX NACIONAL v4.0'}
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500/80">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>NODO RED ACTIVO // {pokemonList.length} UNIDADES</span>
              </div>
            </div>
          </div>

          {/* Buscador Ciberpunk */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder') || 'Buscar por nombre o #ID...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-cyan-900 focus:border-cyan-400 rounded-lg text-xs font-mono text-slate-100 outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            />
          </div>
        </div>
      </header>

      {/* Rejilla Principal */}
      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 font-mono text-cyan-400 tracking-widest gap-4">
            <Cpu className="w-12 h-12 animate-spin text-cyan-400" />
            <span className="animate-pulse">[ CARGANDO MATRIZ DE POKÉMON (1025 NODOS)... ]</span>
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
              <div className="text-center py-20 font-mono text-slate-500 border border-dashed border-cyan-900/60 rounded-xl bg-slate-900/40">
                <Terminal className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
                [!] NO SE ENCONTRÓ NINGÚN REGISTRO MATRICIAL PARA "{searchTerm}"
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

      {/* Selector de Idioma Flotante */}
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