import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchPokemonDetail,
  fetchPokemonSpecies,
  fetchAbilityDescription,
  fetchMoveDescription,
} from '../services/pokeApi';
import {
  X,
  Activity,
  Cpu,
  Terminal,
  Zap,
  Sparkles,
  BookOpen,
  Layers,
  Sword,
  Disc,
  Info,
  Radio,
  Target,
  Shield,
  Wifi,
  Crosshair,
  AlertCircle,
  Binary
} from 'lucide-react';

/* ====================================================================
   MAPA DE COLORES TIPO CYBERPUNK HIGH-NEON (18 Tipos Oficiales)
   ==================================================================== */
const TYPE_PALETTE = {
  normal: { bg: 'bg-zinc-950/90', border: 'border-zinc-500', text: 'text-zinc-200', glow: 'shadow-[0_0_15px_rgba(161,161,170,0.4)]' },
  fire: { bg: 'bg-red-950/90', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
  water: { bg: 'bg-cyan-950/90', border: 'border-cyan-400', text: 'text-cyan-300', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]' },
  electric: { bg: 'bg-yellow-950/90', border: 'border-yellow-400', text: 'text-yellow-300', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]' },
  grass: { bg: 'bg-emerald-950/90', border: 'border-emerald-400', text: 'text-emerald-300', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]' },
  ice: { bg: 'bg-sky-950/90', border: 'border-sky-300', text: 'text-sky-200', glow: 'shadow-[0_0_15px_rgba(125,211,252,0.5)]' },
  fighting: { bg: 'bg-orange-950/90', border: 'border-orange-500', text: 'text-orange-400', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]' },
  poison: { bg: 'bg-fuchsia-950/90', border: 'border-fuchsia-500', text: 'text-fuchsia-300', glow: 'shadow-[0_0_15px_rgba(217,70,239,0.5)]' },
  ground: { bg: 'bg-amber-950/90', border: 'border-amber-500', text: 'text-amber-300', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
  flying: { bg: 'bg-indigo-950/90', border: 'border-indigo-400', text: 'text-indigo-300', glow: 'shadow-[0_0_15px_rgba(129,140,248,0.5)]' },
  psychic: { bg: 'bg-pink-950/90', border: 'border-pink-500', text: 'text-pink-300', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.5)]' },
  bug: { bg: 'bg-lime-950/90', border: 'border-lime-400', text: 'text-lime-300', glow: 'shadow-[0_0_15px_rgba(163,230,53,0.5)]' },
  rock: { bg: 'bg-stone-950/90', border: 'border-stone-400', text: 'text-stone-300', glow: 'shadow-[0_0_15px_rgba(168,162,158,0.5)]' },
  ghost: { bg: 'bg-purple-950/90', border: 'border-purple-400', text: 'text-purple-300', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.5)]' },
  dragon: { bg: 'bg-violet-950/90', border: 'border-violet-500', text: 'text-violet-300', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]' },
  dark: { bg: 'bg-slate-950/95', border: 'border-slate-500', text: 'text-slate-300', glow: 'shadow-[0_0_15px_rgba(100,116,139,0.5)]' },
  steel: { bg: 'bg-teal-950/90', border: 'border-teal-400', text: 'text-teal-200', glow: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]' },
  fairy: { bg: 'bg-rose-950/90', border: 'border-rose-400', text: 'text-rose-300', glow: 'shadow-[0_0_15px_rgba(251,113,133,0.5)]' },
};

/* ====================================================================
   SUBCOMPONENTE: Adorno HUD Cybernético de Esquinas
   ==================================================================== */
const CyberHUDFrame = ({ children, color = "cyan", className = "" }) => {
  const isFuchsia = color === "fuchsia";
  const borderCol = isFuchsia ? "border-fuchsia-500" : "border-cyan-500";
  const glowCol = isFuchsia ? "shadow-[0_0_15px_rgba(217,70,239,0.2)]" : "shadow-[0_0_15px_rgba(6,182,212,0.2)]";

  return (
    <div className={`relative bg-slate-950/90 border border-slate-800 ${glowCol} ${className}`}>
      {/* Marcadores de Esquina Tácticos */}
      <span className={`absolute -top-0.5 -left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 ${borderCol} z-20 pointer-events-none`} />
      
      {/* Remaches HUD */}
      <span className="absolute top-1 right-3 text-[8px] font-mono text-slate-700 pointer-events-none select-none">
        0x88_HUD
      </span>
      {children}
    </div>
  );
};

