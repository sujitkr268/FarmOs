import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

const LanguageContext = createContext();

const dictionaries = {
  en,
  hi
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const savedLang = localStorage.getItem('farmos_language');
      if (savedLang === 'hi' || savedLang === 'en') {
        return savedLang;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for farmos_language:', e);
    }
    return 'en';
  });

  const setLanguage = (lang) => {
    const targetLang = lang === 'hi' ? 'hi' : 'en';
    setLanguageState(targetLang);
    try {
      localStorage.setItem('farmos_language', targetLang);
    } catch (e) {
      console.warn('Unable to write to localStorage for farmos_language:', e);
    }
  };

  /**
   * Helper function to fetch nested translation string by dot notation path (e.g., "nav.home")
   * Falls back to English if missing in Hindi, and guarantees a non-null, non-undefined string return.
   */
  const t = (path, replacements = {}) => {
    if (!path || typeof path !== 'string') return '';

    const keys = path.split('.');
    
    const getFromObj = (obj) => {
      let current = obj;
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          return null;
        }
      }
      return typeof current === 'string' ? current : null;
    };

    // 1. Try selected language
    let result = getFromObj(dictionaries[language]);

    // 2. Fallback to English if missing or empty
    if (!result && language !== 'en') {
      result = getFromObj(dictionaries.en);
    }

    // 3. Last fallback: return key name or empty string if not found
    if (!result) {
      result = keys[keys.length - 1] || path;
    }

    // Replace dynamic placeholders like {{count}}
    if (replacements && typeof replacements === 'object') {
      Object.keys(replacements).forEach((repKey) => {
        result = result.replace(new RegExp(`{{${repKey}}}`, 'g'), replacements[repKey]);
      });
    }

    return result || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
