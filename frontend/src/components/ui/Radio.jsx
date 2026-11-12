// ============================================================
// COMPONENTE: Radio
// ============================================================

function Radio({ label, name, value, checked, onChange, disabled = false, className = '' }) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer group ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-2 focus:ring-primary-200 disabled:opacity-50 cursor-pointer"
      />
      {label && (
        <span className="text-sm text-gray-700 select-none group-hover:text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
}

export default Radio;