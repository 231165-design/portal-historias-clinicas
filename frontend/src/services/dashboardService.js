// ============================================================
// SERVICIO: Dashboard
// ============================================================

import api, { API_ENDPOINTS } from '../config/api';

// ============================================================
// OBTENER RESUMEN COMPLETO (stats + charts + actividad)
// ============================================================
const getResumen = async () => {
  const response = await api.get(API_ENDPOINTS.dashboard.resumen);
  return response.data;
};

// ============================================================
// OBTENER ESTADÍSTICAS GENERALES (4 tarjetas)
// ============================================================
const getStats = async () => {
  const response = await api.get(API_ENDPOINTS.dashboard.stats);
  return response.data;
};

// ============================================================
// OBTENER DATOS PARA GRÁFICOS
// ============================================================
const getCharts = async () => {
  const response = await api.get(API_ENDPOINTS.dashboard.charts);
  return response.data;
};

// ============================================================
// OBTENER ACTIVIDAD RECIENTE
// ============================================================
const getActividad = async () => {
  const response = await api.get(API_ENDPOINTS.dashboard.actividad);
  return response.data;
};

export default {
  getResumen,
  getStats,
  getCharts,
  getActividad,
};