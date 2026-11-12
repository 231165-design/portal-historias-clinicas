// ============================================================
// SERVICIO: Consultas
// ============================================================

import api, { API_ENDPOINTS } from '../config/api';

// ============================================================
// LISTAR CONSULTAS CON FILTROS Y PAGINACIÓN
// ============================================================
const listar = async ({
  page = 1,
  limit = 10,
  search = '',
  estado,
  medico_id,
  paciente_id,
  tipo_atencion,
  fecha_desde,
  fecha_hasta,
} = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (estado) params.append('estado', estado);
  if (medico_id) params.append('medico_id', medico_id);
  if (paciente_id) params.append('paciente_id', paciente_id);
  if (tipo_atencion) params.append('tipo_atencion', tipo_atencion);
  if (fecha_desde) params.append('fecha_desde', fecha_desde);
  if (fecha_hasta) params.append('fecha_hasta', fecha_hasta);

  const response = await api.get(`${API_ENDPOINTS.consultas.base}?${params.toString()}`);

  return {
    data: response.data || [],
    pagination: response.pagination || { total: 0, page: 1, limit, totalPages: 0 },
  };
};

// ============================================================
// OBTENER CONSULTA POR ID
// ============================================================
const obtener = async (id) => {
  const response = await api.get(API_ENDPOINTS.consultas.byId(id));
  return response.data;
};

// ============================================================
// CREAR CONSULTA
// ============================================================
const crear = async (data) => {
  const response = await api.post(API_ENDPOINTS.consultas.base, data);
  return response.data;
};

// ============================================================
// ACTUALIZAR CONSULTA
// ============================================================
const actualizar = async (id, data) => {
  const response = await api.put(API_ENDPOINTS.consultas.byId(id), data);
  return response.data;
};

// ============================================================
// ELIMINAR / ANULAR CONSULTA
// ============================================================
const eliminar = async (id) => {
  const response = await api.delete(API_ENDPOINTS.consultas.byId(id));
  return response;
};

// ============================================================
// ESTADÍSTICAS DE CONSULTAS
// ============================================================
const getEstadisticas = async () => {
  const response = await api.get(`${API_ENDPOINTS.consultas.base}/stats`);
  return response.data;
};

// ============================================================
// OBTENER CONSULTAS DE UN PACIENTE
// ============================================================
const getByPaciente = async (pacienteId) => {
  const response = await api.get(`${API_ENDPOINTS.consultas.base}/paciente/${pacienteId}`);
  return response.data;
};

// ============================================================
// OBTENER CONSULTAS DE UN MÉDICO
// ============================================================
const getByMedico = async (medicoId) => {
  const response = await api.get(`${API_ENDPOINTS.consultas.base}/medico/${medicoId}`);
  return response.data;
};

// ============================================================
// OBTENER SIGNOS VITALES DE UNA CONSULTA
// ============================================================
const getSignosVitales = async (consultaId) => {
  const response = await api.get(`${API_ENDPOINTS.consultas.byId(consultaId)}/signos-vitales`);
  return response.data;
};

// ============================================================
// REGISTRAR SIGNOS VITALES
// ============================================================
const registrarSignosVitales = async (consultaId, data) => {
  const response = await api.post(`${API_ENDPOINTS.consultas.byId(consultaId)}/signos-vitales`, data);
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
  getByMedico,
  getSignosVitales,
  registrarSignosVitales,
};