/* ====================================================================
   SUBCOMPONENTE: Badge de Habilidad con Inspector Flotante
   ==================================================================== */
const AbilityBadge = ({ abilityObj, lang }) => {
  const [desc, setDesc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (!desc && !loading) {
      setLoading(true);
      const text = await fetchAbilityDescription(abilityObj.ability.url, lang);
      setDesc(text);
      setLoading(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-cyan-500/50 hover:border-cyan-300 rounded-sm cursor-help transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] group">
        <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="capitalize font-mono text-xs text-slate-200 font-bold tracking-wider group-hover:text-cyan-300">
          {abilityObj.ability.name.replace(/-/g, ' ')}
        </span>
        {abilityObj.is_hidden && (
          <span className="text-[9px] font-mono font-black text-fuchsia-400 bg-fuchsia-950/90 px-1.5 py-0.5 rounded-sm border border-fuchsia-500/80 uppercase tracking-widest shadow-[0_0_8px_rgba(217,70,239,0.4)]">
            [OCULTA]
          </span>
        )}
      </div>

      {isHovered && (
        <div className="absolute bottom-full left-0 mb-2 w-72 p-3.5 bg-slate-950 border-2 border-cyan-400 rounded shadow-[0_0_30px_rgba(6,182,212,0.6)] z-50 pointer-events-none animate-fadeIn backdrop-blur-2xl">
          <CyberHUDFrame color="cyan">
            <div className="p-2">
              <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1.5 flex items-center justify-between border-b border-cyan-900/80 pb-1">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-cyan-400" /> // INSPECTOR_HABILIDAD
                </span>
                <span className="text-[9px] text-emerald-400">[DATOS_OK]</span>
              </div>
              <p className="text-[11px] font-mono text-slate-200 leading-relaxed">
                {loading ? <span className="animate-pulse text-cyan-400">[ ESCANEANDO DIRECCIÓN MEMORIA... ]</span> : desc}
              </p>
            </div>
          </CyberHUDFrame>
        </div>
      )}
    </div>
  );
};

/* ====================================================================
   SUBCOMPONENTE: Ficha de Ataque (Hover HUD Táctico)
   ==================================================================== */
const MoveBadge = ({ moveObj, typeLabel }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (!info && !loading) {
      setLoading(true);
      const data = await fetchMoveDescription(moveObj.move.url);
      setInfo(data);
      setLoading(false);
    }
  };

  const typeStyle = info ? TYPE_PALETTE[info.type] || TYPE_PALETTE.normal : TYPE_PALETTE.normal;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between p-2.5 bg-slate-950/90 border border-slate-800 hover:border-cyan-400 rounded-sm cursor-pointer transition-all hover:bg-slate-900 group shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        <span className="capitalize font-mono text-xs font-bold text-slate-300 group-hover:text-cyan-300 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          {moveObj.move.name.replace(/-/g, ' ')}
        </span>
        <span className="text-[10px] font-mono text-cyan-400 font-black px-2 py-0.5 bg-cyan-950/90 border border-cyan-800/90 rounded-sm tracking-wider">
          {typeLabel}
        </span>
      </div>

      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 z-50 pointer-events-none animate-fadeIn">
          <CyberHUDFrame color="cyan" className="p-3 bg-slate-950/95 border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.6)]">
            {loading || !info ? (
              <div className="text-xs font-mono text-cyan-400 animate-pulse flex items-center justify-center gap-2 py-2">
                <Cpu className="w-4 h-4 animate-spin" /> [ ESCANEANDO MATRIZ DE ATAQUE... ]
              </div>
            ) : (
              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="capitalize font-black text-sm text-slate-100 flex items-center gap-1.5 tracking-wider">
                    <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" />
                    {moveObj.move.name.replace(/-/g, ' ')}
                  </span>
                  <span className={`uppercase text-[10px] font-black px-2 py-0.5 rounded border ${typeStyle.bg} ${typeStyle.border} ${typeStyle.text} ${typeStyle.glow}`}>
                    {info.type}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center my-1">
                  <div className="bg-slate-900 p-1.5 rounded border border-cyan-900/60">
                    <span className="text-slate-500 block text-[8px] font-bold">PWR</span>
                    <span className="text-cyan-400 font-black text-sm">{info.power}</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-cyan-900/60">
                    <span className="text-slate-500 block text-[8px] font-bold">ACC</span>
                    <span className="text-cyan-400 font-black text-sm">{info.accuracy}</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-cyan-900/60">
                    <span className="text-slate-500 block text-[8px] font-bold">PP</span>
                    <span className="text-cyan-400 font-black text-sm">{info.pp}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-900 pt-1.5 font-sans">
                  {info.es || info.en}
                </p>
              </div>
            )}
          </CyberHUDFrame>
        </div>
      )}
    </div>
  );
};

