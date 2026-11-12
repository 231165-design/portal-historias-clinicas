// ============================================================
// SERVICIO: Autenticación
// ============================================================

import bcrypt from 'bcrypt';
import db from '../models/index.js';
import config from '../config/env.js';
import logger from '../config/logger.js';
import { MESSAGES, ACCIONES_AUDIT, MODULOS } from '../config/constants.js';
import * as tokenService from './tokenService.js';
import * as auditService from './auditService.js';

const { Usuario, Rol, Sesion } = db;
const { Op } = db.Sequelize;

// ============================================================
// LOGIN
// ============================================================
export const login = async ({ dni, password, ip, userAgent }) => {
  // 1. Buscar usuario por DNI
  const usuario = await Usuario.findOne({
    where: { dni },
    include: [
      {
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre', 'permisos'],
      },
    ],
  });

  if (!usuario) {
    throw {
      statusCode: 401,
      message: MESSAGES.LOGIN_FAILED,
    };
  }

  // 2. Verificar si está activo
  if (!usuario.activo) {
    throw {
      statusCode: 403,
      message: MESSAGES.USER_INACTIVE,
    };
  }

  // 3. Verificar bloqueo
  if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
    const minutosRestantes = Math.ceil(
      (new Date(usuario.bloqueado_hasta) - new Date()) / 60000
    );
    throw {
      statusCode: 403,
      message: `Usuario bloqueado. Intenta en ${minutosRestantes} minutos.`,
    };
  }

  // 4. Verificar contraseña
  const passwordValida = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordValida) {
    // Incrementar intentos fallidos
    const intentos = usuario.intentos_fallidos + 1;
    const updateData = { intentos_fallidos: intentos };

    // Bloquear si supera el máximo
    if (intentos >= config.security.maxLoginAttempts) {
      updateData.bloqueado_hasta = new Date(
        Date.now() + config.security.lockoutMinutes * 60000
      );
      updateData.intentos_fallidos = 0;

      logger.warn(`🚫 Usuario bloqueado: ${dni} por ${config.security.lockoutMinutes} min`);
    }

    await usuario.update(updateData);

    throw {
      statusCode: 401,
      message: MESSAGES.LOGIN_FAILED,
      intentos_restantes: config.security.maxLoginAttempts - intentos,
    };
  }

  // 5. Login exitoso → resetear intentos
  await usuario.update({
    intentos_fallidos: 0,
    bloqueado_hasta: null,
    ultimo_acceso: new Date(),
  });

  // 6. Generar tokens
  const tokens = tokenService.generateTokens({
    id: usuario.id,
    dni: usuario.dni,
    rol: usuario.rol.nombre,
    posta_id: usuario.posta_id,
  });

  // 7. Guardar sesión
  await Sesion.create({
    usuario_id: usuario.id,
    token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    ip,
    user_agent: userAgent,
    expira_en: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8h
    activa: true,
  });

  // 8. Registrar auditoría
  await auditService.logAction({
    usuario_id: usuario.id,
    accion: ACCIONES_AUDIT.LOGIN,
    modulo: MODULOS.AUTH,
    ip,
    user_agent: userAgent,
  });

  logger.info(`✅ Login exitoso: ${usuario.nombres} ${usuario.apellidos} (${usuario.dni})`);

  // 9. Retornar datos
  return {
    user: usuario.toPublicJSON(),
    tokens,
  };
};

// ============================================================
// LOGOUT
// ============================================================
export const logout = async (usuarioId, token, ip, userAgent) => {
  // Desactivar sesión
  if (token) {
    await Sesion.update(
      { activa: false },
      { where: { usuario_id: usuarioId, token } }
    );
  }

  // Auditar
  await auditService.logAction({
    usuario_id: usuarioId,
    accion: ACCIONES_AUDIT.LOGOUT,
    modulo: MODULOS.AUTH,
    ip,
    user_agent: userAgent,
  });

  logger.info(`👋 Logout: usuario ${usuarioId}`);
  return { success: true };
};

// ============================================================
// REFRESH TOKEN
// ============================================================
export const refreshToken = async (refreshTokenValue) => {
  const decoded = tokenService.verifyRefreshToken(refreshTokenValue);

  const usuario = await Usuario.findByPk(decoded.id, {
    include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }],
  });

  if (!usuario || !usuario.activo) {
    throw {
      statusCode: 401,
      message: 'Usuario no válido',
    };
  }

  const tokens = tokenService.generateTokens({
    id: usuario.id,
    dni: usuario.dni,
    rol: usuario.rol.nombre,
    posta_id: usuario.posta_id,
  });

  return { tokens };
};

// ============================================================
// CAMBIAR CONTRASEÑA
// ============================================================
export const changePassword = async (usuarioId, currentPassword, newPassword) => {
  const usuario = await Usuario.findByPk(usuarioId);

  if (!usuario) {
    throw { statusCode: 404, message: 'Usuario no encontrado' };
  }

  const passwordValida = await bcrypt.compare(currentPassword, usuario.password_hash);

  if (!passwordValida) {
    throw { statusCode: 400, message: 'Contraseña actual incorrecta' };
  }

  await usuario.update({ password_hash: newPassword });

  logger.info(`🔑 Contraseña cambiada: usuario ${usuarioId}`);

  return { success: true, message: MESSAGES.PASSWORD_CHANGED };
};

// ============================================================
// RECUPERAR CONTRASEÑA (simulado)
// ============================================================
export const recoverPassword = async (email) => {
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    // Por seguridad, no revelar si el email existe
    return { success: true, message: 'Si el email existe, recibirás instrucciones' };
  }

  // Generar token temporal
  const resetToken = tokenService.generateAccessToken({
    id: usuario.id,
    type: 'reset',
  });

  logger.info(`📧 Recuperación solicitada: ${email}`);

  return {
    success: true,
    message: 'Si el email existe, recibirás instrucciones',
    // En producción NO devolver el token
    ...(config.isDev && { resetToken }),
  };
};

// ============================================================
// OBTENER PERFIL
// ============================================================
export const getProfile = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId, {
    include: [{ model: Rol, as: 'rol' }],
    attributes: { exclude: ['password_hash'] },
  });

  if (!usuario) {
    throw { statusCode: 404, message: 'Usuario no encontrado' };
  }

  return usuario;
};

export default {
  login,
  logout,
  refreshToken,
  changePassword,
  recoverPassword,
  getProfile,
};