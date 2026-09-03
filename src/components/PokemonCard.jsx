import React from 'react';

export const PokemonCard = ({ pokemon, onSelect }) => {
  const sprite = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;
  const formattedId = `#${String(pokemon.id).padStart(4, '0')}`;

  return (
    <div
      onClick={() => onSelect(pokemon.name)}
      className="group relative bg-slate-900/60 border border-cyber-border hover:border-cyber-cyan rounded-xl p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-cyber-cyan cursor-pointer overflow-hidden"
    >
      {/* Esquinas estéticas Ciberpunk */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan" />

      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-cyber-cyan">{formattedId}</span>
        <div className="flex gap-1">
          {pokemon.types?.map((t) => (
            <span
              key={t.type.name}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase border border-slate-700"
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full h-32 flex items-center justify-center my-2 relative">
        <div className="absolute inset-0 bg-cyber-cyan/5 rounded-full blur-xl group-hover:bg-cyber-cyan/20 transition-all" />
        <img
          src={sprite}
          alt={pokemon.name}
          className="w-28 h-28 object-contain z-10 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <h3 className="text-sm font-mono font-bold text-center text-slate-100 uppercase tracking-wider group-hover:text-cyber-cyan transition-colors">
        {pokemon.name}
      </h3>
    </div>
  );
};