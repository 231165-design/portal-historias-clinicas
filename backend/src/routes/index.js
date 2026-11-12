// ============================================================
// ÍNDICE DE RUTAS - Centraliza toda la API
// ============================================================

import { Router } from 'express';
import config from '../config/env.js';
import { HTTP_STATUS } from '../config/constants.js';

// Importar rutas
import authRoutes from './authRoutes.js';
import pacienteRoutes from './pacienteRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import consultaRoutes from './consultaRoutes.js';
import citaRoutes from './citaRoutes.js';
import vacunaRoutes from './vacunaRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

// ============================================================
// RUTA DE SALUD (para verificar que el servidor funciona)
// ============================================================
router.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: config.app.version,
    api: config.server.apiPrefix,
  });
});

// ============================================================
// MONTAR RUTAS
// ============================================================

// Autenticación
router.use('/auth', authRoutes);

// Pacientes
router.use('/pacientes', pacienteRoutes);

// Usuarios
router.use('/usuarios', usuarioRoutes);

// Consultas
router.use('/consultas', consultaRoutes);

// Citas
router.use('/citas', citaRoutes);

// Vacunas
router.use('/vacunas', vacunaRoutes);

// Dashboard
router.use('/dashboard', dashboardRoutes);

// ============================================================
// RUTA NO ENCONTRADA (dentro de /api)
// ============================================================
router.use('*', (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Endpoint no encontrado: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET    /api/health',
      'POST   /api/auth/login',
      'POST   /api/auth/logout',
      'POST   /api/auth/refresh',
      'GET    /api/auth/profile',
      'POST   /api/auth/change-password',
      'POST   /api/auth/recover-password',
      'GET    /api/pacientes',
      'POST   /api/pacientes',
      'GET    /api/pacientes/:id',
      'PUT    /api/pacientes/:id',
      'DELETE /api/pacientes/:id',
      'GET    /api/pacientes/stats',
      'GET    /api/pacientes/buscar/:termino',
      'GET    /api/pacientes/:id/historia',
      'GET    /api/pacientes/:id/antecedentes',
      'GET    /api/pacientes/:id/consultas',
      'GET    /api/pacientes/:id/vacunas',
      'GET    /api/usuarios',
      'POST   /api/usuarios',
      'GET    /api/usuarios/:id',
      'PUT    /api/usuarios/:id',
      'DELETE /api/usuarios/:id',
      'GET    /api/consultas',
      'POST   /api/consultas',
      'GET    /api/consultas/:id',
      'PUT    /api/consultas/:id',
      'DELETE /api/consultas/:id',
      'GET    /api/consultas/stats',
      'GET    /api/consultas/paciente/:pacienteId',
      'GET    /api/consultas/medico/:medicoId',
      'GET    /api/consultas/:id/signos-vitales',
      'POST   /api/consultas/:id/signos-vitales',
      'GET    /api/citas',
      'POST   /api/citas',
      'GET    /api/citas/:id',
      'PUT    /api/citas/:id',
      'DELETE /api/citas/:id',
      'GET    /api/citas/stats',
      'GET    /api/citas/paciente/:pacienteId',
      'GET    /api/citas/medico/:medicoId',
      'PATCH  /api/citas/:id/estado',
      'GET    /api/vacunas',
      'POST   /api/vacunas',
      'GET    /api/vacunas/:id',
      'PUT    /api/vacunas/:id',
      'DELETE /api/vacunas/:id',
      'GET    /api/vacunas/stats',
      'GET    /api/vacunas/paciente/:pacienteId',
      'GET    /api/dashboard/stats',
      'GET    /api/dashboard/charts',
      'GET    /api/dashboard/actividad',
      'GET    /api/dashboard/resumen',
    ],
  });
});

export default router;