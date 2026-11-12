// ============================================================
// RUTAS: Citas
// ============================================================

import { Router } from 'express';
import citaController from '../controllers/citaController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizePermission } from '../middlewares/roleMiddleware.js';
import { validate, validateId, required } from '../middlewares/validateMiddleware.js';
import { auditCreate, auditUpdate, auditDelete } from '../middlewares/auditMiddleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// ============================================================
// RUTAS ESPECÍFICAS (antes de /:id para evitar conflictos)
// ============================================================

// GET /api/citas/stats
router.get('/stats', citaController.getEstadisticas);

// GET /api/citas/paciente/:pacienteId
router.get('/paciente/:pacienteId', citaController.getCitasByPaciente);

// GET /api/citas/medico/:medicoId
router.get('/medico/:medicoId', citaController.getCitasByMedico);

// ============================================================
// CRUD DE CITAS
// ============================================================

// GET /api/citas
router.get(
  '/',
  authorizePermission('citas:ver'),
  citaController.listCitas
);

// GET /api/citas/:id
router.get(
  '/:id',
  validate([validateId()]),
  authorizePermission('citas:ver'),
  citaController.getCita
);

// POST /api/citas
router.post(
  '/',
  authorizePermission('citas:crear'),
  validate([
    required('paciente_id', 'Debe seleccionar un paciente'),
    required('medico_id', 'Debe seleccionar un médico'),
    required('fecha_hora', 'La fecha es obligatoria'),
    required('motivo', 'El motivo es obligatorio'),
  ]),
  auditCreate('CITAS', 'citas'),
  citaController.createCita
);

// PUT /api/citas/:id
router.put(
  '/:id',
  validate([validateId()]),
  authorizePermission('citas:editar'),
  auditUpdate('CITAS', 'citas'),
  citaController.updateCita
);

// DELETE /api/citas/:id
router.delete(
  '/:id',
  validate([validateId()]),
  authorizePermission('citas:editar'),
  auditDelete('CITAS', 'citas'),
  citaController.deleteCita
);

// ============================================================
// CAMBIO DE ESTADO
// ============================================================

// PATCH /api/citas/:id/estado
router.patch(
  '/:id/estado',
  validate([validateId()]),
  authorizePermission('citas:editar'),
  citaController.cambiarEstado
);

export default router;