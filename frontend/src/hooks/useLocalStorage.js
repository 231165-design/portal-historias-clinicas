// ============================================================
// HOOK: useLocalStorage
// Estado sincronizado con localStorage
// ============================================================

import { useState, useEffect } from 'react';

/**
 * Hook para manejar estado en localStorage
 *
 * @param {string} key - Clave de localStorage
 * @param {any} initialValue - Valor inicial
 * @returns {Array} - [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 */
export const useLocalStorage = (key, initialValue) => {
  // Función para obtener valor inicial
  const getInitialValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo localStorage "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getInitialValue);

  // Setear valor
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error guardando en localStorage "${key}":`, error);
    }
  };

  // Eliminar valor
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error eliminando localStorage "${key}":`, error);
    }
  };

  // Escuchar cambios en otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          setStoredValue(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;