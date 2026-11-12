// ============================================================
// COMPONENTE: Spinner
// ============================================================

const SIZES = {
  xs: 'w-3 h-3 border-2',
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
};

function Spinner({ size = 'md', color = 'primary', text, fullScreen = false }) {
  const sizeClasses = SIZES[size] || SIZES.md;

  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-500',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-500',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClasses} ${colorClasses[color]} rounded-full animate-spin`}></div>
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default Spinner;