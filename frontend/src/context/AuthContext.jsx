// ============================================================
// CONTEXTO: Autenticación (Conectado al Backend)
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

// ============================================================
// HELPER: Normalizar usuario (rol objeto → string)
// ============================================================
const normalizeUser = (userData) => {
  if (!userData) return null;

  // El backend devuelve rol como objeto { id, nombre, permisos }
  // El frontend espera rol como string ('admin', 'medico', etc.)
  const rolString =
    typeof userData.rol === 'object' && userData.rol !== null
      ? userData.rol.nombre || userData.rol.name || ''
      : userData.rol || '';

  return {
    ...userData,
    rol: rolString,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== RESTAURAR SESIÓN AL CARGAR =====
  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (token && storedUser) {
          // Normalizar usuario guardado
          const userParsed = JSON.parse(storedUser);
          setUser(normalizeUser(userParsed));

          // Verificar token con el backend
          try {
            const profile = await authService.getProfile();
            if (profile) {
              const normalizedProfile = normalizeUser(profile);
              setUser(normalizedProfile);
              localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedProfile));
            }
          } catch (profileError) {
            // Token inválido o expirado → limpiar
            console.warn('Sesión expirada, limpiando...');
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Error al restaurar sesión:', err);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restaurarSesion();
  }, []);

  // ===== LOGIN =====
  const login = async (dni, password) => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.login(dni, password);

      if (result.success && result.user) {
        // Normalizar usuario antes de guardarlo
        const normalizedUser = normalizeUser(result.user);

        setUser(normalizedUser);
        setLoading(false);
        return { success: true, user: normalizedUser };
      } else {
        const errorMsg = result.error || 'Credenciales inválidas';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al iniciar sesión';
      setError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // ===== LOGOUT =====
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Error en logout:', err);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setError(null);
    }
  };

  // ===== VERIFICAR ROL =====
  const hasRole = (roles = []) => {
    if (!user || !user.rol) return false;
    if (roles.length === 0) return true;

    // Asegurar que user.rol sea string para comparar
    const userRol =
      typeof user.rol === 'object' && user.rol !== null
        ? user.rol.nombre
        : user.rol;

    return roles.includes(userRol);
  };

  // ===== ACTUALIZAR USUARIO =====
  const updateUser = (userData) => {
    const updatedUser = normalizeUser({ ...user, ...userData });
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  // ===== HELPERS ADICIONALES =====
  const isAdmin = () => hasRole(['admin']);
  const isMedico = () => hasRole(['medico']);
  const isEnfermera = () => hasRole(['enfermera']);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAdmin,
    isMedico,
    isEnfermera,
    updateUser,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default AuthContext;