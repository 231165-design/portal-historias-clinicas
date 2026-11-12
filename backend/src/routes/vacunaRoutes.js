// ============================================================
// RUTAS: Vacunas
// ============================================================

import { Router } from 'express';
import vacunaController from '../controllers/vacunaController.js';
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

// GET /api/vacunas/stats
router.get('/stats', vacunaController.getEstadisticas);

// GET /api/vacunas/paciente/:pacienteId
router.get('/paciente/:pacienteId', vacunaController.getVacunasByPaciente);

// ============================================================
// CRUD DE VACUNAS
// ============================================================

// GET /api/vacunas
router.get(
  '/',
  authorizePermission('vacunas:ver'),
  vacunaController.listVacunas
);

// GET /api/vacunas/:id
router.get(
  '/:id',
  validate([validateId()]),
  authorizePermission('vacunas:ver'),
  vacunaController.getVacuna
);

// POST /api/vacunas
router.post(
  '/',
  authorizePermission('vacunas:crear'),
  validate([
    required('paciente_id', 'Debe seleccionar un paciente'),
    required('tipo_vacuna', 'El tipo de vacuna es obligatorio'),
    required('fecha_aplicacion', 'La fecha de aplicación es obligatoria'),
  ]),
  auditCreate('VACUNAS', 'vacunas'),
  vacunaController.createVacuna
);

// PUT /api/vacunas/:id
router.put(
  '/:id',
  validate([validateId()]),
  authorizePermission('vacunas:editar'),
  auditUpdate('VACUNAS', 'vacunas'),
  vacunaController.updateVacuna
);

// DELETE /api/vacunas/:id
router.delete(
  '/:id',
  validate([validateId()]),
  authorizePermission('vacunas:editar'),
  auditDelete('VACUNAS', 'vacunas'),
  vacunaController.deleteVacuna
);

export default router;