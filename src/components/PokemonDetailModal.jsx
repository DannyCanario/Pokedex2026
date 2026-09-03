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
  Target
} from 'lucide-react';

/* ====================================================================
   MAPA DE COLORES TIPO CYBERPUNK (18 Tipos Oficiales)
   ==================================================================== */
const TYPE_PALETTE = {
  normal: { bg: 'bg-zinc-950/80', border: 'border-zinc-500/60', text: 'text-zinc-300', glow: 'shadow-zinc-500/20' },
  fire: { bg: 'bg-red-950/80', border: 'border-red-500/80', text: 'text-red-400', glow: 'shadow-red-500/30' },
  water: { bg: 'bg-cyan-950/80', border: 'border-cyan-400/80', text: 'text-cyan-300', glow: 'shadow-cyan-500/30' },
  electric: { bg: 'bg-amber-950/80', border: 'border-yellow-400/80', text: 'text-yellow-300', glow: 'shadow-yellow-400/30' },
  grass: { bg: 'bg-emerald-950/80', border: 'border-emerald-500/80', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' },
  ice: { bg: 'bg-sky-950/80', border: 'border-sky-400/80', text: 'text-sky-300', glow: 'shadow-sky-400/30' },
  fighting: { bg: 'bg-orange-950/80', border: 'border-orange-600/80', text: 'text-orange-400', glow: 'shadow-orange-600/30' },
  poison: { bg: 'bg-fuchsia-950/80', border: 'border-fuchsia-500/80', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/30' },
  ground: { bg: 'bg-yellow-950/80', border: 'border-amber-600/80', text: 'text-amber-400', glow: 'shadow-amber-600/30' },
  flying: { bg: 'bg-indigo-950/80', border: 'border-indigo-400/80', text: 'text-indigo-300', glow: 'shadow-indigo-400/30' },
  psychic: { bg: 'bg-pink-950/80', border: 'border-pink-500/80', text: 'text-pink-400', glow: 'shadow-pink-500/30' },
  bug: { bg: 'bg-lime-950/80', border: 'border-lime-500/80', text: 'text-lime-400', glow: 'shadow-lime-500/30' },
  rock: { bg: 'bg-stone-900/80', border: 'border-stone-500/80', text: 'text-stone-300', glow: 'shadow-stone-500/30' },
  ghost: { bg: 'bg-purple-950/80', border: 'border-purple-500/80', text: 'text-purple-400', glow: 'shadow-purple-500/30' },
  dragon: { bg: 'bg-violet-950/80', border: 'border-violet-600/80', text: 'text-violet-400', glow: 'shadow-violet-600/30' },
  dark: { bg: 'bg-slate-950/90', border: 'border-slate-600/80', text: 'text-slate-300', glow: 'shadow-slate-600/30' },
  steel: { bg: 'bg-slate-900/80', border: 'border-teal-500/80', text: 'text-teal-300', glow: 'shadow-teal-500/30' },
  fairy: { bg: 'bg-rose-950/80', border: 'border-rose-400/80', text: 'text-rose-300', glow: 'shadow-rose-400/30' },
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
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/90 border border-cyan-800/80 hover:border-cyan-400 rounded-md cursor-help transition-all shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]">
        <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="capitalize font-mono text-xs text-slate-200 font-bold tracking-wide">
          {abilityObj.ability.name.replace(/-/g, ' ')}
        </span>
        {abilityObj.is_hidden && (
          <span className="text-[9px] font-mono font-bold text-fuchsia-400 bg-fuchsia-950/90 px-1.5 py-0.2 rounded border border-fuchsia-800/60 uppercase">
            OCULTA
          </span>
        )}
      </div>

      {isHovered && (
        <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-slate-950 border border-cyan-400/80 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] z-50 pointer-events-none animate-fadeIn backdrop-blur-xl">
          <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1 flex items-center gap-1.5 border-b border-cyan-900/60 pb-1">
            <Info className="w-3 h-3" /> // INSPECTOR_DE_HABILIDAD
          </div>
          <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
            {loading ? <span className="animate-pulse text-cyan-400">Accediendo al registro...</span> : desc}
          </p>
        </div>
      )}
    </div>
  );
};

