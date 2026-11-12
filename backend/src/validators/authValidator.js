// ============================================================
// VALIDADOR: Autenticación
// ============================================================

import { body } from 'express-validator';
import { REGEX } from '../config/constants.js';

// ============================================================
// VALIDAR LOGIN
// ============================================================
export const loginValidator = [
  body('dni')
    .trim()
    .notEmpty()
    .withMessage('El DNI es obligatorio')
    .matches(REGEX.DNI)
    .withMessage('El DNI debe tener exactamente 8 dígitos numéricos'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// ============================================================
// VALIDAR CAMBIO DE CONTRASEÑA
// ============================================================
export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(REGEX.PASSWORD)
    .withMessage('La contraseña debe incluir mayúscula, minúscula y número'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Debes confirmar la contraseña')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
];

// ============================================================
// VALIDAR RECUPERACIÓN DE CONTRASEÑA
// ============================================================
export const recoverPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
];

// ============================================================
// VALIDAR REFRESH TOKEN
// ============================================================
export const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('El refresh token es obligatorio'),
];

export default {
  loginValidator,
  changePasswordValidator,
  recoverPasswordValidator,
  refreshTokenValidator,
};