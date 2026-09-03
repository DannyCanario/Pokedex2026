import React, { useState } from 'react';

export const Tooltip = ({ children, content, title }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative inline-block w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900/95 border border-cyber-cyan rounded-md shadow-cyber-cyan backdrop-blur-md pointer-events-none transition-opacity duration-200">
          <div className="flex items-center justify-between border-b border-cyber-cyan/30 pb-1 mb-1">
            <span className="text-xs font-mono text-cyber-cyan uppercase tracking-wider">{title || 'DATOS_SYS'}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {content || 'Cargando datos...'}
          </p>
        </div>
      )}
    </div>
  );
};