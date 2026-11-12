import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-md">
        <div className="text-9xl font-extrabold text-primary-500 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h1>
        <p className="text-gray-500 mb-6">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          🏠 Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;