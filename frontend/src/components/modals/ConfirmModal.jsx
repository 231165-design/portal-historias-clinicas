// ============================================================
// COMPONENTE: ConfirmModal
// Modal de confirmación reutilizable
// ============================================================

import { useEffect } from 'react';
import Button from '../ui/Button';

// ============================================================
// CONFIGURACIÓN DE VARIANTES
// ============================================================
const VARIANTS = {
  danger: {
    icon: '⚠️',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonVariant: 'danger',
    buttonText: 'Eliminar',
  },
  warning: {
    icon: '⚠️',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonVariant: 'warning',
    buttonText: 'Continuar',
  },
  info: {
    icon: 'ℹ️',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonVariant: 'primary',
    buttonText: 'Aceptar',
  },
  success: {
    icon: '✅',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    buttonVariant: 'success',
    buttonText: 'Aceptar',
  },
  question: {
    icon: '❓',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    buttonVariant: 'primary',
    buttonText: 'Confirmar',
  },
};

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  variant = 'danger',
  confirmText,
  cancelText = 'Cancelar',
  loading = false,
  showCancel = true,
}) {
  const config = VARIANTS[variant] || VARIANTS.danger;

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, loading, onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error en confirmación:', error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="p-6">
          {/* Icono */}
          <div className="flex items-center justify-center mb-5">
            <div
              className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center text-4xl`}
            >
              {config.icon}
            </div>
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            {title}
          </h3>

          {/* Mensaje */}
          <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
            {message}
          </p>

          {/* Botones */}
          <div className="flex items-center justify-center gap-3">
            {showCancel && (
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                fullWidth
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant={config.buttonVariant}
              onClick={handleConfirm}
              loading={loading}
              fullWidth
            >
              {confirmText || config.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;