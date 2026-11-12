// ============================================================
// SERVICIO: Citas
// ============================================================

import api, { API_ENDPOINTS } from '../config/api';

// ============================================================
// LISTAR CITAS CON FILTROS Y PAGINACIÓN
// ============================================================
const listar = async ({
  page = 1,
  limit = 10,
  search = '',
  estado,
  medico_id,
  paciente_id,
  tipo,
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
  if (tipo) params.append('tipo', tipo);
  if (fecha_desde) params.append('fecha_desde', fecha_desde);
  if (fecha_hasta) params.append('fecha_hasta', fecha_hasta);

  const response = await api.get(`${API_ENDPOINTS.citas.base}?${params.toString()}`);

  return {
    data: response.data || [],
    pagination: response.pagination || { total: 0, page: 1, limit, totalPages: 0 },
  };
};

// ============================================================
// OBTENER CITA POR ID
// ============================================================
const obtener = async (id) => {
  const response = await api.get(API_ENDPOINTS.citas.byId(id));
  return response.data;
};

// ============================================================
// CREAR CITA
// ============================================================
const crear = async (data) => {
  const response = await api.post(API_ENDPOINTS.citas.base, data);
  return response.data;
};

// ============================================================
// ACTUALIZAR CITA
// ============================================================
const actualizar = async (id, data) => {
  const response = await api.put(API_ENDPOINTS.citas.byId(id), data);
  return response.data;
};

// ============================================================
// CANCELAR / ELIMINAR CITA
// ============================================================
const eliminar = async (id) => {
  const response = await api.delete(API_ENDPOINTS.citas.byId(id));
  return response;
};

// ============================================================
// ESTADÍSTICAS DE CITAS
// ============================================================
const getEstadisticas = async () => {
  const response = await api.get(API_ENDPOINTS.citas.stats);
  return response.data;
};

// ============================================================
// CITAS DE UN PACIENTE
// ============================================================
const getByPaciente = async (pacienteId) => {
  const response = await api.get(API_ENDPOINTS.citas.byPaciente(pacienteId));
  return response.data;
};

// ============================================================
// CITAS DE UN MÉDICO
// ============================================================
const getByMedico = async (medicoId) => {
  const response = await api.get(API_ENDPOINTS.citas.byMedico(medicoId));
  return response.data;
};

// ============================================================
// CAMBIAR ESTADO DE UNA CITA
// ============================================================
const cambiarEstado = async (id, estado) => {
  const response = await api.patch(`${API_ENDPOINTS.citas.byId(id)}/estado`, { estado });
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
  cambiarEstado,
};