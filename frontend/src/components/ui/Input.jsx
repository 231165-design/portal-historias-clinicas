// ============================================================
// COMPONENTE: Input
// ============================================================

function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helper,
  required = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  ...props
}) {
  const hasError = Boolean(error);

  const inputBase =
    'w-full px-4 py-2.5 text-sm rounded-lg border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed';

  const inputState = hasError
    ? 'border-medical-red focus:border-medical-red focus:ring-2 focus:ring-red-100 bg-red-50'
    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white hover:border-gray-300';

  const paddingIcon = Icon
    ? iconPosition === 'left'
      ? 'pl-10'
      : 'pr-10'
    : '';

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

      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputBase} ${inputState} ${paddingIcon}`}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

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

      {!error && helper && (
        <p className="mt-1.5 text-xs text-gray-500">{helper}</p>
      )}
    </div>
  );
}

export default Input;