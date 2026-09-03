import React, { createContext, useContext, useState } from 'react';

const translations = {
  es: {
    title: 'CYBERDEX 2026',
    searchPlaceholder: 'Buscar por nombre o número ID...',
    types: 'Tipos',
    height: 'Altura',
    weight: 'Peso',
    abilities: 'Habilidades',
    hiddenAbility: 'Oculta',
    moves: 'Movimientos',
    levelUpMoves: 'Aprende por Nivel',
    tmHmMoves: 'Aprende por MT / MO',
    noDescription: 'Sin descripción disponible.',
    loading: 'CONECTANDO CON SERVIDOR POKÉNET...',
    error: 'Pokémon no localizado en la base de datos.',
    shinyMode: 'VARIANTE SHINY',
    forms: 'Formas y Variantes',
    female: 'Hembra',
    male: 'Macho',
    defaultForm: 'Forma Base',
    hoverForDetails: 'Pasa el cursor para ver detalles',
    stats: 'Estadísticas Base'
  },
  en: {
    title: 'CYBERDEX 2026',
    searchPlaceholder: 'Search by name or ID number...',
    types: 'Types',
    height: 'Height',
    weight: 'Weight',
    abilities: 'Abilities',
    hiddenAbility: 'Hidden',
    moves: 'Moves',
    levelUpMoves: 'Level Up Moves',
    tmHmMoves: 'TMs & HMs Moves',
    noDescription: 'No description available.',
    loading: 'CONNECTING TO POKÉNET SERVER...',
    error: 'Pokémon not found in database.',
    shinyMode: 'SHINY VARIANT',
    forms: 'Forms & Varieties',
    female: 'Female',
    male: 'Male',
    defaultForm: 'Base Form',
    hoverForDetails: 'Hover for detailed specs',
    stats: 'Base Stats'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('es');

  const toggleLanguage = (newLang) => {
    if (newLang) setLang(newLang);
    else setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);