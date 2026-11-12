// ============================================================
// RUTAS: Consultas
// ============================================================

import { Router } from 'express';
import consultaController from '../controllers/consultaController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizePermission } from '../middlewares/roleMiddleware.js';
import { validate, validateId, required, validateDate } from '../middlewares/validateMiddleware.js';
import { auditCreate, auditUpdate, auditDelete } from '../middlewares/auditMiddleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// ============================================================
// RUTAS ESPECÍFICAS (antes de /:id para evitar conflictos)
// ============================================================

// GET /api/consultas/stats
router.get('/stats', consultaController.getEstadisticas);

// GET /api/consultas/paciente/:pacienteId
router.get('/paciente/:pacienteId', consultaController.getConsultasByPaciente);

// GET /api/consultas/medico/:medicoId
router.get('/medico/:medicoId', consultaController.getConsultasByMedico);

// ============================================================
// CRUD DE CONSULTAS
// ============================================================

// GET /api/consultas
router.get(
  '/',
  authorizePermission('consultas:ver'),
  consultaController.listConsultas
);

// GET /api/consultas/:id
router.get(
  '/:id',
  validate([validateId()]),
  authorizePermission('consultas:ver'),
  consultaController.getConsulta
);

// POST /api/consultas
router.post(
  '/',
  authorizePermission('consultas:crear'),
  validate([
    required('paciente_id', 'Debe seleccionar un paciente'),
    required('motivo_consulta', 'El motivo de consulta es obligatorio'),
    required('diagnostico_principal', 'El diagnóstico es obligatorio'),
  ]),
  auditCreate('CONSULTAS', 'consultas'),
  consultaController.createConsulta
);

// PUT /api/consultas/:id
router.put(
  '/:id',
  validate([validateId()]),
  authorizePermission('consultas:editar'),
  auditUpdate('CONSULTAS', 'consultas'),
  consultaController.updateConsulta
);

// DELETE /api/consultas/:id (anular)
router.delete(
  '/:id',
  validate([validateId()]),
  authorizePermission('consultas:editar'),
  auditDelete('CONSULTAS', 'consultas'),
  consultaController.deleteConsulta
);

// ============================================================
// SIGNOS VITALES
// ============================================================

// GET /api/consultas/:id/signos-vitales
router.get(
  '/:id/signos-vitales',
  validate([validateId()]),
  authorizePermission('consultas:ver'),
  consultaController.getSignosVitales
);

// POST /api/consultas/:id/signos-vitales
router.post(
  '/:id/signos-vitales',
  validate([validateId()]),
  authorizePermission('signos_vitales:crear'),
  consultaController.registrarSignosVitales
);

export default router;