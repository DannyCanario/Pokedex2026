import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-slate-900/90 border border-cyan-500/50 p-1.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md">
      <Globe className="w-4 h-4 text-cyan-400 ml-1 animate-pulse" />
      <div className="flex gap-1 font-mono text-xs">
        <button
          onClick={() => setLanguage('es')}
          className={`px-2.5 py-1 rounded transition-all ${
            language === 'es'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 rounded transition-all ${
            language === 'en'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.8)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
};