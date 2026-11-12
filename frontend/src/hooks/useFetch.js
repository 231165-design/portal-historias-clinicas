// ============================================================
// HOOK: useFetch
// Peticiones HTTP con estados automáticos
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook para hacer peticiones HTTP
 *
 * @param {Function} fetchFn - Función que retorna una Promise
 * @param {Array} deps - Dependencias para re-ejecutar
 * @param {Object} options - Opciones
 * @param {boolean} options.immediate - Ejecutar inmediatamente (default: true)
 * @param {any} options.initialData - Datos iniciales
 * @returns {Object} - { data, loading, error, refetch }
 *
 * @example
 * const { data, loading, error, refetch } = useFetch(
 *   () => pacienteService.listar(),
 *   []
 * );
 */
export const useFetch = (fetchFn, deps = [], options = {}) => {
  const { immediate = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    if (!isMounted.current) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      if (isMounted.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Error al cargar datos');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, deps);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
};

export default useFetch;