import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchPokemonSpecies, fetchPokemonDetail } from '../services/pokeApi';
import { SpriteViewer } from './SpriteViewer';
import { AbilitiesSection } from './AbilitiesSection';
import { MovesSection } from './MovesSection';
import { X, Activity } from 'lucide-react';

export const PokemonDetailModal = ({ pokemonName, onClose }) => {
  const { t } = useLanguage();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFullData = async () => {
      setLoading(true);
      try {
        const detail = await fetchPokemonDetail(pokemonName);
        setPokemon(detail);

        const spec = await fetchPokemonSpecies(detail.species.name);
        setSpecies(spec);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (pokemonName) loadFullData();
  }, [pokemonName]);

  if (!pokemonName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900/90 border border-cyber-cyan rounded-2xl p-6 shadow-cyber-cyan max-h-[90vh] overflow-y-auto">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-cyber-pink text-slate-300 hover:text-white transition-colors border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-20 text-center font-mono text-cyber-cyan animate-pulse">
            {t('loading')}
          </div>
        ) : pokemon && (
          <div className="space-y-6">
            {/* Header del Pokémon */}
            <div className="flex items-center gap-4 border-b border-cyber-border/40 pb-4">
              <span className="text-xl font-mono text-cyber-cyan font-bold">
                #{String(pokemon.id).padStart(4, '0')}
              </span>
              <h2 className="text-2xl font-mono font-extrabold uppercase tracking-widest text-white">
                {pokemon.name}
              </h2>
            </div>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visor de Sprites */}
              <SpriteViewer
                pokemon={pokemon}
                varieties={species?.varieties}
                onSelectVariety={(name) => {
                  fetchPokemonDetail(name).then(setPokemon);
                }}
              />

              {/* Estadísticas Base y Specs */}
              <div className="space-y-4">
                <div className="bg-slate-950/60 border border-cyber-border rounded-xl p-4">
                  <h3 className="text-xs font-mono text-cyber-cyan uppercase mb-3 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    {t('stats')}
                  </h3>
                  <div className="space-y-2">
                    {pokemon.stats.map((s) => (
                      <div key={s.stat.name} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-300 uppercase">
                          <span>{s.stat.name}</span>
                          <span className="text-cyber-cyan font-bold">{s.base_stat}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyber-cyan shadow-[0_0_8px_#00f3ff]"
                            style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <AbilitiesSection abilities={pokemon.abilities} />
              </div>
            </div>

            {/* Sección de Movimientos */}
            <MovesSection moves={pokemon.moves} />
          </div>
        )}
      </div>
    </div>
  );
};