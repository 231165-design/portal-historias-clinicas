// ============================================================
// PUNTO DE ENTRADA DEL SERVIDOR
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import app from './src/app.js';
import config from './src/config/env.js';
import { testConnection, closeConnection, syncDatabase } from './src/config/database.js';
import logger from './src/config/logger.js';
import db from './src/models/index.js';

// ============================================================
// ARRANCAR SERVIDOR
// ============================================================
const startServer = async () => {
  try {
    logger.info('============================================================');
    logger.info('🏥 SISTEMA DE HISTORIAS CLÍNICAS - POSTAS DE SALUD');
    logger.info(`🚀 Iniciando servidor...`);
    logger.info(`📦 Entorno: ${config.env}`);
    logger.info(`🔧 Versión: ${config.app.version}`);
    logger.info('============================================================');

    // 1. Probar conexión a la base de datos
    logger.info('🔌 Conectando a la base de datos...');
    const connected = await testConnection();
    if (!connected) {
      logger.error('❌ No se pudo conectar a la base de datos. Saliendo...');
      process.exit(1);
    }

    // 2. Sincronizar modelos (solo en desarrollo)
    if (config.isDev) {
      logger.info('🔄 Sincronizando modelos...');
      await syncDatabase({ alter: false });
      logger.info('✅ Modelos sincronizados');
    }

    // 3. Iniciar servidor HTTP
    const server = app.listen(config.server.port, config.server.host, () => {
      logger.info('============================================================');
      logger.info(`✅ Servidor corriendo correctamente`);
      logger.info(`🌐 URL: http://localhost:${config.server.port}`);
      logger.info(`🔗 API: http://localhost:${config.server.port}${config.server.apiPrefix}`);
      logger.info(`💓 Health: http://localhost:${config.server.port}${config.server.apiPrefix}/health`);
      logger.info('============================================================');
      logger.info('📋 Endpoints disponibles:');
      logger.info(`   POST   ${config.server.apiPrefix}/auth/login`);
      logger.info(`   POST   ${config.server.apiPrefix}/auth/logout`);
      logger.info(`   GET    ${config.server.apiPrefix}/auth/profile`);
      logger.info(`   GET    ${config.server.apiPrefix}/pacientes`);
      logger.info(`   POST   ${config.server.apiPrefix}/pacientes`);
      logger.info(`   GET    ${config.server.apiPrefix}/dashboard/stats`);
      logger.info('============================================================');
      logger.info('✨ Sistema listo para recibir peticiones');
      logger.info('============================================================');
    });

    // ============================================================
    // GRACEFUL SHUTDOWN
    // ============================================================
    const gracefulShutdown = async (signal) => {
      logger.info(`\n🛑 Señal ${signal} recibida. Cerrando servidor...`);

      server.close(async () => {
        logger.info('✅ Servidor HTTP cerrado');
        await closeConnection();
        logger.info('👋 Proceso terminado correctamente');
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        logger.error('❌ Cierre forzado después de 10 segundos');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ============================================================
    // MANEJO DE ERRORES NO CAPTURADOS
    // ============================================================
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Unhandled Rejection:', reason);
      logger.error('   Promise:', promise);
    });

    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', error);
      logger.error(error.stack);
    });

  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    logger.error(error.stack);
    process.exit(1);
  }
};

// ============================================================
// EJECUTAR
// ============================================================
startServer();