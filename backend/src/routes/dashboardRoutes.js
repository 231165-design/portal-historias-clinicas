// ============================================================
// RUTAS: Dashboard
// ============================================================

import { Router } from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizePermission } from '../middlewares/roleMiddleware.js';

const router = Router();

// ============================================================
// MIDDLEWARES GLOBALES
// ============================================================
// Todas las rutas requieren autenticación
router.use(authenticate);

// ============================================================
// RUTAS DEL DASHBOARD
// ============================================================

/**
 * GET /api/dashboard/resumen
 * Retorna TODO el dashboard en una sola llamada:
 * - stats (4 tarjetas)
 * - charts (6 gráficos)
 * - actividad (timeline)
 * 
 * Ideal para cargar el dashboard de una sola vez.
 */
router.get('/resumen', dashboardController.getResumen);

/**
 * GET /api/dashboard/stats
 * Retorna las 4 tarjetas principales:
 * - totalPacientes
 * - consultasHoy
 * - citasPendientes
 * - stockBajo
 * 
 * Incluye variaciones porcentuales.
 */
router.get('/stats', dashboardController.getStats);

/**
 * GET /api/dashboard/charts
 * Retorna los datos para los gráficos:
 * - consultasPorMes (últimos 6 meses)
 * - consultasPorDia (últimos 7 días)
 * - distribucionDiagnosticos (top 5)
 * - distribucionSexo (M/F)
 * - distribucionEdad (5 rangos)
 */
router.get('/charts', dashboardController.getCharts);

/**
 * GET /api/dashboard/actividad
 * Retorna:
 * - ultimasConsultas (5 recientes)
 * - ultimosPacientes (5 recientes)
 * - ultimosUsuarios (5 recientes)
 * - actividadReciente (timeline unificado)
 */
router.get('/actividad', dashboardController.getActividad);

export default router;