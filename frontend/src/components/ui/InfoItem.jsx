// ============================================================
// COMPONENTE: InfoItem
// Muestra un label + value con icono opcional
// ============================================================

function InfoItem({ label, value, icon }) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-lg mt-0.5">{icon}</span>}
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

export default InfoItem;