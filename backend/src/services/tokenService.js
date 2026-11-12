// ============================================================
// SERVICIO: Gestión de Tokens JWT
// ============================================================

import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import logger from '../config/logger.js';

// ============================================================
// GENERAR ACCESS TOKEN
// ============================================================
export const generateAccessToken = (payload) => {
  try {
    return jwt.sign(
      {
        id: payload.id,
        dni: payload.dni,
        rol: payload.rol,
        posta_id: payload.posta_id,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
        algorithm: 'HS256',
      }
    );
  } catch (error) {
    logger.error('Error al generar access token:', error);
    throw error;
  }
};

// ============================================================
// GENERAR REFRESH TOKEN
// ============================================================
export const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(
      { id: payload.id, type: 'refresh' },
      config.jwt.refreshSecret,
      {
        expiresIn: config.jwt.refreshExpiresIn,
        algorithm: 'HS256',
      }
    );
  } catch (error) {
    logger.error('Error al generar refresh token:', error);
    throw error;
  }
};

// ============================================================
// GENERAR AMBOS TOKENS
// ============================================================
export const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
    tokenType: 'Bearer',
  };
};

// ============================================================
// VERIFICAR ACCESS TOKEN
// ============================================================
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
};

// ============================================================
// VERIFICAR REFRESH TOKEN
// ============================================================
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret);
    if (decoded.type !== 'refresh') {
      throw new Error('Tipo de token inválido');
    }
    return decoded;
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};

// ============================================================
// DECODIFICAR TOKEN (sin verificar)
// ============================================================
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};