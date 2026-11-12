// ============================================================
// HOOK: usePacientes
// Gestión de pacientes con búsqueda y paginación
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import pacienteService from '../services/pacienteService';
import useDebounce from './useDebounce';

/**
 * Hook para gestionar pacientes
 *
 * @param {Object} options - Opciones iniciales
 * @returns {Object} - Estado y funciones para gestionar pacientes
 */
export const usePacientes = (options = {}) => {
  const { autoLoad = true, itemsPerPage = 20 } = options;

  // --- Estados ---
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);

  // --- Filtros ---
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(itemsPerPage);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: itemsPerPage,
    totalPages: 0,
  });

  // Debounce para búsqueda
  const debouncedSearch = useDebounce(search, 500);

  // --- Cargar pacientes ---
  const cargarPacientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await pacienteService.listar({
        page,
        limit,
        search: debouncedSearch,
      });

      setPacientes(response.data || response.pacientes || []);
      setPagination(
        response.pagination || {
          total: response.total || 0,
          page,
          limit,
          totalPages: response.totalPages || 1,
        }
      );
    } catch (err) {
      setError(err.message || 'Error al cargar pacientes');
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  // --- Cargar al inicio o al cambiar filtros ---
  useEffect(() => {
    if (autoLoad) {
      cargarPacientes();
    }
  }, [cargarPacientes, autoLoad]);

  // --- Resetear página al buscar ---
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // --- Crear paciente ---
  const crearPaciente = async (data) => {
    try {
      const nuevo = await pacienteService.crear(data);
      await cargarPacientes();
      return nuevo;
    } catch (err) {
      throw err;
    }
  };

  // --- Actualizar paciente ---
  const actualizarPaciente = async (id, data) => {
    try {
      const actualizado = await pacienteService.actualizar(id, data);
      await cargarPacientes();
      return actualizado;
    } catch (err) {
      throw err;
    }
  };

  // --- Eliminar paciente ---
  const eliminarPaciente = async (id) => {
    try {
      await pacienteService.eliminar(id);
      await cargarPacientes();
    } catch (err) {
      throw err;
    }
  };

  // --- Obtener uno ---
  const obtenerPaciente = async (id) => {
    return await pacienteService.obtener(id);
  };

  return {
    // Datos
    pacientes,
    loading,
    error,
    pagination,

    // Filtros
    search,
    setSearch,
    page,
    setPage,

    // Acciones
    cargarPacientes,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    obtenerPaciente,
  };
};

export default usePacientes;