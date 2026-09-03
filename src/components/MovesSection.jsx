import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchMoveDescription } from '../services/pokeApi';
import { Tooltip } from './Tooltip';
import { ChevronDown, ChevronUp, BookOpen, Disc } from 'lucide-react';

export const MovesSection = ({ moves }) => {
  const { lang, t } = useLanguage();
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [hoveredMoveInfo, setHoveredMoveInfo] = useState({});

  // Clasificar movimientos por método de aprendizaje
  const levelMoves = moves
    .filter((m) => m.version_group_details.some((d) => d.move_learn_method.name === 'level-up'))
    .map((m) => ({
      name: m.move.name,
      url: m.move.url,
      level: m.version_group_details.find((d) => d.move_learn_method.name === 'level-up')?.level_learned_at || 0
    }))
    .sort((a, b) => a.level - b.level);

  const tmMoves = moves
    .filter((m) => m.version_group_details.some((d) => d.move_learn_method.name === 'machine'))
    .map((m) => ({
      name: m.move.name,
      url: m.move.url
    }));

  const handleMouseEnterMove = async (url, moveName) => {
    if (!hoveredMoveInfo[moveName]) {
      const data = await fetchMoveDescription(url, lang);
      setHoveredMoveInfo((prev) => ({ ...prev, [moveName]: data }));
    }
  };

  const renderMoveTooltipContent = (moveName) => {
    const info = hoveredMoveInfo[moveName];
    if (!info) return 'Cargando datos de combate...';

    const desc = info[lang] || info['en'] || 'Sin descripción';
    return (
      <div className="space-y-1">
        <p>{desc}</p>
        <div className="flex gap-2 pt-1 border-t border-slate-700 text-[10px] font-mono text-cyber-cyan">
          <span>PWR: {info.power}</span>
          <span>ACC: {info.accuracy}</span>
          <span>PP: {info.pp}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 border border-cyber-border rounded-xl p-4 backdrop-blur-md">
      {/* Sección 1: Movimientos por Nivel (Desplegable) */}
      <div className="space-y-2">
        <button
          onClick={() => setIsLevelOpen(!isLevelOpen)}
          className="w-full flex items-center justify-between p-2.5 bg-slate-900/80 border border-cyber-cyan/30 hover:border-cyber-cyan rounded-lg text-xs font-mono text-cyber-cyan transition-all"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t('levelUpMoves')} ({levelMoves.length})
          </span>
          {isLevelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isLevelOpen && (
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-slate-800 rounded-lg p-2 bg-slate-900/40">
            {levelMoves.map((m) => (
              <Tooltip
                key={`${m.name}-${m.level}`}
                title={`${m.name.toUpperCase()} (LVL ${m.level})`}
                content={renderMoveTooltipContent(m.name)}
              >
                <div
                  onMouseEnter={() => handleMouseEnterMove(m.url, m.name)}
                  className="flex items-center justify-between p-1.5 rounded text-xs font-mono hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors cursor-help border border-transparent hover:border-cyber-cyan/20"
                >
                  <span className="capitalize">{m.name.replace('-', ' ')}</span>
                  <span className="text-[10px] text-cyber-yellow bg-slate-950 px-1.5 py-0.5 rounded border border-cyber-yellow/30">
                    NIVEL {m.level}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      {/* Sección 2: Movimientos por MT / MO */}
      <div className="space-y-2">
        <div className="p-2.5 bg-slate-900/80 border border-cyber-pink/30 rounded-lg text-xs font-mono text-cyber-pink flex items-center gap-2">
          <Disc className="w-4 h-4" />
          {t('tmHmMoves')} ({tmMoves.length})
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1 pr-1 border border-slate-800 rounded-lg p-2 bg-slate-900/40">
          {tmMoves.map((m) => (
            <Tooltip
              key={m.name}
              title={`MT / MO: ${m.name.toUpperCase()}`}
              content={renderMoveTooltipContent(m.name)}
            >
              <div
                onMouseEnter={() => handleMouseEnterMove(m.url, m.name)}
                className="flex items-center justify-between p-1.5 rounded text-xs font-mono hover:bg-cyber-pink/10 hover:text-cyber-pink transition-colors cursor-help border border-transparent hover:border-cyber-pink/20"
              >
                <span className="capitalize">{m.name.replace('-', ' ')}</span>
                <span className="text-[10px] text-cyber-pink bg-slate-950 px-1.5 py-0.5 rounded border border-cyber-pink/30">
                  MT
                </span>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};