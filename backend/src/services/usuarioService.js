// ============================================================
// SERVICIO: Gestión de Usuarios
// ============================================================

import db from '../models/index.js';
import logger from '../config/logger.js';
import { MESSAGES } from '../config/constants.js';

const { Usuario, Rol } = db;
const { Op } = db.Sequelize;

// ============================================================
// LISTAR USUARIOS (CON PAGINACIÓN Y FILTROS)
// ============================================================
export const listUsuarios = async ({
  page = 1,
  limit = 20,
  search,
  rol_id,
  activo,
} = {}) => {
  const where = {};

  if (search) {
    where[Op.or] = [
      { nombres: { [Op.like]: `%${search}%` } },
      { apellidos: { [Op.like]: `%${search}%` } },
      { dni: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  if (rol_id) where.rol_id = rol_id;
  if (activo !== undefined) where.activo = activo;

  const offset = (page - 1) * limit;

  const { rows, count } = await Usuario.findAndCountAll({
    where,
    include: [
      { model: Rol, as: 'rol', attributes: ['id', 'nombre'] },
    ],
    attributes: { exclude: ['password_hash'] },
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
// OBTENER USUARIO POR ID
// ============================================================
export const getUsuarioById = async (id) => {
  const usuario = await Usuario.findByPk(id, {
    include: [{ model: Rol, as: 'rol' }],
    attributes: { exclude: ['password_hash'] },
  });

  if (!usuario) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  return usuario;
};

// ============================================================
// CREAR USUARIO
// ============================================================
export const createUsuario = async (data) => {
  // Verificar DNI único
  const existeDNI = await Usuario.findOne({ where: { dni: data.dni } });
  if (existeDNI) {
    throw { statusCode: 409, message: 'El DNI ya está registrado' };
  }

  // Verificar email único
  const existeEmail = await Usuario.findOne({ where: { email: data.email } });
  if (existeEmail) {
    throw { statusCode: 409, message: 'El email ya está registrado' };
  }

  const usuario = await Usuario.create({
    ...data,
    password_hash: data.password || 'HisPostas2026!', // Contraseña por defecto
    activo: true,
  });

  logger.info(`✅ Usuario creado: ${usuario.dni} - ${usuario.nombres}`);

  return usuario.toPublicJSON();
};

// ============================================================
// ACTUALIZAR USUARIO
// ============================================================
export const updateUsuario = async (id, data) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  // Verificar email único si cambia
  if (data.email && data.email !== usuario.email) {
    const existeEmail = await Usuario.findOne({
      where: { email: data.email, id: { [Op.ne]: id } },
    });
    if (existeEmail) {
      throw { statusCode: 409, message: 'El email ya está registrado' };
    }
  }

  // No permitir cambiar el hash directamente
  delete data.password_hash;
  if (data.password) {
    data.password_hash = data.password;
    delete data.password;
  }

  await usuario.update(data);

  logger.info(`✏️ Usuario actualizado: ${usuario.dni}`);

  return usuario.toPublicJSON();
};

// ============================================================
// DESACTIVAR USUARIO (soft delete)
// ============================================================
export const deleteUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  await usuario.update({ activo: false });

  logger.info(`🗑️ Usuario desactivado: ${usuario.dni}`);

  return { success: true, message: MESSAGES.DELETED_SUCCESS };
};

// ============================================================
// ACTIVAR USUARIO
// ============================================================
export const activateUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  await usuario.update({ activo: true });

  return { success: true, message: 'Usuario activado' };
};

// ============================================================
// RESET PASSWORD (admin)
// ============================================================
export const resetPassword = async (id, newPassword) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw { statusCode: 404, message: MESSAGES.NOT_FOUND };
  }

  await usuario.update({ password_hash: newPassword });

  logger.info(`🔑 Password reseteado: ${usuario.dni}`);

  return { success: true, message: 'Contraseña actualizada' };
};

export default {
  listUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  activateUsuario,
  resetPassword,
};