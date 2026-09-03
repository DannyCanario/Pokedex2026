import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector = () => {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div className="fixed bottom-3 right-3 z-50 flex items-center bg-slate-900/80 border border-cyber-cyan/40 backdrop-blur-md rounded-lg p-1 shadow-cyber-cyan text-xs font-mono">
      <button
        onClick={() => toggleLanguage('es')}
        className={`px-2 py-1 rounded transition-all duration-200 ${
          lang === 'es'
            ? 'bg-cyber-cyan text-slate-950 font-bold shadow-[0_0_8px_#00f3ff]'
            : 'text-slate-400 hover:text-cyber-cyan'
        }`}
      >
        ES
      </button>
      <span className="text-slate-600 mx-1">|</span>
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-2 py-1 rounded transition-all duration-200 ${
          lang === 'en'
            ? 'bg-cyber-cyan text-slate-950 font-bold shadow-[0_0_8px_#00f3ff]'
            : 'text-slate-400 hover:text-cyber-cyan'
        }`}
      >
        EN
      </button>
    </div>
  );
};