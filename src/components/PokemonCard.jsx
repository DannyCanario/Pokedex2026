// src/components/PokemonCard.jsx
import React from 'react';

export const PokemonCard = ({ pokemon, onSelect }) => {
  // URL de la imagen (o fallback si no estuviera definida)
  const imageUrl = pokemon.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div
      onClick={() => onSelect(pokemon.name)}
      className="bg-slate-900/80 border border-cyber-border hover:border-cyber-cyan p-4 rounded-xl flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-cyber-cyan/20 group relative overflow-hidden"
    >
      {/* ID estilizado */}
      <span className="text-xs font-mono font-bold text-slate-500 self-start group-hover:text-cyber-cyan transition-colors">
        #{String(pokemon.id).padStart(4, '0')}
      </span>

      {/* Sprite Moderno HD (Official Artwork) */}
      <img
        src={imageUrl}
        alt={pokemon.name}
        loading="lazy"
        className="w-28 h-28 sm:w-32 sm:h-32 object-contain my-3 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all duration-300"
        onError={(e) => {
          // Si falla la ilustración oficial, carga el sprite clásico de GitHub
          e.target.onerror = null;
          e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
        }}
      />

      {/* Nombre del Pokémon */}
      <span className="capitalize text-sm font-bold font-mono text-slate-200 group-hover:text-cyber-cyan transition-colors">
        {pokemon.name.replace(/-/g, ' ')}
      </span>
    </div>
  );
};