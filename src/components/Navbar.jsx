import React from 'react';
import { Terminal, ShieldAlert, Cpu, Activity } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b-2 border-cyan-500/40 shadow-[0_4px_20px_rgba(6,182,212,0.15)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO GLITCH / CYBER */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-950 border border-cyan-400 cyber-cut shadow-[0_0_12px_rgba(6,182,212,0.5)]">
            <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-glow-cyan tracking-widest">
              POKÉ_DEX<span className="text-fuchsia-500">.OS</span>
            </h1>
            <span className="text-[9px] text-slate-500 font-mono block -mt-1 tracking-widest">
              SYS_ID // 0x99A_NET
            </span>
          </div>
        </div>

        {/* TELEMETRÍA CENTRAL DE SISTEMA */}
        <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-slate-400 border-x border-slate-800 px-6 py-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ESTADO: <strong className="text-emerald-400">EN LÍNEA</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>LATENCIA: <strong className="text-cyan-400">12ms</strong></span>
          </div>
        </div>

        {/* CONTROLES TÁCTICOS */}
        <nav className="flex items-center gap-3 font-mono text-xs">
          <button className="px-3 py-1.5 bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 cyber-cut transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>CONSOLA</span>
          </button>
        </nav>

      </div>
      
      {/* Línea Neón Inferior */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
    </header>
  );
};