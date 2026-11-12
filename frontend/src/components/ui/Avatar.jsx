// ============================================================
// COMPONENTE: Avatar
// ============================================================

const SIZES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
  '2xl': 'w-20 h-20 text-3xl',
};

const COLORS = [
  'bg-primary-500',
  'bg-medical-green',
  'bg-medical-red',
  'bg-medical-yellow',
  'bg-medical-blue',
  'bg-medical-purple',
  'bg-medical-pink',
];

function Avatar({ name = '', src, size = 'md', status, className = '' }) {
  const sizeClasses = SIZES[size] || SIZES.md;

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');

  const colorIndex = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColor = COLORS[colorIndex % COLORS.length];

  const statusColors = {
    online: 'bg-medical-green',
    offline: 'bg-gray-400',
    busy: 'bg-medical-red',
    away: 'bg-medical-yellow',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses} rounded-full object-cover border-2 border-white shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeClasses} ${bgColor} rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm`}
        >
          {initials || '?'}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            statusColors[status] || statusColors.offline
          }`}
        ></span>
      )}
    </div>
  );
}

export default Avatar;