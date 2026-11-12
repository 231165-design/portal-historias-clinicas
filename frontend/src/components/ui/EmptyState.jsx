// ============================================================
// COMPONENTE: EmptyState
// ============================================================

import Button from './Button';

function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center mb-5">
        {Icon ? (
          <Icon className="w-10 h-10 text-primary-400" />
        ) : (
          <svg
            className="w-10 h-10 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2">{title || 'Sin resultados'}</h3>

      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;