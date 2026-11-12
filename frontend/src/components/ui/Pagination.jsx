// ============================================================
// COMPONENTE: Pagination
// ============================================================

function Pagination({ currentPage = 1, totalPages = 1, onPageChange, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
          <span className="font-semibold">{Math.min(currentPage * itemsPerPage, totalItems)}</span>{' '}
          de <span className="font-semibold">{totalItems}</span> registros
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={idx} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                page === currentPage
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Pagination;