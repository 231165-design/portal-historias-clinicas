// ============================================================
// COMPONENTE: Tooltip
// ============================================================

function Tooltip({ children, content, position = 'top' }) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={`absolute ${positions[position]} hidden group-hover:block bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 pointer-events-none`}
      >
        {content}
      </div>
    </div>
  );
}

export default Tooltip;