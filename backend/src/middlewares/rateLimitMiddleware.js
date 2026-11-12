// ============================================================
// MIDDLEWARE: Rate Limiting (Prevención de abuso)
// ============================================================

import rateLimit from 'express-rate-limit';
import { HTTP_STATUS } from '../config/constants.js';

// ============================================================
// LIMITADOR GENERAL (para toda la API)
// ============================================================
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por IP cada 15 min
  message: {
    success: false,
    message: 'Demasiadas peticiones. Intenta nuevamente en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

// ============================================================
// LIMITADOR ESTRICTO PARA LOGIN
// ============================================================
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 intentos por IP
  message: {
    success: false,
    message: 'Demasiados intentos de login. Espera 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  skipSuccessfulRequests: true, // No contar logins exitosos
});

// ============================================================
// LIMITADOR PARA CREACIÓN (anti-spam)
// ============================================================
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // 20 creaciones por minuto
  message: {
    success: false,
    message: 'Demasiadas creaciones. Intenta nuevamente en un minuto.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

// ============================================================
// LIMITADOR PARA RECUPERACIÓN DE CONTRASEÑA
// ============================================================
export const recoveryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 intentos por hora
  message: {
    success: false,
    message: 'Demasiados intentos. Espera 1 hora.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export default {
  generalLimiter,
  loginLimiter,
  createLimiter,
  recoveryLimiter,
};