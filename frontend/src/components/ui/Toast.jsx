// ============================================================
// COMPONENTE: Toast (usando react-hot-toast)
// ============================================================

import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      border: '2px solid #10b981',
      padding: '12px 16px',
    },
    iconTheme: { primary: '#10b981', secondary: '#fff' },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      border: '2px solid #ef4444',
      padding: '12px 16px',
    },
    iconTheme: { primary: '#ef4444', secondary: '#fff' },
  });
};

export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      border: '2px solid #3b82f6',
      padding: '12px 16px',
    },
  });
};

export const showWarning = (message) => {
  toast(message, {
    icon: '⚠️',
    style: {
      border: '2px solid #f59e0b',
      padding: '12px 16px',
    },
  });
};

// Componente contenedor (por si se necesita)
function Toast({ children }) {
  return children;
}

export default Toast;