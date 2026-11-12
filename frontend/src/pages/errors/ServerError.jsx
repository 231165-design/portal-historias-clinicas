function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-md">
        <div className="text-9xl font-extrabold text-amber-500 mb-4">500</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Error del Servidor</h1>
        <p className="text-gray-500 mb-6">
          Algo salió mal. Por favor, intenta nuevamente más tarde.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          🔄 Recargar página
        </button>
      </div>
    </div>
  );
}

export default ServerError;