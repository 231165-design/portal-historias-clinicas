// ============================================================
// UTILIDADES DE ENCRIPTACIÓN
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import config from '../config/env.js';
import logger from '../config/logger.js';

// ============================================================
// BCRYPT (para contraseñas)
// ============================================================
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(config.security.bcryptRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error('Error al hashear contraseña:', error);
    throw error;
  }
};

export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Error al comparar contraseña:', error);
    throw error;
  }
};

// ============================================================
// AES-256 (para datos sensibles)
// ============================================================
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = crypto
  .createHash('sha256')
  .update(config.jwt.secret)
  .digest();

const IV_LENGTH = 16;

export const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    logger.error('Error al encriptar:', error);
    throw error;
  }
};

export const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  try {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    logger.error('Error al desencriptar:', error);
    throw error;
  }
};

// ============================================================
// HASH SHA-256 (para integridad)
// ============================================================
export const sha256 = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

// ============================================================
// UUID / IDs ÚNICOS
// ============================================================
export const generateUUID = () => {
  return crypto.randomUUID();
};

export const generateNumericCode = (length = 6) => {
  let code = '';
  const digits = '0123456789';
  for (let i = 0; i < length; i++) {
    code += digits.charAt(crypto.randomInt(0, digits.length));
  }
  return code;
};

export const generateAlphanumericCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return code;
};

// ============================================================
// TOKENS
// ============================================================
export const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

export default {
  hashPassword,
  comparePassword,
  encrypt,
  decrypt,
  sha256,
  generateUUID,
  generateNumericCode,
  generateAlphanumericCode,
  generateSecureToken,
};