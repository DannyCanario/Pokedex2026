import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { fetchPokemonList } from './services/pokeApi';
import { PokemonCard } from './components/PokemonCard';
import { PokemonDetailModal } from './components/PokemonDetailModal';
import { LanguageSelector } from './components/LanguageSelector';
import {
  Search,
  Cpu,
  Radio,
  Terminal,
  Wifi,
  Activity,
  Crosshair,
  AlertTriangle,
  X,
  Binary,
  Shield,
  Layers
} from 'lucide-react';

/* ====================================================================
   SUBCOMPONENTE: Marco HUD Táctico Reutilizable
   ==================================================================== */
const CyberHUDFrame = ({ children, color = "cyan", className = "" }) => {
  const isFuchsia = color === "fuchsia";
  const borderCol = isFuchsia ? "border-fuchsia-500" : "border-cyan-500";
  const glowCol = isFuchsia ? "shadow-[0_0_15px_rgba(217,70,239,0.2)]" : "shadow-[0_0_15px_rgba(6,182,212,0.2)]";

  return (
    <div className={`relative bg-slate-950/90 border border-slate-800 ${glowCol} ${className}`}>
      {/* Esquinas de Mira Táctica */}
      <span className={`absolute -top-0.5 -left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 ${borderCol} z-20 pointer-events-none`} />
      {children}
    </div>
  );
};

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

  // Filtrado en memoria por Nombre o ID
  const filteredPokemon = pokemonList.filter((p) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;

    const matchesName = p.name.toLowerCase().includes(query);
    const matchesId = p.id.toString() === query || `#${p.id}`.includes(query);

    return matchesName || matchesId;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative pb-20 font-mono selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Malla Holográfica de Fondo */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />

      {/* Capa de Escaneo CRT (Scanline Overlay) */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-60 z-50" />

      {/* HEADER / CONSOLA SUPERIOR HUD */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b-2 border-cyan-500/60 backdrop-blur-xl px-4 sm:px-8 py-3.5 shadow-[0_4px_30px_rgba(6,182,212,0.2)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Branding Cybernético y Telemetría de Red */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-950 border-2 border-cyan-400 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.5)] relative">
                <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fuchsia-500 rounded-full animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-cyan-400 tracking-widest uppercase flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" /> NET_OS // V4.0.2
                  </span>
                  <span className="text-[8px] px-1 py-0.2 bg-emerald-950 border border-emerald-500 text-emerald-400 font-bold rounded-xs">
                    LIVE
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black capitalize tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-100 to-fuchsia-500 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                  {t('title') || 'POKÉDEX NACIONAL'}
                </h1>
              </div>
            </div>

            {/* Micro-telemetría en móviles/móviles avanzados */}
            <div className="hidden lg:flex items-center gap-4 border-l border-cyan-900/80 pl-6 text-[10px] text-slate-400 font-bold">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>ESTADO: <strong className="text-cyan-300">MATRIZ_OK</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>MÓDULO: <strong className="text-fuchsia-300">BIO_SCAN</strong></span>
              </div>
            </div>
          </div>

          {/* Buscador Ciberpunk con Crosshair */}
          <div className="relative w-full md:w-96">
            <CyberHUDFrame color="cyan" className="p-0.5">
              <div className="relative flex items-center bg-slate-900/90">
                <Crosshair className="absolute left-3 w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder') || 'CONSULTAR NOMBRE O #ID...'}
                  className="w-full pl-9 pr-9 py-2 bg-transparent text-xs font-black text-slate-100 placeholder-slate-500 outline-none uppercase tracking-wider"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 p-1 text-slate-400 hover:text-fuchsia-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </CyberHUDFrame>
          </div>

        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 relative z-10">
        
        {/* Barra de Control de Matriz / Contador de Registro */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-sm text-xs shadow-[0_0_15px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-bold uppercase tracking-wider">REGISTROS_MATRICIALES:</span>
            <span className="text-cyan-400 font-black px-2 py-0.5 bg-cyan-950 border border-cyan-800 rounded-xs">
              {filteredPokemon.length} / {pokemonList.length}
            </span>
          </div>

          {searchTerm && (
            <div className="flex items-center gap-2 text-[11px] text-fuchsia-400 font-bold">
              <span>FILTRO_ACTIVO: "{searchTerm.toUpperCase()}"</span>
              <button
                onClick={() => setSearchTerm('')}
                className="underline hover:text-fuchsia-300 transition-colors"
              >
                [LIMPIAR]
              </button>
            </div>
          )}
        </div>

        {/* Estado de Carga Radar Cyberpunk */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-36 text-cyan-400 gap-4">
            <div className="relative flex items-center justify-center">
              <Radio className="w-16 h-16 animate-spin text-cyan-400" />
              <span className="absolute w-28 h-28 border-2 border-cyan-500/30 rounded-full animate-ping" />
              <span className="absolute w-40 h-40 border border-fuchsia-500/20 border-dashed rounded-full animate-spin" style={{ animationDuration: '15s' }} />
            </div>
            <div className="flex items-center gap-2 bg-cyan-950/90 px-4 py-2 border border-cyan-500/80 rounded-xs shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Binary className="w-4 h-4 animate-bounce" />
              <span className="tracking-widest text-xs font-black uppercase">
                [ ESCANEANDO RED NEURAL POKÉDEX... ]
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onSelect={(name) => setSelectedPokemon(name)}
                />
              ))}
            </div>

            {/* Mensaje Sin Resultados / Alerta Cyber */}
            {!loading && filteredPokemon.length === 0 && (
              <CyberHUDFrame color="fuchsia" className="p-8 text-center my-12 max-w-xl mx-auto">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-fuchsia-950/80 border border-fuchsia-500 rounded-sm shadow-[0_0_15px_rgba(217,70,239,0.4)]">
                    <AlertTriangle className="w-8 h-8 text-fuchsia-400 animate-bounce" />
                  </div>
                  <span className="text-xs font-black text-fuchsia-400 tracking-widest uppercase">
                    // ALERTA_DE_SISTEMA: NO_MATCH_FOUND
                  </span>
                  <p className="text-xs text-slate-300 font-mono">
                    No se detectó ningún nodo matricial correspondiente al término de búsqueda: <strong className="text-cyan-400">"{searchTerm}"</strong>
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-2 px-4 py-2 bg-fuchsia-950 border border-fuchsia-500 hover:bg-fuchsia-900 text-fuchsia-200 text-xs font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                  >
                    [ RESTABLECER_BÚSQUEDA ]
                  </button>
                </div>
              </CyberHUDFrame>
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