// ============================================================
// HOOK: useDebounce
// Retrasa la actualización de un valor
// ============================================================

import { useState, useEffect } from 'react';

/**
 * Retrasa la actualización de un valor
 * Útil para búsquedas en tiempo real sin hacer muchas peticiones
 *
 * @param {any} value - Valor a debouncear
 * @param {number} delay - Milisegundos de espera (default: 500)
 * @returns {any} - Valor debounceado
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 *
 * useEffect(() => {
 *   // Solo se ejecuta 500ms después de la última tecla
 *   buscarPacientes(debouncedSearch);
 * }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;