// ============================================================
// CONFIGURACIÓN DE EXPRESS
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/env.js';
import logger, { stream } from './config/logger.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';
import { generalLimiter } from './middlewares/rateLimitMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CREAR APP
// ============================================================
const app = express();

// ============================================================
// SEGURIDAD Y CONFIGURACIÓN BÁSICA
// ============================================================

// Helmet: cabeceras HTTP seguras
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, apps móviles)
      if (!origin) return callback(null, true);
      // Permitir todos los orígenes configurados
      if (config.server.corsOrigin.includes(origin)) {
        return callback(null, true);
      }
      // En desarrollo permitir todo
      if (config.isDev) return callback(null, true);
      
      logger.warn(`❌ CORS bloqueado para: ${origin}`);
      callback(new Error('No permitido por CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ============================================================
// PARSERS
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// LOGGING HTTP
// ============================================================
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream }));
}

// ============================================================
// ARCHIVOS ESTÁTICOS
// ============================================================
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(UPLOADS_DIR));
logger.info(`📁 Archivos estáticos: ${UPLOADS_DIR}`);

// ============================================================
// RATE LIMITING GLOBAL
// ============================================================
app.use(config.server.apiPrefix, generalLimiter);

// ============================================================
// RUTA RAÍZ
// ============================================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Sistema de Historias Clínicas - Postas de Salud',
    version: config.app.version,
    environment: config.env,
    documentation: `${config.server.apiPrefix}/health`,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// RUTAS DE LA API
// ============================================================
app.use(config.server.apiPrefix, apiRoutes);

// ============================================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================================
app.use(notFoundHandler);

// ============================================================
// MANEJO GLOBAL DE ERRORES
// ============================================================
app.use(errorHandler);

// ============================================================
// EXPORTAR APP
// ============================================================
export default app;