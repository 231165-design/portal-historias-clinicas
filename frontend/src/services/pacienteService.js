// ============================================================
// SERVICIO: Pacientes
// ============================================================

import api, { API_ENDPOINTS } from '../config/api';

// ============================================================
// LISTAR PACIENTES (con filtros y paginación)
// ============================================================
const listar = async ({
  page = 1,
  limit = 10,
  search = '',
  posta_id,
  sexo,
  tipo_seguro,
  rango_edad,
} = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (posta_id) params.append('posta_id', posta_id);
  if (sexo) params.append('sexo', sexo);
  if (tipo_seguro) params.append('tipo_seguro', tipo_seguro);
  if (rango_edad) params.append('rango_edad', rango_edad);

  const response = await api.get(`${API_ENDPOINTS.pacientes.base}?${params.toString()}`);

  return {
    data: response.data || [],
    pagination: response.pagination || { total: 0, page: 1, limit, totalPages: 0 },
  };
};

// ============================================================
// OBTENER PACIENTE POR ID
// ============================================================
const obtener = async (id) => {
  const response = await api.get(API_ENDPOINTS.pacientes.byId(id));
  return response.data;
};

// ============================================================
// BUSCAR PACIENTE (DNI o HC)
// ============================================================
const buscar = async (termino) => {
  const response = await api.get(API_ENDPOINTS.pacientes.search(termino));
  return response.data;
};

// ============================================================
// CREAR PACIENTE
// ============================================================
const crear = async (data) => {
  const response = await api.post(API_ENDPOINTS.pacientes.base, data);
  return response.data;
};

// ============================================================
// ACTUALIZAR PACIENTE
// ============================================================
const actualizar = async (id, data) => {
  const response = await api.put(API_ENDPOINTS.pacientes.byId(id), data);
  return response.data;
};

// ============================================================
// ELIMINAR PACIENTE
// ============================================================
const eliminar = async (id) => {
  const response = await api.delete(API_ENDPOINTS.pacientes.byId(id));
  return response;
};

// ============================================================
// ESTADÍSTICAS DE PACIENTES
// ============================================================
const getEstadisticas = async () => {
  const response = await api.get(API_ENDPOINTS.pacientes.stats);
  return response.data;
};

// ============================================================
// OBTENER HISTORIA CLÍNICA DE UN PACIENTE
// ============================================================
const getHistoriaClinica = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.pacientes.byId(id)}/historia`);
  return response.data;
};

// ============================================================
// OBTENER ANTECEDENTES DE UN PACIENTE
// ============================================================
const getAntecedentes = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.pacientes.byId(id)}/antecedentes`);
  return response.data;
};

// ============================================================
// OBTENER CONSULTAS DE UN PACIENTE
// ============================================================
const getConsultas = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.pacientes.byId(id)}/consultas`);
  return response.data;
};

// ============================================================
// OBTENER VACUNAS DE UN PACIENTE
// ============================================================
const getVacunas = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.pacientes.byId(id)}/vacunas`);
  return response.data;
};

export default {
  listar,
  obtener,
  buscar,
  crear,
  actualizar,
  eliminar,
  getEstadisticas,
  getHistoriaClinica,
  getAntecedentes,
  getConsultas,
  getVacunas,
};