/* ====================================================================
   COMPONENTE PRINCIPAL: Modal Telemetría Cyberpunk Ultra-Avanzado
   ==================================================================== */
export const PokemonDetailModal = ({ pokemonName, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('bio');
  const [currentVariant, setCurrentVariant] = useState(pokemonName);
  const [isShiny, setIsShiny] = useState(false);

  const [detail, setDetail] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentVariant(pokemonName);
    setIsShiny(false);
    setActiveTab('bio');
  }, [pokemonName]);

  useEffect(() => {
    if (!currentVariant) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const detailData = await fetchPokemonDetail(currentVariant);
        setDetail(detailData);

        const speciesData = await fetchPokemonSpecies(
          detailData.species?.name || currentVariant
        );
        setSpecies(speciesData);
      } catch (err) {
        console.error('Error al cargar datos del bio-escáner:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentVariant]);

  // Filtrado memoizado de movimientos
  const { levelMoves, tmMoves } = useMemo(() => {
    if (!detail?.moves) return { levelMoves: [], tmMoves: [] };

    const level = [];
    const tm = [];

    detail.moves.forEach((m) => {
      const lastDetails = m.version_group_details[m.version_group_details.length - 1];
      if (!lastDetails) return;

      const method = lastDetails.move_learn_method?.name;
      if (method === 'level-up') {
        level.push({
          move: m.move,
          level: lastDetails.level_learned_at || 0,
        });
      } else if (method === 'machine') {
        tm.push({ move: m.move });
      }
    });

    return {
      levelMoves: level.sort((a, b) => a.level - b.level),
      tmMoves: tm,
    };
  }, [detail]);

  if (!pokemonName) return null;

  const flavorText =
    species?.flavor_text_entries?.find((e) => e.language.name === 'es')?.flavor_text.replace(/\f|\n/g, ' ') ||
    species?.flavor_text_entries?.find((e) => e.language.name === 'en')?.flavor_text.replace(/\f|\n/g, ' ') ||
    'Registro descriptivo no disponible en el mainframe.';

  const mainImage = isShiny
    ? detail?.sprites?.other?.['official-artwork']?.front_shiny ||
      detail?.sprites?.front_shiny
    : detail?.sprites?.other?.['official-artwork']?.front_default ||
      detail?.sprites?.front_default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      
      {/* Contenedor Principal HUD militar sci-fi */}
      <div className="relative w-full max-w-4xl bg-slate-950 border-2 border-cyan-500/80 rounded-lg shadow-[0_0_60px_rgba(6,182,212,0.3)] text-slate-100 p-4 sm:p-6 max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Efecto Scanlines / Pantalla CRT */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-70 z-20" />

        {/* Botón Cierre Cyber */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-900 border-2 border-cyan-500/60 hover:border-fuchsia-500 hover:text-fuchsia-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.8)] rounded transition-all z-30 group"
        >
          <X className="w-5 h-5 text-cyan-400 group-hover:text-fuchsia-400 transition-colors" />
        </button>

        {loading || !detail ? (
          <div className="flex flex-col items-center justify-center py-40 font-mono text-cyan-400 gap-4">
            <div className="relative flex items-center justify-center">
              <Radio className="w-16 h-16 animate-spin text-cyan-400" />
              <span className="absolute w-28 h-28 border-2 border-cyan-500/40 rounded-full animate-ping" />
            </div>
            <div className="flex items-center gap-2 bg-cyan-950/80 px-4 py-1.5 border border-cyan-500/60 rounded">
              <Binary className="w-4 h-4 animate-bounce" />
              <span className="tracking-widest text-xs font-black">[ INICIALIZANDO ESCÁNER NEURAL... ]</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-hidden h-full z-10">
            
            {/* Header del Escáner Cybernético */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-cyan-900/80 pb-3 pr-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-950 border-2 border-cyan-400 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Terminal className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-black flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" /> BIO_NODE // #{String(detail.id).padStart(4, '0')}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded font-bold">
                      SYSTEM_OK
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-mono capitalize tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-100 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    {detail.name.replace(/-/g, ' ')}
                  </h2>
                </div>
              </div>

              {/* Botón Conmutador Shiny */}
              <button
                onClick={() => setIsShiny(!isShiny)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded font-mono text-xs font-black border-2 transition-all ${
                  isShiny
                    ? 'bg-fuchsia-950 border-fuchsia-500 text-fuchsia-200 shadow-[0_0_25px_rgba(236,72,153,0.8)]'
                    : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                <span>{isShiny ? 'HOLOGRAMA SHINY [ACTIVO]' : 'MODO SHINY'}</span>
              </button>
            </div>

            {/* Pestañas de Navegación HUD */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 font-mono text-xs">
              <button
                onClick={() => setActiveTab('bio')}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm border-2 transition-all font-black tracking-wider ${
                  activeTab === 'bio'
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Activity className="w-4 h-4 text-cyan-400" /> BIO & TELEMETRÍA
              </button>
              <button
                onClick={() => setActiveTab('moves')}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm border-2 transition-all font-black tracking-wider ${
                  activeTab === 'moves'
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Sword className="w-4 h-4 text-cyan-400" /> MATRIZ DE ATAQUES
              </button>
            </div>

            {/* PANEL PRINCIPAL SCROLLABLE */}
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
              
              {/* TAB 1: BIO & STATS */}
              {activeTab === 'bio' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* COLUMNA IZQUIERDA: Visor Holo-Display + Habilidades + Variantes */}
                  <div className="md:col-span-5 flex flex-col gap-4">
                    
                    {/* Visor Holo-Display Cybernético */}
                    <CyberHUDFrame color="cyan" className="p-4 flex flex-col items-center justify-center overflow-hidden">
                      {/* Mira Holo-Táctica */}
                      <div className="absolute w-48 h-48 rounded-full border border-cyan-500/20 border-dashed animate-[spin_25s_linear_infinite] pointer-events-none" />
                      <div className="absolute w-36 h-36 rounded-full border border-fuchsia-500/30 border-dashed animate-[spin_12s_linear_infinite_reverse] pointer-events-none" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-transparent to-transparent pointer-events-none" />

                      <img
                        src={mainImage}
                        alt={detail.name}
                        className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] z-10 transition-transform duration-300 hover:scale-105"
                      />

                      {/* Badges de Tipos */}
                      <div className="flex gap-2 mt-4 z-10">
                        {detail.types.map((t) => {
                          const style = TYPE_PALETTE[t.type.name] || TYPE_PALETTE.normal;
                          return (
                            <span
                              key={t.type.name}
                              className={`px-3 py-1 rounded-sm text-xs font-mono font-black uppercase tracking-widest border-2 ${style.bg} ${style.border} ${style.text} ${style.glow}`}
                            >
                              {t.type.name}
                            </span>
                          );
                        })}
                      </div>
                    </CyberHUDFrame>

                    {/* Habilidades Registradas */}
                    <CyberHUDFrame color="cyan" className="p-3">
                      <span className="text-[10px] font-mono text-cyan-400 font-black block mb-2 uppercase tracking-widest flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> // HABILIDADES_REGISTRADAS
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {detail.abilities.map((a) => (
                          <AbilityBadge key={a.ability.name} abilityObj={a} lang={language} />
                        ))}
                      </div>
                    </CyberHUDFrame>

                    {/* Formas y Variantes (Ubicado justo debajo de Habilidades) */}
                    {species?.varieties && species.varieties.length > 1 && (
                      <CyberHUDFrame color="cyan" className="p-3">
                        <span className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" /> // FORMAS_Y_VARIANTES ({species.varieties.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {species.varieties.map((v) => {
                            const isSelected = currentVariant === v.pokemon.name;
                            return (
                              <button
                                key={v.pokemon.name}
                                onClick={() => setCurrentVariant(v.pokemon.name)}
                                className={`px-3 py-1.5 rounded-sm border-2 font-mono text-xs flex items-center gap-1.5 transition-all capitalize font-bold ${
                                  isSelected
                                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] font-black'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                }`}
                              >
                                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                                <span>{v.pokemon.name.replace(/-/g, ' ')}</span>
                              </button>
                            );
                          })}
                        </div>
                      </CyberHUDFrame>
                    )}

                  </div>

                  {/* COLUMNA DERECHA: Descripción + Stats */}
                  <div className="md:col-span-7 flex flex-col gap-4">
                    
                    {/* Descripción Biológica */}
                    <CyberHUDFrame color="cyan" className="p-4">
                      <span className="text-[10px] text-cyan-400 font-black block mb-2 uppercase tracking-widest flex items-center gap-1.5 border-b border-cyan-900/80 pb-1">
                        <Info className="w-3.5 h-3.5" /> // ESPECIFICACIÓN_BIOLÓGICA
                      </span>
                      <p className="whitespace-normal break-words text-slate-200 leading-relaxed font-mono text-xs">
                        {flavorText}
                      </p>
                    </CyberHUDFrame>

                    {/* Barras de Estadísticas Tácticas Segmentadas */}
                    <CyberHUDFrame color="cyan" className="p-4 flex flex-col gap-3">
                      <span className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-widest block flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" /> // MEDIDORES_DE_ENERGÍA
                      </span>
                      {detail.stats.map((s) => {
                        const val = s.base_stat;
                        const blocks = Math.min(20, Math.round((val / 255) * 20));
                        return (
                          <div key={s.stat.name} className="flex flex-col text-[11px] font-mono">
                            <div className="flex justify-between text-slate-300 mb-1 font-bold">
                              <span className="uppercase text-[10px] tracking-wider text-slate-400">{s.stat.name.replace('-', ' ')}</span>
                              <span className="text-cyan-400 font-black">{val} <span className="text-[9px] text-slate-600">/ 255</span></span>
                            </div>
                            {/* Bloques Tácticos Cybernéticos */}
                            <div className="flex gap-1 bg-slate-900 p-1 rounded-sm border border-slate-800">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-2 flex-1 rounded-xs transition-all duration-300 ${
                                    i < blocks
                                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                                      : 'bg-slate-950 border border-slate-800/80'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </CyberHUDFrame>

                  </div>

                </div>
              )}

              {/* TAB 2: ATAQUES (NIVEL / MT) */}
              {activeTab === 'moves' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CyberHUDFrame color="cyan" className="p-3">
                    <h3 className="text-xs font-mono font-black text-cyan-400 mb-3 flex items-center gap-2 border-b border-cyan-900 pb-2 tracking-wider">
                      <BookOpen className="w-4 h-4 text-cyan-400" /> POR NIVEL ({levelMoves.length})
                    </h3>
                    <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                      {levelMoves.map((m, idx) => (
                        <MoveBadge key={`lvl-${m.move.name}-${idx}`} moveObj={m} typeLabel={`NV. ${m.level}`} />
                      ))}
                    </div>
                  </CyberHUDFrame>

                  <CyberHUDFrame color="fuchsia" className="p-3">
                    <h3 className="text-xs font-mono font-black text-fuchsia-400 mb-3 flex items-center gap-2 border-b border-fuchsia-900 pb-2 tracking-wider">
                      <Disc className="w-4 h-4 text-fuchsia-400" /> POR MÁQUINA / MT ({tmMoves.length})
                    </h3>
                    <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                      {tmMoves.map((m, idx) => (
                        <MoveBadge key={`tm-${m.move.name}-${idx}`} moveObj={m} typeLabel="MT" />
                      ))}
                    </div>
                  </CyberHUDFrame>
                </div>
              )}

            </div>

            {/* Pie de Modal HUD Táctico */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-cyan-900/80 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                NODO_ACTIVO: <strong className="text-slate-200">{currentVariant.toUpperCase()}</strong>
              </span>
              <span className="text-cyan-400 font-black tracking-widest">[ CYBER_PEX_V5.0 ]</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};