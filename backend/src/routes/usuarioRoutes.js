// ============================================================
// RUTAS: Usuarios (solo Admin)
// ============================================================

import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { validate, validateDNI, validateEmail, required, validateId } from '../middlewares/validateMiddleware.js';
import { auditCreate, auditUpdate, auditDelete } from '../middlewares/auditMiddleware.js';

const router = Router();

// Todas las rutas requieren autenticación Y ser admin
router.use(authenticate, isAdmin);

// ============================================================
// CRUD DE USUARIOS
// ============================================================

// GET /api/usuarios
router.get('/', usuarioController.listUsuarios);

// GET /api/usuarios/:id
router.get('/:id', validate([validateId()]), usuarioController.getUsuario);

// POST /api/usuarios
router.post(
  '/',
  validate([
    validateDNI('dni'),
    required('nombres', 'El nombre es obligatorio'),
    required('apellidos', 'El apellido es obligatorio'),
    validateEmail('email'),
    required('rol_id', 'El rol es obligatorio'),
  ]),
  auditCreate('USUARIOS', 'usuarios'),
  usuarioController.createUsuario
);

// PUT /api/usuarios/:id
router.put(
  '/:id',
  validate([validateId()]),
  auditUpdate('USUARIOS', 'usuarios'),
  usuarioController.updateUsuario
);

// DELETE /api/usuarios/:id
router.delete(
  '/:id',
  validate([validateId()]),
  auditDelete('USUARIOS', 'usuarios'),
  usuarioController.deleteUsuario
);

// PATCH /api/usuarios/:id/activate
router.patch('/:id/activate', validate([validateId()]), usuarioController.activateUsuario);

// POST /api/usuarios/:id/reset-password
router.post('/:id/reset-password', validate([validateId()]), usuarioController.resetPassword);

export default router;