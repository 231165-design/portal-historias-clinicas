// ============================================================
// CONTROLADOR: Usuarios
// ============================================================

import usuarioService from '../services/usuarioService.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';
import logger from '../config/logger.js';

// ============================================================
// GET /api/usuarios
// ============================================================
export const listUsuarios = asyncHandler(async (req, res) => {
  const { page, limit, search, rol_id, activo } = req.query;

  const result = await usuarioService.listUsuarios({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    search,
    rol_id: rol_id ? parseInt(rol_id) : undefined,
    activo: activo !== undefined ? activo === 'true' : undefined,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    ...result,
  });
});

// ============================================================
// GET /api/usuarios/:id
// ============================================================
export const getUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const usuario = await usuarioService.getUsuarioById(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: usuario,
  });
});

// ============================================================
// POST /api/usuarios
// ============================================================
export const createUsuario = asyncHandler(async (req, res) => {
  const data = req.body;

  const usuario = await usuarioService.createUsuario(data);

  logger.info(`Usuario creado: ${usuario.dni}`);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CREATED_SUCCESS,
    data: usuario,
  });
});

// ============================================================
// PUT /api/usuarios/:id
// ============================================================
export const updateUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const usuario = await usuarioService.updateUsuario(parseInt(id), data);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.UPDATED_SUCCESS,
    data: usuario,
  });
});

// ============================================================
// DELETE /api/usuarios/:id
// ============================================================
export const deleteUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await usuarioService.deleteUsuario(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.DELETED_SUCCESS,
  });
});

// ============================================================
// PATCH /api/usuarios/:id/activate
// ============================================================
export const activateUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await usuarioService.activateUsuario(parseInt(id));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Usuario activado',
  });
});

// ============================================================
// POST /api/usuarios/:id/reset-password
// ============================================================
export const resetPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  await usuarioService.resetPassword(parseInt(id), password);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Contraseña reseteada',
  });
});

export default {
  listUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  activateUsuario,
  resetPassword,
};