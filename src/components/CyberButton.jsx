import React from 'react';

export const CyberButton = ({ children, onClick, variant = 'cyan', active = false, className = '' }) => {
  const isFuchsia = variant === 'fuchsia';
  
  const baseStyles = 'relative px-4 py-2 font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 border-2 active:scale-95';
  
  const colors = isFuchsia
    ? active
      ? 'bg-fuchsia-950 border-fuchsia-500 text-fuchsia-200 shadow-glow-fuchsia-lg'
      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-fuchsia-500 hover:text-fuchsia-300 hover:shadow-glow-fuchsia'
    : active
      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-glow-cyan-lg'
      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-glow-cyan';

  return (
    <button onClick={onClick} className={`${baseStyles} ${colors} ${className}`}>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};