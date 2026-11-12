// ============================================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la raíz del backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ============================================================
// VALIDACIÓN DE VARIABLES CRÍTICAS
// ============================================================
const requiredVars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'JWT_SECRET'
];

const missingVars = requiredVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ ERROR: Faltan variables de entorno obligatorias:');
  missingVars.forEach((v) => console.error(`   - ${v}`));
  console.error('\n💡 Revisa tu archivo .env basándote en .env.example');
  process.exit(1);
}

// ============================================================
// EXPORTAR CONFIGURACIÓN
// ============================================================
export const config = {
  // --- Entorno ---
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // --- Servidor ---
  server: {
    port: parseInt(process.env.PORT, 10) || 4000,
    host: process.env.HOST || '0.0.0.0',
    apiPrefix: process.env.API_PREFIX || '/api',
    corsOrigin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:5173', 'http://localhost:3000'],
  },

  // --- Base de Datos ---
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true',
    timezone: process.env.DB_TIMEZONE || '-05:00',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
      min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  // --- JWT ---
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // --- Seguridad ---
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockoutMinutes: parseInt(process.env.LOCKOUT_MINUTES, 10) || 15,
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT, 10) || 30,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutos
    rateLimitMax: 100,
  },

  // --- Aplicación ---
  app: {
    name: process.env.APP_NAME || 'Sistema de Historias Clínicas',
    version: process.env.APP_VERSION || '1.0.0',
    timezone: process.env.APP_TIMEZONE || 'America/Lima',
    hcFormat: process.env.HC_FORMAT || 'YYYY-NNNNN',
    itemsPerPage: parseInt(process.env.ITEMS_PER_PAGE, 10) || 20,
  },

  // --- Logs ---
  logs: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    dir: process.env.LOG_DIR || 'logs',
  },

  // --- Uploads ---
  uploads: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocTypes: ['application/pdf', 'application/msword'],
    patientPhotosPath: 'uploads/pacientes',
    documentsPath: 'uploads/archivos',
    signaturesPath: 'uploads/firmas',
  },
};

export default config;