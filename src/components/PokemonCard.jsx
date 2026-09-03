import React from 'react';
import { Crosshair, Zap } from 'lucide-react';

export const PokemonCard = ({ pokemon, onSelect }) => {
  const spriteUrl =
    pokemon.image ||
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div
      onClick={() => onSelect(pokemon.name)}
      className="group relative bg-slate-900/90 border border-cyan-900/60 hover:border-cyan-400 p-4 clip-corner transition-all duration-300 cursor-pointer hover:glow-cyan hover:-translate-y-1 overflow-hidden"
    >
      {/* Luz ambiental de fondo en hover */}
      <div className="absolute -right-10 -top-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all" />

      {/* Marcas de cruceta HUD en las esquinas */}
      <Crosshair className="absolute top-1 left-1 w-3 h-3 text-cyan-500/30 group-hover:text-cyan-400 transition-colors" />
      <Crosshair className="absolute bottom-1 right-1 w-3 h-3 text-cyan-500/30 group-hover:text-cyan-400 transition-colors" />

      {/* ID estilizado estilo matriz */}
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-[10px] font-mono tracking-widest text-cyan-500 font-bold bg-cyan-950/60 px-2 py-0.5 border border-cyan-800/50 rounded">
          #{String(pokemon.id).padStart(4, '0')}
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[9px] font-mono text-slate-400 uppercase">ONLINE</span>
        </div>
      </div>

      {/* Marco de Imagen / Holo-Display */}
      <div className="relative w-full aspect-square flex items-center justify-center my-2 bg-slate-950/60 border border-slate-800 group-hover:border-cyan-500/40 rounded-lg transition-colors overflow-hidden">
        {/* Efecto de línea de escáner en imagen */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent w-full h-1/2 animate-scan pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

        <img
          src={spriteUrl}
          alt={pokemon.name}
          loading="lazy"
          className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300 z-10"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
          }}
        />
      </div>

      {/* Nombre y detalles en pie de tarjeta */}
      <div className="flex flex-col items-center mt-2">
        <span className="capitalize font-mono font-black text-sm tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          {pokemon.name.replace(/-/g, ' ')}
        </span>
        <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mt-0.5">
          [ DATA_NODE_{pokemon.id} ]
        </span>
      </div>
    </div>
  );
};