/* ====================================================================
   SUBCOMPONENTE: Ficha de Ataque (Hover HUD)
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
      <div className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800/80 hover:border-cyan-400 rounded-md cursor-pointer transition-all hover:bg-slate-900/90 group">
        <span className="capitalize font-mono text-xs font-bold text-slate-300 group-hover:text-cyan-300 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          {moveObj.move.name.replace(/-/g, ' ')}
        </span>
        <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 bg-cyan-950/80 border border-cyan-900/80 rounded">
          {typeLabel}
        </span>
      </div>

      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-3 bg-slate-950 border border-cyan-400/90 rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.5)] z-50 pointer-events-none animate-fadeIn backdrop-blur-xl">
          {loading || !info ? (
            <div className="text-xs font-mono text-cyan-400 animate-pulse flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 animate-spin" /> Escaneando datos tácticos...
            </div>
          ) : (
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="capitalize font-bold text-sm text-slate-100">
                  {moveObj.move.name.replace(/-/g, ' ')}
                </span>
                <span className={`uppercase text-[10px] font-bold px-2 py-0.5 rounded border ${typeStyle.bg} ${typeStyle.border} ${typeStyle.text}`}>
                  {info.type}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center my-0.5">
                <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">POTENCIA</span>
                  <span className="text-cyan-400 font-bold text-xs">{info.power}</span>
                </div>
                <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">PRECISIÓN</span>
                  <span className="text-cyan-400 font-bold text-xs">{info.accuracy}</span>
                </div>
                <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px]">P.P.</span>
                  <span className="text-cyan-400 font-bold text-xs">{info.pp}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug border-t border-slate-900 pt-1.5">
                {info.es || info.en}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ====================================================================
   COMPONENTE PRINCIPAL: Modal Telemetría Cyberpunk
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

  // Filtrado de movimientos memoizado
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      {/* Marco Principal HUD */}
      <div className="relative w-full max-w-4xl bg-slate-950 border border-cyan-500/70 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.25)] text-slate-100 p-5 sm:p-6 max-h-[92vh] flex flex-col overflow-hidden clip-corner">
        
        {/* Botón Cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-900 border border-cyan-500/40 hover:border-fuchsia-500 hover:text-fuchsia-400 rounded-lg transition-all z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !detail ? (
          <div className="flex flex-col items-center justify-center py-36 font-mono text-cyan-400 animate-pulse gap-3">
            <Radio className="w-12 h-12 animate-spin text-cyan-400" />
            <span className="tracking-widest text-xs font-bold">[ INICIALIZANDO SECUENCIA DE ESCANEO... ]</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-hidden h-full">
            
            {/* Header del Escáner */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-900/60 pb-3 pr-10">
              <div className="flex items-center gap-3">
                <Terminal className="w-6 h-6 text-cyan-400" />
                <div>
                  <span className="text-[10px] font-mono text-cyan-500 tracking-widest block uppercase font-bold">
                    NODO BIO-MATRICIAL // #{String(detail.id).padStart(4, '0')}
                  </span>
                  <h2 className="text-2xl font-black font-mono capitalize tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-100 to-fuchsia-500">
                    {detail.name.replace(/-/g, ' ')}
                  </h2>
                </div>
              </div>

              {/* Botón Conmutador Shiny */}
              <button
                onClick={() => setIsShiny(!isShiny)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs font-bold border transition-all ${
                  isShiny
                    ? 'bg-fuchsia-950/90 border-fuchsia-500 text-fuchsia-300 shadow-[0_0_15px_rgba(236,72,153,0.6)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500 hover:text-cyan-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isShiny ? 'HOLOGRAMA SHINY' : 'MODO SHINY'}</span>
              </button>
            </div>

            {/* Pestañas de Navegación HUD */}
            <div className="flex gap-2 border-b border-slate-800/80 pb-2 font-mono text-xs">
              <button
                onClick={() => setActiveTab('bio')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${
                  activeTab === 'bio'
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-4 h-4" /> BIO & TELEMETRÍA
              </button>
              <button
                onClick={() => setActiveTab('moves')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${
                  activeTab === 'moves'
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sword className="w-4 h-4" /> MATRIZ DE ATAQUES
              </button>
            </div>

            {/* PANEL PRINCIPAL SCROLLABLE */}
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
              
              {/* TAB 1: BIO & STATS */}
              {activeTab === 'bio' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* COLUMNA IZQUIERDA: Visor Holo-Display + Habilidades + Variantes */}
                  <div className="md:col-span-5 flex flex-col gap-4">
                    
                    {/* Visor Holo-Display */}
                    <div className="flex flex-col items-center justify-center bg-slate-900/60 border border-cyan-900/60 p-4 rounded-xl relative overflow-hidden">
                      <img
                        src={mainImage}
                        alt={detail.name}
                        className="w-48 h-48 object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] z-10"
                      />

                      {/* Badges con Colores Oficiales del Tipo */}
                      <div className="flex gap-2 mt-4 z-10">
                        {detail.types.map((t) => {
                          const style = TYPE_PALETTE[t.type.name] || TYPE_PALETTE.normal;
                          return (
                            <span
                              key={t.type.name}
                              className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider border shadow-sm ${style.bg} ${style.border} ${style.text} ${style.glow}`}
                            >
                              {t.type.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Habilidades */}
                    <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl">
                      <span className="text-[10px] font-mono text-cyan-500 font-bold block mb-2 uppercase tracking-widest">
                        // HABILIDADES REGISTRADAS
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {detail.abilities.map((a) => (
                          <AbilityBadge key={a.ability.name} abilityObj={a} lang={language} />
                        ))}
                      </div>
                    </div>

                    {/* Formas y Variantes ubicadas directamente debajo de Habilidades */}
                    {species?.varieties && species.varieties.length > 1 && (
                      <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest block">
                          // FORMAS Y VARIANTES ({species.varieties.length})
                        </span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {species.varieties.map((v) => {
                            const isSelected = currentVariant === v.pokemon.name;
                            return (
                              <button
                                key={v.pokemon.name}
                                onClick={() => setCurrentVariant(v.pokemon.name)}
                                className={`px-3 py-1.5 rounded-md border font-mono text-xs flex items-center gap-1.5 transition-all capitalize ${
                                  isSelected
                                    ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)] font-bold'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                }`}
                              >
                                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                                <span>{v.pokemon.name.replace(/-/g, ' ')}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* COLUMNA DERECHA: Descripción + Stats */}
                  <div className="md:col-span-7 flex flex-col gap-4">
                    
                    {/* Descripción Biológica */}
                    <div className="bg-slate-900/60 border border-cyan-900/40 p-4 rounded-xl text-xs font-mono text-slate-200 shadow-inner">
                      <span className="text-[10px] text-cyan-400 font-bold block mb-2 uppercase tracking-widest flex items-center gap-1.5 border-b border-cyan-900/40 pb-1">
                        <Info className="w-3.5 h-3.5" /> // ESPECIFICACIÓN BIOLÓGICA
                      </span>
                      <p className="whitespace-normal break-words text-slate-300 leading-relaxed text-xs">
                        {flavorText}
                      </p>
                    </div>

                    {/* Barras de Estadísticas */}
                    <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest block mb-1">
                        // MEDIDORES DE ENERGÍA
                      </span>
                      {detail.stats.map((s) => {
                        const percentage = Math.min(100, Math.round((s.base_stat / 255) * 100));
                        return (
                          <div key={s.stat.name} className="flex flex-col text-[11px] font-mono">
                            <div className="flex justify-between text-slate-400 mb-0.5">
                              <span className="uppercase text-[10px]">{s.stat.name.replace('-', ' ')}</span>
                              <span className="text-cyan-400 font-bold">{s.base_stat}</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2 rounded border border-slate-800 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: ATAQUES (NIVEL / MT) */}
              {activeTab === 'moves' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-cyan-400 mb-3 flex items-center gap-2 border-b border-cyan-950 pb-1.5">
                      <BookOpen className="w-4 h-4" /> POR NIVEL ({levelMoves.length})
                    </h3>
                    <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto pr-1">
                      {levelMoves.map((m, idx) => (
                        <MoveBadge key={`lvl-${m.move.name}-${idx}`} moveObj={m} typeLabel={`NV. ${m.level}`} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono font-bold text-fuchsia-400 mb-3 flex items-center gap-2 border-b border-fuchsia-950 pb-1.5">
                      <Disc className="w-4 h-4" /> POR MÁQUINA / MT ({tmMoves.length})
                    </h3>
                    <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto pr-1">
                      {tmMoves.map((m, idx) => (
                        <MoveBadge key={`tm-${m.move.name}-${idx}`} moveObj={m} typeLabel="MT" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Pie de Modal */}
            <div className="flex items-center justify-between pt-3 border-t border-cyan-900/60 text-[10px] font-mono text-slate-500">
              <span>NODO_ACTIVO: {currentVariant.toUpperCase()}</span>
              <span className="text-cyan-500">SYSTEM_VER: 4.2.0_PRO</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};