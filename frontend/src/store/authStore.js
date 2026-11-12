// ============================================================
// STORE: Autenticación con Zustand
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- Estado ---
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // --- Acciones ---

      /**
       * Iniciar sesión
       */
      login: async (dni, password) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.login(dni, password);

          if (result.success) {
            set({
              user: result.user,
              token: result.tokens?.accessToken,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return { success: true, user: result.user };
          } else {
            set({
              error: result.error || 'Credenciales inválidas',
              loading: false,
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({
            error: error.message || 'Error al iniciar sesión',
            loading: false,
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * Cerrar sesión
       */
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Error en logout:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      /**
       * Actualizar datos del usuario
       */
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      /**
       * Establecer usuario manualmente (al cargar sesión)
       */
      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: Boolean(user && token),
        });
      },

      /**
       * Verificar si el usuario tiene un rol
       */
      hasRole: (roles = []) => {
        const { user } = get();
        if (!user) return false;
        if (roles.length === 0) return true;
        return roles.includes(user.rol);
      },

      /**
       * Limpiar error
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;