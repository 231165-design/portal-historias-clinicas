// ============================================================
// COMPONENTE: Select
// ============================================================

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccione una opción',
  error,
  required = false,
  disabled = false,
  fullWidth = true,
  className = '',
  ...props
}) {
  const hasError = Boolean(error);

  const selectBase =
    'w-full px-4 py-2.5 text-sm rounded-lg border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right pr-10';

  const selectState = hasError
    ? 'border-medical-red focus:border-medical-red focus:ring-2 focus:ring-red-100 bg-red-50'
    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white hover:border-gray-300';

  const chevronSVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1.5 text-sm font-semibold text-gray-700"
        >
          {label}
          {required && <span className="text-medical-red ml-1">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${selectBase} ${selectState}`}
        style={{
          backgroundImage: chevronSVG,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem',
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      {error && (
        <p className="mt-1.5 text-xs text-medical-red flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;