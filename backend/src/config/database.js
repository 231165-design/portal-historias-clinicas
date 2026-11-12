// ============================================================
// CONFIGURACIÓN DE BASE DE DATOS - Sequelize + MySQL
// Sistema de Historias Clínicas - Postas de Salud
// ============================================================

import { Sequelize } from 'sequelize';
import config from './env.js';
import logger from './logger.js';

// ============================================================
// CREAR INSTANCIA DE SEQUELIZE
// ============================================================
const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: config.db.logging ? (msg) => logger.debug(msg) : false,
    timezone: config.db.timezone,
    pool: config.db.pool,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  }
);

// ============================================================
// FUNCIÓN: Probar conexión
// ============================================================
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a la base de datos establecida correctamente');
    logger.info(`   📦 Base de datos: ${config.db.name}`);
    logger.info(`   🌐 Host: ${config.db.host}:${config.db.port}`);
    return true;
  } catch (error) {
    logger.error('❌ Error al conectar con la base de datos:', error.message);
    logger.error('   💡 Verifica que MySQL (XAMPP) esté corriendo y las credenciales en .env');
    return false;
  }
};

// ============================================================
// FUNCIÓN: Sincronizar modelos (solo desarrollo)
// ============================================================
export const syncDatabase = async (options = {}) => {
  try {
    const syncOptions = {
      alter: config.isDev ? true : false,
      force: false,
      ...options,
    };
    await sequelize.sync(syncOptions);
    logger.info('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    logger.error('❌ Error al sincronizar modelos:', error.message);
    throw error;
  }
};

// ============================================================
// FUNCIÓN: Cerrar conexión
// ============================================================
export const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('🔌 Conexión a la base de datos cerrada');
  } catch (error) {
    logger.error('❌ Error al cerrar conexión:', error.message);
  }
};

// ============================================================
// EXPORTACIONES
// ============================================================
export { sequelize, Sequelize };
export default sequelize;