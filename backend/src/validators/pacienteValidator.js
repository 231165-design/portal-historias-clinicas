// ============================================================
// VALIDADOR: Pacientes
// ============================================================

import { body, param, query } from 'express-validator';
import { REGEX, GRUPOS_SANGUINEOS, TIPOS_SEGURO_LIST } from '../config/constants.js';

// ============================================================
// VALIDAR CREACIÓN DE PACIENTE
// ============================================================
export const createPacienteValidator = [
  body('nombres')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('apellidos')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),

  body('dni')
    .optional({ checkFalsy: true })
    .trim()
    .matches(REGEX.DNI)
    .withMessage('El DNI debe tener exactamente 8 dígitos'),

  body('fecha_nacimiento')
    .notEmpty()
    .withMessage('La fecha de nacimiento es obligatoria')
    .isISO8601()
    .withMessage('Debe ser una fecha válida (YYYY-MM-DD)')
    .custom((value) => {
      const fecha = new Date(value);
      const hoy = new Date();
      if (fecha > hoy) {
        throw new Error('La fecha de nacimiento no puede ser futura');
      }
      const edad = hoy.getFullYear() - fecha.getFullYear();
      if (edad > 120) {
        throw new Error('La edad no puede superar los 120 años');
      }
      return true;
    }),

  body('sexo')
    .notEmpty()
    .withMessage('El sexo es obligatorio')
    .isIn(['M', 'F'])
    .withMessage('El sexo debe ser M o F'),

  body('telefono')
    .optional({ checkFalsy: true })
    .matches(REGEX.TELEFONO)
    .withMessage('El teléfono no es válido'),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),

  body('grupo_sanguineo')
    .optional({ checkFalsy: true })
    .isIn(GRUPOS_SANGUINEOS)
    .withMessage(`El grupo sanguíneo debe ser uno de: ${GRUPOS_SANGUINEOS.join(', ')}`),

  body('tipo_seguro')
    .optional({ checkFalsy: true })
    .isIn(TIPOS_SEGURO_LIST)
    .withMessage(`El tipo de seguro debe ser uno de: ${TIPOS_SEGURO_LIST.join(', ')}`),

  body('estado_civil')
    .optional({ checkFalsy: true })
    .isIn(['Soltero', 'Casado', 'Viudo', 'Divorciado', 'Conviviente'])
    .withMessage('Estado civil inválido'),

  body('posta_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID de la posta debe ser un número entero positivo'),
];

// ============================================================
// VALIDAR ACTUALIZACIÓN DE PACIENTE
// ============================================================
export const updatePacienteValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de paciente inválido'),

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

  body('telefono')
    .optional({ checkFalsy: true })
    .matches(REGEX.TELEFONO)
    .withMessage('El teléfono no es válido'),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),

  body('grupo_sanguineo')
    .optional({ checkFalsy: true })
    .isIn(GRUPOS_SANGUINEOS)
    .withMessage('Grupo sanguíneo inválido'),
];

// ============================================================
// VALIDAR BÚSQUEDA
// ============================================================
export const searchPacienteValidator = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La búsqueda debe tener entre 2 y 50 caracteres'),
];

// ============================================================
// VALIDAR ID DE PACIENTE
// ============================================================
export const pacienteIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de paciente inválido'),
];

// ============================================================
// VALIDAR TÉRMINO DE BÚSQUEDA
// ============================================================
export const buscarTerminoValidator = [
  param('termino')
    .trim()
    .notEmpty()
    .withMessage('El término de búsqueda es obligatorio')
    .isLength({ min: 2, max: 30 })
    .withMessage('El término debe tener entre 2 y 30 caracteres'),
];

export default {
  createPacienteValidator,
  updatePacienteValidator,
  searchPacienteValidator,
  pacienteIdValidator,
  buscarTerminoValidator,
};