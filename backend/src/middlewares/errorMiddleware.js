// ============================================================
// MIDDLEWARE: Manejo Global de Errores
// ============================================================

import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import config from '../config/env.js';
import logger from '../config/logger.js';

// ============================================================
// CLASE DE ERROR PERSONALIZADO
// ============================================================
export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================================
// MANEJADOR GLOBAL DE ERRORES
// ============================================================
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || MESSAGES.INTERNAL_ERROR;
  let details = err.details || null;

  // --- Log ---
  if (statusCode >= 500) {
    logger.errorWithContext('Error del servidor', err, {
      method: req.method,
      url: req.originalUrl,
      userId: req.userId,
    });
  } else {
    logger.warn(`Error ${statusCode}: ${message}`, {
      method: req.method,
      url: req.originalUrl,
    });
  }

  // --- Errores específicos de Sequelize ---
  if (err.name === 'SequelizeValidationError') {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = MESSAGES.VALIDATION_ERROR;
    details = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = HTTP_STATUS.CONFLICT;
    message = MESSAGES.DUPLICATE;
    details = err.errors.map((e) => ({
      field: e.path,
      message: `${e.path} ya está registrado`,
    }));
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Referencia inválida a otro registro';
  }

  if (err.name === 'SequelizeDatabaseError') {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    message = MESSAGES.DATABASE_ERROR;
  }

  // --- Errores de JWT ---
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = MESSAGES.TOKEN_INVALID;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expirado';
  }

  // --- Respuesta ---
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(config.isDev && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

// ============================================================
// MANEJADOR DE RUTAS NO ENCONTRADAS (404)
// ============================================================
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
  });
};

// ============================================================
// WRAPPER PARA CONTROLADORES ASYNC
// ============================================================
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default { errorHandler, notFoundHandler, asyncHandler, AppError };