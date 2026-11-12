// ============================================================
// SERVICIO: Vacunas
// ============================================================

import api, { API_ENDPOINTS } from '../config/api';

// ============================================================
// LISTAR VACUNAS CON FILTROS Y PAGINACIÓN
// ============================================================
const listar = async ({
  page = 1,
  limit = 10,
  search = '',
  tipo_vacuna,
  paciente_id,
  fecha_desde,
  fecha_hasta,
} = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (tipo_vacuna) params.append('tipo_vacuna', tipo_vacuna);
  if (paciente_id) params.append('paciente_id', paciente_id);
  if (fecha_desde) params.append('fecha_desde', fecha_desde);
  if (fecha_hasta) params.append('fecha_hasta', fecha_hasta);

  const response = await api.get(`${API_ENDPOINTS.vacunas.base}?${params.toString()}`);

  return {
    data: response.data || [],
    pagination: response.pagination || { total: 0, page: 1, limit, totalPages: 0 },
  };
};

// ============================================================
// OBTENER VACUNA POR ID
// ============================================================
const obtener = async (id) => {
  const response = await api.get(API_ENDPOINTS.vacunas.byId(id));
  return response.data;
};

// ============================================================
// CREAR VACUNA
// ============================================================
const crear = async (data) => {
  const response = await api.post(API_ENDPOINTS.vacunas.base, data);
  return response.data;
};

// ============================================================
// ACTUALIZAR VACUNA
// ============================================================
const actualizar = async (id, data) => {
  const response = await api.put(API_ENDPOINTS.vacunas.byId(id), data);
  return response.data;
};

// ============================================================
// ELIMINAR VACUNA
// ============================================================
const eliminar = async (id) => {
  const response = await api.delete(API_ENDPOINTS.vacunas.byId(id));
  return response;
};

// ============================================================
// ESTADÍSTICAS DE VACUNAS
// ============================================================
const getEstadisticas = async () => {
  const response = await api.get(API_ENDPOINTS.vacunas.stats);
  return response.data;
};

// ============================================================
// VACUNAS DE UN PACIENTE (CARNET)
// ============================================================
const getByPaciente = async (pacienteId) => {
  const response = await api.get(API_ENDPOINTS.vacunas.byPaciente(pacienteId));
  return response.data;
};

export default {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
  getEstadisticas,
  getByPaciente,
};