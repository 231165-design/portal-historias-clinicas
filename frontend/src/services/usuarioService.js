// ============================================================
// SERVICIO: Usuarios
// ============================================================

import api, { API_ENDPOINTS } from '../config/api';

// ============================================================
// LISTAR USUARIOS
// ============================================================
const listar = async ({ page = 1, limit = 20, search = '', rol_id, activo } = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (rol_id) params.append('rol_id', rol_id);
  if (activo !== undefined) params.append('activo', activo);

  const response = await api.get(`${API_ENDPOINTS.usuarios.base}?${params.toString()}`);

  return {
    data: response.data || [],
    pagination: response.pagination || { total: 0, page: 1, limit, totalPages: 0 },
  };
};

// ============================================================
// OBTENER USUARIO POR ID
// ============================================================
const obtener = async (id) => {
  const response = await api.get(API_ENDPOINTS.usuarios.byId(id));
  return response.data;
};

// ============================================================
// CREAR USUARIO
// ============================================================
const crear = async (data) => {
  const response = await api.post(API_ENDPOINTS.usuarios.base, data);
  return response.data;
};

// ============================================================
// ACTUALIZAR USUARIO
// ============================================================
const actualizar = async (id, data) => {
  const response = await api.put(API_ENDPOINTS.usuarios.byId(id), data);
  return response.data;
};

// ============================================================
// ELIMINAR USUARIO
// ============================================================
const eliminar = async (id) => {
  const response = await api.delete(API_ENDPOINTS.usuarios.byId(id));
  return response;
};

// ============================================================
// ACTIVAR USUARIO
// ============================================================
const activar = async (id) => {
  const response = await api.patch(API_ENDPOINTS.usuarios.activate(id));
  return response;
};

// ============================================================
// RESETEAR CREDENCIALES
// ============================================================
const resetPassword = async (id, password) => {
  const response = await api.post(API_ENDPOINTS.usuarios.resetAccess(id), { password });
  return response;
};

export default {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
  activar,
  resetPassword,
};