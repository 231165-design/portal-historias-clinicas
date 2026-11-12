// ============================================================
// MIDDLEWARE: Validación de Datos
// ============================================================

import { validationResult, body, param, query } from 'express-validator';
import { HTTP_STATUS, MESSAGES, REGEX } from '../config/constants.js';

// ============================================================
// EJECUTAR VALIDACIONES
// ============================================================
export const validate = (rules) => {
  return async (req, res, next) => {
    // Ejecutar todas las reglas
    for (const rule of rules) {
      await rule.run(req);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
          value: e.value,
        })),
      });
    }

    next();
  };
};

// ============================================================
// REGLAS COMUNES
// ============================================================

// --- Validar DNI ---
export const validateDNI = (field = 'dni') =>
  body(field)
    .matches(REGEX.DNI)
    .withMessage('El DNI debe tener exactamente 8 dígitos');

// --- Validar Email ---
export const validateEmail = (field = 'email') =>
  body(field)
    .isEmail()
    .withMessage('Correo electrónico inválido')
    .normalizeEmail();

// --- Validar Teléfono ---
export const validatePhone = (field = 'telefono', required = false) => {
  const chain = body(field).optional({ checkFalsy: !required });
  return chain
    .matches(REGEX.TELEFONO)
    .withMessage('Teléfono inválido');
};

// --- Validar Contraseña ---
export const validatePassword = (field = 'password') =>
  body(field)
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres');

// --- Validar ID numérico ---
export const validateId = (field = 'id') =>
  param(field)
    .isInt({ min: 1 })
    .withMessage('ID inválido');

// --- Validar campo requerido ---
export const required = (field, message = 'Este campo es obligatorio') =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(message);

// --- Validar longitud ---
export const lengthBetween = (field, min, max) =>
  body(field)
    .isLength({ min, max })
    .withMessage(`Debe tener entre ${min} y ${max} caracteres`);

// --- Validar enum ---
export const isIn = (field, values) =>
  body(field)
    .isIn(values)
    .withMessage(`Debe ser uno de: ${values.join(', ')}`);

// --- Validar fecha ---
export const validateDate = (field) =>
  body(field)
    .isISO8601()
    .withMessage('Fecha inválida');

// --- Validar paginación (query params) ---
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número mayor a 0')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe estar entre 1 y 100')
    .toInt(),
];

export default {
  validate,
  validateDNI,
  validateEmail,
  validatePhone,
  validatePassword,
  validateId,
  required,
  lengthBetween,
  isIn,
  validateDate,
  validatePagination,
};