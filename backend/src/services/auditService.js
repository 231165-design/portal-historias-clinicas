// ============================================================
// SERVICIO: Auditoría
// ============================================================

import db from '../models/index.js';
import logger from '../config/logger.js';

const { Auditoria, Usuario } = db;

// ============================================================
// REGISTRAR ACCIÓN
// ============================================================
export const logAction = async ({
  usuario_id,
  accion,
  modulo,
  tabla,
  registro_id,
  datos_anteriores,
  datos_nuevos,
  ip,
  user_agent,
}) => {
  try {
    const registro = await Auditoria.create({
      usuario_id,
      accion,
      modulo,
      tabla,
      registro_id,
      datos_anteriores: datos_anteriores || null,
      datos_nuevos: datos_nuevos || null,
      ip,
      user_agent,
    });

    logger.audit(
      { id: usuario_id },
      accion,
      modulo,
      { tabla, registro_id }
    );

    return registro;
  } catch (error) {
    logger.error('Error al registrar auditoría:', error);
    throw error;
  }
};

// ============================================================
// LISTAR AUDITORÍA (CON FILTROS)
// ============================================================
export const listAuditoria = async ({
  page = 1,
  limit = 20,
  usuario_id,
  accion,
  modulo,
  tabla,
  fechaDesde,
  fechaHasta,
} = {}) => {
  const where = {};

  if (usuario_id) where.usuario_id = usuario_id;
  if (accion) where.accion = accion;
  if (modulo) where.modulo = modulo;
  if (tabla) where.tabla = tabla;

  if (fechaDesde || fechaHasta) {
    where.created_at = {};
    if (fechaDesde) where.created_at[db.Sequelize.Op.gte] = new Date(fechaDesde);
    if (fechaHasta) where.created_at[db.Sequelize.Op.lte] = new Date(fechaHasta);
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Auditoria.findAndCountAll({
    where,
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombres', 'apellidos', 'dni', 'email'],
        required: false,
      },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

// ============================================================
// ESTADÍSTICAS DE AUDITORÍA
// ============================================================
export const getEstadisticasAuditoria = async () => {
  const total = await Auditoria.count();

  const porAccion = await Auditoria.findAll({
    attributes: [
      'accion',
      [db.sequelize.fn('COUNT', db.sequelize.col('accion')), 'total'],
    ],
    group: ['accion'],
    raw: true,
  });

  const porModulo = await Auditoria.findAll({
    attributes: [
      'modulo',
      [db.sequelize.fn('COUNT', db.sequelize.col('modulo')), 'total'],
    ],
    group: ['modulo'],
    raw: true,
  });

  return { total, porAccion, porModulo };
};

// ============================================================
// LIMPIAR AUDITORÍA ANTIGUA (opcional)
// ============================================================
export const cleanOldAuditoria = async (diasAntiguedad = 365) => {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);

  const deleted = await Auditoria.destroy({
    where: {
      created_at: {
        [db.Sequelize.Op.lt]: fechaLimite,
      },
    },
  });

  logger.info(`🧹 Auditoría antigua eliminada: ${deleted} registros`);
  return deleted;
};

export default {
  logAction,
  listAuditoria,
  getEstadisticasAuditoria,
  cleanOldAuditoria,
};