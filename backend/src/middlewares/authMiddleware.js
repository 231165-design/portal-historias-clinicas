// ============================================================
// MIDDLEWARE: Autenticación JWT
// ============================================================

import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { HTTP_STATUS, MESSAGES, MODULOS, ACCIONES_AUDIT } from '../config/constants.js';
import logger from '../config/logger.js';
import db from '../models/index.js';

const { Usuario, Rol, Auditoria } = db;

// ============================================================
// VERIFICAR TOKEN JWT
// ============================================================
export const authenticate = async (req, res, next) => {
  try {
    // 1. Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.TOKEN_REQUIRED,
      });
    }

    const token = authHeader.substring(7);

    // 2. Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Token expirado. Inicia sesión nuevamente.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.TOKEN_INVALID,
      });
    }

    // 3. Buscar usuario en BD
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [
        { model: Rol, as: 'rol', attributes: ['id', 'nombre', 'permisos'] },
      ],
    });

    if (!usuario) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    if (!usuario.activo) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.USER_INACTIVE,
      });
    }

    // 4. Verificar bloqueo
    if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.USER_BLOCKED,
        bloqueado_hasta: usuario.bloqueado_hasta,
      });
    }

    // 5. Adjuntar usuario al request
    req.user = usuario;
    req.userId = usuario.id;
    req.userRole = usuario.rol?.nombre;

    next();
  } catch (error) {
    logger.error('Error en authenticate:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_ERROR,
    });
  }
};

// ============================================================
// AUTENTICACIÓN OPCIONAL (no falla si no hay token)
// ============================================================
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const usuario = await Usuario.findByPk(decoded.id, {
        include: [{ model: Rol, as: 'rol' }],
      });

      if (usuario && usuario.activo) {
        req.user = usuario;
        req.userId = usuario.id;
        req.userRole = usuario.rol?.nombre;
      }
    } catch (err) {
      // Token inválido: continuar como anónimo
    }

    next();
  } catch (error) {
    next();
  }
};

export default { authenticate, optionalAuth };