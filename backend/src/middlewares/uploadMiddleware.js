// ============================================================
// MIDDLEWARE: Subida de Archivos (Multer)
// ============================================================

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from '../config/env.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// ASEGURAR QUE EXISTAN LAS CARPETAS
// ============================================================
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
ensureDir(path.join(UPLOADS_DIR, 'pacientes'));
ensureDir(path.join(UPLOADS_DIR, 'archivos'));
ensureDir(path.join(UPLOADS_DIR, 'firmas'));

// ============================================================
// CONFIGURACIÓN DE ALMACENAMIENTO
// ============================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'archivos';

    if (req.baseUrl.includes('pacientes') && file.fieldname === 'foto') {
      folder = 'pacientes';
    } else if (file.fieldname === 'firma') {
      folder = 'firmas';
    }

    cb(null, path.join(UPLOADS_DIR, folder));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${timestamp}-${random}${ext}`;
    cb(null, name);
  },
});

// ============================================================
// FILTRO DE ARCHIVOS
// ============================================================
const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`
      ),
      false
    );
  }
};

// ============================================================
// INSTANCIAS DE MULTER
// ============================================================

// --- Subida de fotos (pacientes, usuarios) ---
export const uploadPhoto = multer({
  storage,
  limits: { fileSize: config.uploads.maxFileSize },
  fileFilter: fileFilter(config.uploads.allowedImageTypes),
}).single('foto');

// --- Subida de archivos médicos (PDFs, docs) ---
export const uploadDocument = multer({
  storage,
  limits: { fileSize: config.uploads.maxFileSize },
  fileFilter: fileFilter([
    ...config.uploads.allowedImageTypes,
    ...config.uploads.allowedDocTypes,
  ]),
}).single('archivo');

// --- Subida de firma digital ---
export const uploadSignature = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter(config.uploads.allowedImageTypes),
}).single('firma');

// --- Múltiples archivos ---
export const uploadMultiple = multer({
  storage,
  limits: { fileSize: config.uploads.maxFileSize },
  fileFilter: fileFilter([
    ...config.uploads.allowedImageTypes,
    ...config.uploads.allowedDocTypes,
  ]),
}).array('archivos', 5);

// ============================================================
// WRAPPER PARA MANEJO DE ERRORES DE MULTER
// ============================================================
export const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.FILE_TOO_LARGE,
        });
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }

    if (err) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

export default {
  uploadPhoto,
  uploadDocument,
  uploadSignature,
  uploadMultiple,
  handleUpload,
};