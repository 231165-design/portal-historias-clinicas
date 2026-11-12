// ============================================================
// RUTAS: Autenticación
// ============================================================

import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { loginLimiter, recoveryLimiter } from '../middlewares/rateLimitMiddleware.js';
import { validate, validateDNI, required, validatePassword } from '../middlewares/validateMiddleware.js';
import { auditLogin, auditLogout } from '../middlewares/auditMiddleware.js';

const router = Router();

// ============================================================
// RUTAS PÚBLICAS
// ============================================================

// POST /api/auth/login
router.post(
  '/login',
  loginLimiter,
  validate([validateDNI('dni'), required('password', 'La contraseña es obligatoria')]),
  auditLogin,
  authController.login
);

// POST /api/auth/recover-password
router.post(
  '/recover-password',
  recoveryLimiter,
  validate([required('email', 'El email es obligatorio')]),
  authController.recoverPassword
);

// POST /api/auth/refresh
router.post('/refresh', authController.refresh);

// ============================================================
// RUTAS PROTEGIDAS
// ============================================================

// POST /api/auth/logout
router.post('/logout', authenticate, auditLogout, authController.logout);

// GET /api/auth/profile
router.get('/profile', authenticate, authController.getProfile);

// POST /api/auth/change-password
router.post(
  '/change-password',
  authenticate,
  validate([
    required('currentPassword', 'La contraseña actual es obligatoria'),
    validatePassword('newPassword'),
  ]),
  authController.changePassword
);

export default router;