// ============================================================
// MANEJADOR DE RESPUESTAS HTTP
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import { HTTP_STATUS } from '../config/constants.js';

// ============================================================
// RESPUESTA EXITOSA
// ============================================================
export const success = (res, data = null, message = 'Operación exitosa', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// ============================================================
// RESPUESTA DE CREACIÓN
// ============================================================
export const created = (res, data, message = 'Registro creado exitosamente') => {
  return success(res, data, message, HTTP_STATUS.CREATED);
};

// ============================================================
// RESPUESTA SIN CONTENIDO
// ============================================================
export const noContent = (res) => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};

// ============================================================
// RESPUESTA CON PAGINACIÓN
// ============================================================
export const paginated = (res, data, pagination, message = 'OK') => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
};

// ============================================================
// RESPUESTA DE ERROR
// ============================================================
export const error = (res, message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  });
};

// ============================================================
// ERROR DE VALIDACIÓN
// ============================================================
export const validationError = (res, errors, message = 'Error de validación') => {
  return error(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
};

// ============================================================
// ERROR NO AUTORIZADO
// ============================================================
export const unauthorized = (res, message = 'No autorizado') => {
  return error(res, message, HTTP_STATUS.UNAUTHORIZED);
};

// ============================================================
// ERROR PROHIBIDO
// ============================================================
export const forbidden = (res, message = 'Acceso denegado') => {
  return error(res, message, HTTP_STATUS.FORBIDDEN);
};

// ============================================================
// ERROR NO ENCONTRADO
// ============================================================
export const notFound = (res, message = 'Registro no encontrado') => {
  return error(res, message, HTTP_STATUS.NOT_FOUND);
};

// ============================================================
// ERROR DE CONFLICTO
// ============================================================
export const conflict = (res, message = 'El registro ya existe') => {
  return error(res, message, HTTP_STATUS.CONFLICT);
};

// ============================================================
// ERROR BAD REQUEST
// ============================================================
export const badRequest = (res, message = 'Solicitud inválida', details = null) => {
  return error(res, message, HTTP_STATUS.BAD_REQUEST, details);
};

// ============================================================
// RESPUESTA DE HEALTH CHECK
// ============================================================
export const health = (res, data) => {
  return success(res, data, 'Servidor funcionando correctamente');
};

export default {
  success,
  created,
  noContent,
  paginated,
  error,
  validationError,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  badRequest,
  health,
};