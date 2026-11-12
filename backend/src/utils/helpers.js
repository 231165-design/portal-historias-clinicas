// ============================================================
// UTILIDADES GENERALES
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import crypto from 'crypto';

// ============================================================
// FECHAS
// ============================================================
export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};

export const formatDateTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

// ============================================================
// STRINGS
// ============================================================
export const capitalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export const generateRandomString = (length = 10) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

// ============================================================
// VALIDACIONES
// ============================================================
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidDNI = (dni) => {
  return /^\d{8}$/.test(dni);
};

export const isValidPhone = (phone) => {
  return /^[0-9+\-\s()]{6,20}$/.test(phone);
};

// ============================================================
// PAGINACIÓN
// ============================================================
export const getPagination = (page = 1, limit = 20) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const offset = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    offset,
  };
};

export const getPaginationData = (count, page = 1, limit = 20) => {
  const totalPages = Math.ceil(count / limit);
  return {
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// ============================================================
// SANITIZACIÓN
// ============================================================
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.replace(/[<>]/g, '').trim();
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

// ============================================================
// IMC / SIGNOS VITALES
// ============================================================
export const calcularIMC = (peso, talla) => {
  if (!peso || !talla) return null;
  const tallaM = talla / 100;
  return Number((peso / (tallaM * tallaM)).toFixed(2));
};

export const clasificarIMC = (imc) => {
  if (!imc) return { label: '-', color: 'gray' };
  if (imc < 18.5) return { label: 'Bajo peso', color: 'yellow' };
  if (imc < 25) return { label: 'Normal', color: 'green' };
  if (imc < 30) return { label: 'Sobrepeso', color: 'orange' };
  if (imc < 35) return { label: 'Obesidad I', color: 'red' };
  if (imc < 40) return { label: 'Obesidad II', color: 'red' };
  return { label: 'Obesidad III', color: 'red' };
};

// ============================================================
// ARRAYS Y OBJETOS
// ============================================================
export const excludeFields = (obj, fields = []) => {
  const result = { ...obj };
  fields.forEach((field) => delete result[field]);
  return result;
};

export const pickFields = (obj, fields = []) => {
  const result = {};
  fields.forEach((field) => {
    if (obj[field] !== undefined) result[field] = obj[field];
  });
  return result;
};

// ============================================================
// DELAY (para simular latencia)
// ============================================================
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  formatDate,
  formatDateTime,
  calcularEdad,
  capitalize,
  normalizeString,
  generateRandomString,
  isValidEmail,
  isValidDNI,
  isValidPhone,
  getPagination,
  getPaginationData,
  sanitizeString,
  sanitizeObject,
  calcularIMC,
  clasificarIMC,
  excludeFields,
  pickFields,
  delay,
};