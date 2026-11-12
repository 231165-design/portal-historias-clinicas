// ============================================================
// CONFIGURACIÓN DE LOGS - Winston
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// FORMATOS
// ============================================================
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length && meta.service === undefined
      ? ` ${JSON.stringify(meta)}`
      : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// ============================================================
// TRANSPORTS
// ============================================================
const transports = [];

// Consola
transports.push(
  new winston.transports.Console({
    format: consoleFormat,
    level: config.logs.level,
  })
);

// Archivo combinado
transports.push(
  new winston.transports.File({
    filename: path.join(config.logs.dir, 'combined.log'),
    format: fileFormat,
    level: 'info',
    maxsize: 20 * 1024 * 1024,
    maxFiles: 14,
  })
);

// Archivo solo errores
transports.push(
  new winston.transports.File({
    filename: path.join(config.logs.dir, 'error.log'),
    format: fileFormat,
    level: 'error',
    maxsize: 20 * 1024 * 1024,
    maxFiles: 30,
  })
);

// Archivo de accesos HTTP
transports.push(
  new winston.transports.File({
    filename: path.join(config.logs.dir, 'access.log'),
    format: fileFormat,
    level: 'http',
    maxsize: 20 * 1024 * 1024,
    maxFiles: 7,
  })
);

// ============================================================
// CREAR LOGGER
// ============================================================
const logger = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  defaultMeta: {
    service: 'his-postas-salud',
    env: config.env,
    version: config.app.version,
  },
  transports,
  exitOnError: false,
});

// ============================================================
// MÉTODOS PERSONALIZADOS
// ============================================================
logger.audit = (usuario, accion, modulo, detalle = {}) => {
  logger.info(`[AUDIT] ${accion} en ${modulo}`, {
    usuario_id: usuario?.id,
    usuario_nombre: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sistema',
    accion,
    modulo,
    ...detalle,
  });
};

logger.request = (req, res, responseTime) => {
  const { method, originalUrl, ip } = req;
  const { statusCode } = res;
  const usuario = req.user ? `${req.user.nombres} ${req.user.apellidos}` : 'Anónimo';

  logger.http(`${method} ${originalUrl} ${statusCode} - ${responseTime}ms`, {
    method,
    url: originalUrl,
    status: statusCode,
    ip,
    usuario,
    user_agent: req.get('user-agent'),
  });
};

logger.errorWithContext = (message, error, context = {}) => {
  logger.error(message, {
    error: error.message,
    stack: error.stack,
    ...context,
  });
};

// ============================================================
// STREAM PARA MORGAN
// ============================================================
export const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export default logger;