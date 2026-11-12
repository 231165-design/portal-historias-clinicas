// ============================================================
// STORE: Interfaz de Usuario con Zustand
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, get) => ({
      // --- Estado ---
      sidebarOpen: false,
      sidebarCollapsed: false,
      theme: 'light',
      notifications: [],
      globalLoading: false,

      // --- Sidebar ---
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      openSidebar: () => set({ sidebarOpen: true }),

      closeSidebar: () => set({ sidebarOpen: false }),

      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // --- Tema ---
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';

          // Aplicar al HTML
          if (typeof document !== 'undefined') {
            if (newTheme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }

          return { theme: newTheme };
        }),

      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme });
      },

      // --- Loading global ---
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // --- Notificaciones ---
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              id: Date.now(),
              read: false,
              createdAt: new Date().toISOString(),
              ...notification,
            },
            ...state.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // --- Getters ---
      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);

export default useUIStore;