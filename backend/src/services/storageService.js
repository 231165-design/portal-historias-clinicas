// ============================================================
// SERVICIO: Almacenamiento de Archivos
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

// ============================================================
// GUARDAR ARCHIVO (ya viene de multer)
// ============================================================
export const saveFile = (file, folder = 'archivos') => {
  if (!file) {
    throw new Error('No se recibió ningún archivo');
  }

  const relativePath = path.join(folder, file.filename);
  const fullPath = path.join(UPLOADS_DIR, relativePath);

  return {
    nombre: file.originalname,
    filename: file.filename,
    ruta: relativePath,
    rutaCompleta: fullPath,
    tamaño: file.size,
    mimeType: file.mimetype,
    url: `/uploads/${relativePath}`,
  };
};

// ============================================================
// ELIMINAR ARCHIVO
// ============================================================
export const deleteFile = (relativePath) => {
  try {
    const fullPath = path.join(UPLOADS_DIR, relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info(`🗑️ Archivo eliminado: ${relativePath}`);
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Error al eliminar archivo:', error);
    throw error;
  }
};

// ============================================================
// VERIFICAR EXISTENCIA
// ============================================================
export const fileExists = (relativePath) => {
  const fullPath = path.join(UPLOADS_DIR, relativePath);
  return fs.existsSync(fullPath);
};

// ============================================================
// OBTENER INFORMACIÓN DE ARCHIVO
// ============================================================
export const getFileInfo = (relativePath) => {
  const fullPath = path.join(UPLOADS_DIR, relativePath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const stats = fs.statSync(fullPath);

  return {
    ruta: relativePath,
    rutaCompleta: fullPath,
    tamaño: stats.size,
    creado: stats.birthtime,
    modificado: stats.mtime,
  };
};

// ============================================================
// LIMPIAR ARCHIVOS ANTIGUOS
// ============================================================
export const cleanOldFiles = (folder = 'archivos', diasAntiguedad = 365) => {
  const folderPath = path.join(UPLOADS_DIR, folder);

  if (!fs.existsSync(folderPath)) return 0;

  const fechaLimite = Date.now() - diasAntiguedad * 24 * 60 * 60 * 1000;
  let eliminados = 0;

  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.mtimeMs < fechaLimite) {
      fs.unlinkSync(filePath); // <-- LÍNEA CORREGIDA (faltaba el paréntesis)
      eliminados++;
    }
  });

  logger.info(`🧹 Archivos eliminados: ${eliminados}`);
  return eliminados;
};

export default {
  saveFile,
  deleteFile,
  fileExists,
  getFileInfo,
  cleanOldFiles,
};