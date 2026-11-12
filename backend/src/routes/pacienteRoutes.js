// ============================================================
// RUTAS: Pacientes
// ============================================================

import { Router } from 'express';
import pacienteController from '../controllers/pacienteController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizePermission } from '../middlewares/roleMiddleware.js';
import { validate, validateDNI, required, validateDate, validateId } from '../middlewares/validateMiddleware.js';
import { auditCreate, auditUpdate, auditDelete } from '../middlewares/auditMiddleware.js';
import { createPacienteValidator, updatePacienteValidator } from '../validators/pacienteValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// ============================================================
// RUTAS ESPECÍFICAS (antes de /:id para evitar conflictos)
// ============================================================

// GET /api/pacientes/stats
router.get('/stats', pacienteController.getEstadisticas);

// GET /api/pacientes/buscar/:termino
router.get('/buscar/:termino', pacienteController.buscarPaciente);

// ============================================================
// CRUD DE PACIENTES
// ============================================================

// GET /api/pacientes
router.get('/', authorizePermission('pacientes:ver'), pacienteController.listPacientes);

// GET /api/pacientes/:id
router.get('/:id', validate([validateId()]), authorizePermission('pacientes:ver'), pacienteController.getPaciente);

// POST /api/pacientes
router.post(
  '/',
  authorizePermission('pacientes:crear'),
  validate([
    required('nombres', 'El nombre es obligatorio'),
    required('apellidos', 'El apellido es obligatorio'),
    validateDate('fecha_nacimiento'),
    required('sexo', 'El sexo es obligatorio'),
  ]),
  auditCreate('PACIENTES', 'pacientes'),
  pacienteController.createPaciente
);

// PUT /api/pacientes/:id
router.put(
  '/:id',
  validate([validateId()]),
  authorizePermission('pacientes:editar'),
  auditUpdate('PACIENTES', 'pacientes'),
  pacienteController.updatePaciente
);

// DELETE /api/pacientes/:id
router.delete(
  '/:id',
  validate([validateId()]),
  authorizePermission('pacientes:editar'),
  auditDelete('PACIENTES', 'pacientes'),
  pacienteController.deletePaciente
);

// ============================================================
// RUTAS DE HISTORIA CLÍNICA
// ============================================================

// GET /api/pacientes/:id/historia
router.get(
  '/:id/historia',
  validate([validateId()]),
  authorizePermission('historia:ver'),
  pacienteController.getHistoriaClinica
);

// GET /api/pacientes/:id/antecedentes
router.get(
  '/:id/antecedentes',
  validate([validateId()]),
  authorizePermission('historia:ver'),
  pacienteController.getAntecedentes
);

// GET /api/pacientes/:id/consultas
router.get(
  '/:id/consultas',
  validate([validateId()]),
  authorizePermission('pacientes:ver'),
  pacienteController.getConsultas
);

// GET /api/pacientes/:id/vacunas
router.get(
  '/:id/vacunas',
  validate([validateId()]),
  authorizePermission('pacientes:ver'),
  pacienteController.getVacunas
);

export default router;