import React from 'react';

export const CyberCard = ({ children, color = 'cyan', title, className = '' }) => {
  const isFuchsia = color === 'fuchsia';
  const borderCol = isFuchsia ? 'border-fuchsia-500' : 'border-cyan-500';
  const glowCol = isFuchsia ? 'shadow-glow-fuchsia' : 'shadow-glow-cyan';
  const textCol = isFuchsia ? 'text-fuchsia-400' : 'text-cyan-400';

  return (
    <div className={`relative bg-slate-950/90 border border-slate-800 ${glowCol} transition-all p-4 ${className}`}>
      {/* Esquinas de Mira Táctica */}
      <span className={`absolute -top-0.5 -left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 ${borderCol} z-20 pointer-events-none`} />
      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 ${borderCol} z-20 pointer-events-none`} />

      {/* Encabezado Táctico del Contenedor */}
      {title && (
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${textCol}`}>
            // {title}
          </span>
          <span className="text-[8px] font-mono text-slate-600">SYS_HUD_V2</span>
        </div>
      )}

      {children}
    </div>
  );
};