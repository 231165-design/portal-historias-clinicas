// ============================================================
// CONFIGURACIÓN DE LA API - Axios
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

// ============================================================
// URL BASE DE LA API
// ============================================================
const API_URL = import.meta.env.VITE_API_URL || '';

// ============================================================
// INSTANCIA DE AXIOS
// ============================================================
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ============================================================
// INTERCEPTOR DE REQUEST (Añadir token JWT)
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// INTERCEPTOR DE RESPONSE (Manejo de errores)
// ============================================================
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      return Promise.reject({
        status,
        message: data?.message || 'Error en la petición',
        errors: data?.errors || null,
      });
    }

    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Error de conexión. Verifica tu internet.',
      });
    }

    return Promise.reject({
      status: -1,
      message: error.message || 'Error desconocido',
    });
  }
);

// ============================================================
// ENDPOINTS DE LA API
// ============================================================
export const API_ENDPOINTS = {
  // --- Autenticación ---
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    updateCredentials: '/auth/change-password',
    recoverAccess: '/auth/recover-password',
  },

  // --- Pacientes ---
  pacientes: {
    base: '/pacientes',
    byId: (id) => `/pacientes/${id}`,
    search: (termino) => `/pacientes/buscar/${termino}`,
    stats: '/pacientes/stats',
    historia: (id) => `/pacientes/${id}/historia`,
    antecedentes: (id) => `/pacientes/${id}/antecedentes`,
    consultas: (id) => `/pacientes/${id}/consultas`,
    vacunas: (id) => `/pacientes/${id}/vacunas`,
  },

  // --- Usuarios ---
  usuarios: {
    base: '/usuarios',
    byId: (id) => `/usuarios/${id}`,
    activate: (id) => `/usuarios/${id}/activate`,
    resetAccess: (id) => `/usuarios/${id}/reset-password`,
  },

  // --- Dashboard ---
  dashboard: {
    resumen: '/dashboard/resumen',
    stats: '/dashboard/stats',
    charts: '/dashboard/charts',
    actividad: '/dashboard/actividad',
  },

  // --- Consultas ---
  consultas: {
    base: '/consultas',
    byId: (id) => `/consultas/${id}`,
    stats: '/consultas/stats',
    byPaciente: (pacienteId) => `/consultas/paciente/${pacienteId}`,
    byMedico: (medicoId) => `/consultas/medico/${medicoId}`,
    signosVitales: (id) => `/consultas/${id}/signos-vitales`,
    recetas: (id) => `/consultas/${id}/recetas`,
  },

  // --- Signos Vitales ---
  signosVitales: {
    base: '/signos-vitales',
    byId: (id) => `/signos-vitales/${id}`,
    byConsulta: (consultaId) => `/signos-vitales/consulta/${consultaId}`,
  },

  // --- Farmacia ---
  farmacia: {
    medicamentos: '/medicamentos',
    medicamentoById: (id) => `/medicamentos/${id}`,
    recetas: '/recetas',
    recetaById: (id) => `/recetas/${id}`,
    inventario: '/inventario',
    movimientos: '/inventario/movimientos',
    alertasStock: '/inventario/alertas-stock',
  },

  // --- Citas ---
  citas: {
    base: '/citas',
    byId: (id) => `/citas/${id}`,
    stats: '/citas/stats',
    byPaciente: (pacienteId) => `/citas/paciente/${pacienteId}`,
    byMedico: (medicoId) => `/citas/medico/${medicoId}`,
    cancelar: (id) => `/citas/${id}/cancelar`,
  },

  // --- Vacunas ---
  vacunas: {
    base: '/vacunas',
    byId: (id) => `/vacunas/${id}`,
    stats: '/vacunas/stats',
    byPaciente: (pacienteId) => `/vacunas/paciente/${pacienteId}`,
    carnet: (pacienteId) => `/vacunas/carnet/${pacienteId}`,
  },

  // --- Reportes ---
  reportes: {
    atenciones: '/reportes/atenciones',
    morbilidad: '/reportes/morbilidad',
    vacunacion: '/reportes/vacunacion',
    inventario: '/reportes/inventario',
    estadisticas: '/reportes/estadisticas',
  },

  // --- Auditoría ---
  auditoria: {
    base: '/auditoria',
    byId: (id) => `/auditoria/${id}`,
    stats: '/auditoria/stats',
  },

  // --- Health Check ---
  health: '/health',
};

export { api, API_URL };
export default api;