// ============================================================
// SERVICIO: Autenticación
// ============================================================

import api, { API_ENDPOINTS } from '../config/api';
import { STORAGE_KEYS } from '../utils/constants';

// ============================================================
// HELPER: Normalizar usuario (rol objeto → string)
// ============================================================
const normalizeUser = (userData) => {
  if (!userData) return null;

  const rolString =
    typeof userData.rol === 'object' && userData.rol !== null
      ? userData.rol.nombre || userData.rol.name || ''
      : userData.rol || '';

  return {
    ...userData,
    rol: rolString,
  };
};

// ============================================================
// LOGIN
// ============================================================
const login = async (dni, password) => {
  const response = await api.post(API_ENDPOINTS.auth.login, { dni, password });

  if (response.success && response.data) {
    const { user, tokens } = response.data;
    const normalizedUser = normalizeUser(user);

    localStorage.setItem(STORAGE_KEYS.TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));

    return { success: true, user: normalizedUser, tokens };
  }

  return { success: false, error: response.message || 'Error al iniciar sesión' };
};

// ============================================================
// LOGOUT
// ============================================================
const logout = async () => {
  try {
    await api.post(API_ENDPOINTS.auth.logout);
  } catch (error) {
    console.warn('Error en logout:', error.message);
  } finally {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// ============================================================
// OBTENER PERFIL
// ============================================================
const getProfile = async () => {
  const response = await api.get(API_ENDPOINTS.auth.profile);
  return normalizeUser(response.data);
};

// ============================================================
// REFRESH TOKEN
// ============================================================
const refreshToken = async (refreshTokenValue) => {
  const response = await api.post(API_ENDPOINTS.auth.refresh, {
    refreshToken: refreshTokenValue,
  });

  if (response.success && response.data) {
    const { tokens } = response.data;
    localStorage.setItem(STORAGE_KEYS.TOKEN, tokens.accessToken);
    return tokens;
  }

  throw new Error('No se pudo renovar el token');
};

// ============================================================
// ACTUALIZAR CREDENCIALES
// ============================================================
const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post(API_ENDPOINTS.auth.updateCredentials, {
    currentPassword,
    newPassword,
  });
  return response;
};

// ============================================================
// RECUPERAR ACCESO
// ============================================================
const recoverPassword = async (email) => {
  const response = await api.post(API_ENDPOINTS.auth.recoverAccess, { email });
  return response;
};

// ============================================================
// VERIFICAR SI ESTÁ AUTENTICADO
// ============================================================
const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return Boolean(token);
};

// ============================================================
// OBTENER USUARIO ACTUAL
// ============================================================
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? normalizeUser(JSON.parse(user)) : null;
  } catch {
    return null;
  }
};

export default {
  login,
  logout,
  getProfile,
  refreshToken,
  changePassword,
  recoverPassword,
  isAuthenticated,
  getCurrentUser,
};