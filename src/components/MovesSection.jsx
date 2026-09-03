import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchMoveDescription } from '../services/pokeApi';
import { Tooltip } from './Tooltip';
import { ChevronDown, ChevronUp, BookOpen, Disc, Zap } from 'lucide-react';

export const MovesSection = ({ moves = [] }) => {
  const { lang, t } = useLanguage();
  
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isTmOpen, setIsTmOpen] = useState(false);
  const [hoveredMoveInfo, setHoveredMoveInfo] = useState({});

  // Clasificar movimientos por Nivel
  const levelMoves = moves
    .filter((m) => m.version_group_details.some((d) => d.move_learn_method.name === 'level-up'))
    .map((m) => ({
      name: m.move.name,
      url: m.move.url,
      level: m.version_group_details.find((d) => d.move_learn_method.name === 'level-up')?.level_learned_at || 0
    }))
    .sort((a, b) => a.level - b.level);

  // Clasificar movimientos por MT / MO
  const tmMoves = moves
    .filter((m) => m.version_group_details.some((d) => d.move_learn_method.name === 'machine'))
    .map((m) => ({
      name: m.move.name,
      url: m.move.url
    }));

  // Obtener la descripción al pasar el cursor
  const handleMouseEnterMove = async (url, moveName) => {
    if (!hoveredMoveInfo[moveName]) {
      const data = await fetchMoveDescription(url);
      setHoveredMoveInfo((prev) => ({ ...prev, [moveName]: data }));
    }
  };

  const renderMoveTooltipContent = (moveName) => {
    const info = hoveredMoveInfo[moveName];
    if (!info) {
      return (
        <div className="flex items-center gap-2 text-cyber-cyan text-xs font-mono animate-pulse">
          <Zap className="w-3 h-3" /> Carga de datos tácticos...
        </div>
      );
    }

    const desc = info[lang] || info['en'] || 'Sin descripción disponible';
    
    return (
      <div className="space-y-2 max-w-xs">
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{desc}</p>
        
        {/* Atributos del movimiento */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-700/80 text-[10px] font-mono text-cyber-cyan">
          <span>PWR: <strong className="text-white">{info.power ?? '—'}</strong></span>
          <span>ACC: <strong className="text-white">{info.accuracy ? `${info.accuracy}%` : '—'}</strong></span>
          <span>PP: <strong className="text-white">{info.pp ?? '—'}</strong></span>
          {info.damageClass && (
            <span className="uppercase text-[9px] px-1 py-0.5 rounded bg-slate-800 text-cyber-yellow border border-cyber-yellow/30">
              {info.damageClass}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 border border-cyber-border rounded-xl p-4 backdrop-blur-md">
      
      {/* Sección 1: Movimientos por Nivel */}
      <div className="space-y-2">
        <button
          onClick={() => setIsLevelOpen(!isLevelOpen)}
          className="w-full flex items-center justify-between p-2.5 bg-slate-900/80 border border-cyber-cyan/30 hover:border-cyber-cyan rounded-lg text-xs font-mono text-cyber-cyan transition-all"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t('levelUpMoves') || 'Movimientos por Nivel'} ({levelMoves.length})
          </span>
          {isLevelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isLevelOpen && (
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-slate-800 rounded-lg p-2 bg-slate-900/40 custom-scrollbar">
            {levelMoves.length > 0 ? (
              levelMoves.map((m) => (
                <Tooltip
                  key={`${m.name}-${m.level}`}
                  title={`${m.name.toUpperCase().replace(/-/g, ' ')}`}
                  content={renderMoveTooltipContent(m.name)}
                >
                  <div
                    onMouseEnter={() => handleMouseEnterMove(m.url, m.name)}
                    className="flex items-center justify-between p-1.5 rounded text-xs font-mono hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors cursor-help border border-transparent hover:border-cyber-cyan/20"
                  >
                    <span className="capitalize">{m.name.replace(/-/g, ' ')}</span>
                    <span className="text-[10px] text-cyber-yellow bg-slate-950 px-1.5 py-0.5 rounded border border-cyber-yellow/30 font-bold">
                      LVL {m.level}
                    </span>
                  </div>
                </Tooltip>
              ))
            ) : (
              <p className="text-xs text-slate-500 font-mono p-2 text-center">Sin datos de nivel</p>
            )}
          </div>
        )}
      </div>

      {/* Sección 2: Movimientos por MT / MO */}
      <div className="space-y-2">
        <button
          onClick={() => setIsTmOpen(!isTmOpen)}
          className="w-full flex items-center justify-between p-2.5 bg-slate-900/80 border border-cyber-pink/30 hover:border-cyber-pink rounded-lg text-xs font-mono text-cyber-pink transition-all"
        >
          <span className="flex items-center gap-2">
            <Disc className="w-4 h-4" />
            {t('tmHmMoves') || 'Movimientos por MT / MO'} ({tmMoves.length})
          </span>
          {isTmOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isTmOpen && (
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-slate-800 rounded-lg p-2 bg-slate-900/40 custom-scrollbar">
            {tmMoves.length > 0 ? (
              tmMoves.map((m) => (
                <Tooltip
                  key={m.name}
                  title={`${m.name.toUpperCase().replace(/-/g, ' ')}`}
                  content={renderMoveTooltipContent(m.name)}
                >
                  <div
                    onMouseEnter={() => handleMouseEnterMove(m.url, m.name)}
                    className="flex items-center justify-between p-1.5 rounded text-xs font-mono hover:bg-cyber-pink/10 hover:text-cyber-pink transition-colors cursor-help border border-transparent hover:border-cyber-pink/20"
                  >
                    <span className="capitalize">{m.name.replace(/-/g, ' ')}</span>
                    <span className="text-[10px] text-cyber-pink bg-slate-950 px-1.5 py-0.5 rounded border border-cyber-pink/30 font-bold">
                      MT / MO
                    </span>
                  </div>
                </Tooltip>
              ))
            ) : (
              <p className="text-xs text-slate-500 font-mono p-2 text-center">Sin MTs registradas</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};