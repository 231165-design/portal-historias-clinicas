// ============================================================
// MIDDLEWARE: Auditoría de Acciones
// ============================================================

import { ACCIONES_AUDIT, MODULOS } from '../config/constants.js';
import logger from '../config/logger.js';
import db from '../models/index.js';

const { Auditoria } = db;

// ============================================================
// REGISTRAR ACCIÓN EN AUDITORÍA
// ============================================================
export const auditLog = (accion, modulo, options = {}) => {
  return async (req, res, next) => {
    // Guardar la función original de res.json
    const originalJson = res.json.bind(res);

    // Interceptar la respuesta
    res.json = async (data) => {
      try {
        // Solo auditar si la operación fue exitosa
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const registro = {
            usuario_id: req.userId || null,
            accion,
            modulo,
            tabla: options.tabla || null,
            registro_id: options.getRegistroId ? options.getRegistroId(req, data) : null,
            datos_anteriores: options.datosAnteriores || null,
            datos_nuevos: options.datosNuevos ? options.datosNuevos(req, data) : null,
            ip: req.ip || req.connection?.remoteAddress || null,
            user_agent: req.get('user-agent') || null,
          };

          await Auditoria.create(registro);

          logger.audit(
            req.user,
            accion,
            modulo,
            { registro_id: registro.registro_id }
          );
        }
      } catch (err) {
        logger.error('Error al crear auditoría:', err.message);
      }

      return originalJson(data);
    };

    next();
  };
};

// ============================================================
// HELPERS RÁPIDOS
// ============================================================

// Auditar login
export const auditLogin = auditLog(ACCIONES_AUDIT.LOGIN, MODULOS.AUTH);

// Auditar logout
export const auditLogout = auditLog(ACCIONES_AUDIT.LOGOUT, MODULOS.AUTH);

// Auditar creación
export const auditCreate = (modulo, tabla) =>
  auditLog(ACCIONES_AUDIT.CREAR, modulo, {
    tabla,
    getRegistroId: (req, data) => data?.data?.id || null,
    datosNuevos: (req) => req.body,
  });

// Auditar edición
export const auditUpdate = (modulo, tabla) =>
  auditLog(ACCIONES_AUDIT.EDITAR, modulo, {
    tabla,
    getRegistroId: (req, data) => data?.data?.id || null,
    datosNuevos: (req) => req.body,
  });

// Auditar eliminación
export const auditDelete = (modulo, tabla) =>
  auditLog(ACCIONES_AUDIT.ELIMINAR, modulo, {
    tabla,
    getRegistroId: (req) => parseInt(req.params.id),
  });

// Auditar consulta
export const auditView = (modulo, tabla) =>
  auditLog(ACCIONES_AUDIT.CONSULTAR, modulo, { tabla });

export default {
  auditLog,
  auditLogin,
  auditLogout,
  auditCreate,
  auditUpdate,
  auditDelete,
  auditView,
};