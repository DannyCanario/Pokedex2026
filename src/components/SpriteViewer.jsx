import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, User, RefreshCw } from 'lucide-react';

export const SpriteViewer = ({ pokemon, varieties, onSelectVariety }) => {
  const { t } = useLanguage();
  const [isShiny, setIsShiny] = useState(false);
  const [isFemale, setIsFemale] = useState(false);

  // Obtener sprites animados (Showdown) u oficial de alta definición
  const getSpriteUrl = () => {
    const sprites = pokemon.sprites;
    
    // Ruta animación Showdown GIF
    const animated = sprites?.other?.showdown;
    
    if (isShiny) {
      if (isFemale && animated?.front_shiny_female) return animated.front_shiny_female;
      if (isFemale && sprites?.front_shiny_female) return sprites.front_shiny_female;
      if (animated?.front_shiny) return animated.front_shiny;
      if (sprites?.other?.['official-artwork']?.front_shiny) return sprites.other['official-artwork'].front_shiny;
      return sprites?.front_shiny || sprites?.front_default;
    } else {
      if (isFemale && animated?.front_female) return animated.front_female;
      if (isFemale && sprites?.front_female) return sprites.front_female;
      if (animated?.front_default) return animated.front_default;
      return sprites?.other?.['official-artwork']?.front_default || sprites?.front_default;
    }
  };

  const hasFemaleSprite = Boolean(pokemon.sprites?.front_female || pokemon.sprites?.other?.showdown?.front_female);

  return (
    <div className="flex flex-col items-center bg-slate-950/60 border border-cyber-border rounded-xl p-4 relative backdrop-blur-md">
      {/* Marco Ciberpunk con bordes resaltados */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan" />

      {/* Visor de Sprite Principal */}
      <div className="relative w-48 h-48 flex items-center justify-center my-2 group">
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-all duration-300 ${isShiny ? 'bg-cyber-pink' : 'bg-cyber-cyan'}`} />
        <img
          src={getSpriteUrl()}
          alt={pokemon.name}
          className="w-36 h-36 object-contain z-10 filter drop-shadow-[0_0_12px_rgba(0,243,255,0.4)] transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Controles: Shiny Toggle & Género */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsShiny(!isShiny)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-300 border ${
            isShiny
              ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink shadow-cyber-pink'
              : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-cyber-cyan'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {t('shinyMode')}
        </button>

        {hasFemaleSprite && (
          <button
            onClick={() => setIsFemale(!isFemale)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-300 border ${
              isFemale
                ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                : 'bg-slate-900/60 border-slate-700 text-slate-400'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {isFemale ? t('female') : t('male')}
          </button>
        )}
      </div>

      {/* Variantes Regionales / Megas / Gigantamax */}
      {varieties && varieties.length > 1 && (
        <div className="w-full border-t border-cyber-border/40 pt-3">
          <span className="text-[10px] font-mono text-cyber-cyan uppercase block mb-2 text-center">
            {t('forms')}
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto pr-1">
            {varieties.map((v) => {
              const isCurrent = v.pokemon.name === pokemon.name;
              return (
                <button
                  key={v.pokemon.name}
                  onClick={() => onSelectVariety(v.pokemon.name)}
                  className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                    isCurrent
                      ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {v.pokemon.name.replace(`${pokemon.name.split('-')[0]}-`, '').toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};