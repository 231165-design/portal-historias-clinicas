// ============================================================
// CONTROLADOR: Autenticación
// ============================================================

import authService from '../services/authService.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';
import logger from '../config/logger.js';

// ============================================================
// POST /api/auth/login
// ============================================================
export const login = asyncHandler(async (req, res) => {
  const { dni, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent');

  const result = await authService.login({ dni, password, ip, userAgent });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.LOGIN_SUCCESS,
    data: result,
  });
});

// ============================================================
// POST /api/auth/logout
// ============================================================
export const logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.substring(7);
  const ip = req.ip;
  const userAgent = req.get('user-agent');

  await authService.logout(req.userId, token, ip, userAgent);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.LOGOUT_SUCCESS,
  });
});

// ============================================================
// POST /api/auth/refresh
// ============================================================
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshToken(refreshToken);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Token renovado',
    data: result,
  });
});

// ============================================================
// GET /api/auth/profile
// ============================================================
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: profile,
  });
});

// ============================================================
// POST /api/auth/change-password
// ============================================================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await authService.changePassword(req.userId, currentPassword, newPassword);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.PASSWORD_CHANGED,
  });
});

// ============================================================
// POST /api/auth/recover-password
// ============================================================
export const recoverPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.recoverPassword(email);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    ...result,
  });
});

export default {
  login,
  logout,
  refresh,
  getProfile,
  changePassword,
  recoverPassword,
};