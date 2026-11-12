// ============================================================
// VALIDADOR: Usuarios
// ============================================================

import { body, param } from 'express-validator';
import { REGEX, ROLES_LIST } from '../config/constants.js';

// ============================================================
// VALIDAR CREACIÓN DE USUARIO
// ============================================================
export const createUsuarioValidator = [
  body('dni')
    .trim()
    .notEmpty()
    .withMessage('El DNI es obligatorio')
    .matches(REGEX.DNI)
    .withMessage('El DNI debe tener exactamente 8 dígitos numéricos'),

  body('nombres')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('apellidos')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('rol_id')
    .notEmpty()
    .withMessage('El rol es obligatorio')
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero positivo'),

  body('telefono')
    .optional({ checkFalsy: true })
    .matches(REGEX.TELEFONO)
    .withMessage('El teléfono no es válido'),

  body('colegiatura')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage('La colegiatura no puede exceder los 30 caracteres'),
];

// ============================================================
// VALIDAR ACTUALIZACIÓN DE USUARIO
// ============================================================
export const updateUsuarioValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido'),

  body('nombres')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('apellidos')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres'),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('telefono')
    .optional({ checkFalsy: true })
    .matches(REGEX.TELEFONO)
    .withMessage('El teléfono no es válido'),

  body('colegiatura')
    .optional({ checkFalsy: true })
    .isLength({ max: 30 })
    .withMessage('La colegiatura no puede exceder los 30 caracteres'),
];

// ============================================================
// VALIDAR CAMBIO DE ROL
// ============================================================
export const changeRolValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido'),

  body('rol_id')
    .notEmpty()
    .withMessage('El rol es obligatorio')
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero positivo'),
];

// ============================================================
// VALIDAR RESET PASSWORD
// ============================================================
export const resetPasswordValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// ============================================================
// VALIDAR ID DE USUARIO
// ============================================================
export const usuarioIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido'),
];

export default {
  createUsuarioValidator,
  updateUsuarioValidator,
  changeRolValidator,
  resetPasswordValidator,
  usuarioIdValidator,
};