import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchAbilityDescription } from '../services/pokeApi';
import { Tooltip } from './Tooltip';
import { ShieldAlert, Zap } from 'lucide-react';

export const AbilitiesSection = ({ abilities }) => {
  const { lang, t } = useLanguage();
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    const loadDescriptions = async () => {
      const descMap = {};
      for (const item of abilities) {
        const desc = await fetchAbilityDescription(item.ability.url, lang);
        descMap[item.ability.name] = desc;
      }
      setDescriptions(descMap);
    };
    if (abilities) loadDescriptions();
  }, [abilities, lang]);

  return (
    <div className="bg-slate-950/60 border border-cyber-border rounded-xl p-4 backdrop-blur-md">
      <h3 className="text-xs font-mono text-cyber-cyan uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Zap className="w-4 h-4 text-cyber-yellow" />
        {t('abilities')}
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {abilities.map((item) => {
          const isHidden = item.is_hidden;
          const name = item.ability.name.replace('-', ' ').toUpperCase();
          const desc = descriptions[item.ability.name];

          return (
            <Tooltip key={item.ability.name} title={name} content={desc}>
              <div
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 cursor-help ${
                  isHidden
                    ? 'bg-purple-950/30 border-purple-500/40 hover:border-purple-400'
                    : 'bg-slate-900/50 border-cyber-border/40 hover:border-cyber-cyan'
                }`}
              >
                <span className="text-xs font-mono font-semibold text-slate-200">
                  {name}
                </span>

                {isHidden ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-500/30">
                    <ShieldAlert className="w-3 h-3" />
                    {t('hiddenAbility')}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    SLOT {item.slot}
                  </span>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};