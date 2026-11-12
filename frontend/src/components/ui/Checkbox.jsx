// ============================================================
// COMPONENTE: Checkbox
// ============================================================

function Checkbox({ label, name, checked, onChange, disabled = false, error, className = '' }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 rounded border-2 border-gray-300 text-primary-500 focus:ring-2 focus:ring-primary-200 disabled:opacity-50 cursor-pointer"
        />
        {label && (
          <span className="text-sm text-gray-700 select-none group-hover:text-gray-900">
            {label}
          </span>
        )}
      </label>
      {error && <p className="mt-1 text-xs text-medical-red">{error}</p>}
    </div>
  );
}

export default Checkbox;