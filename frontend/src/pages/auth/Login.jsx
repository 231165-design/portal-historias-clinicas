// ============================================================
// PÁGINA: Login
// ============================================================

import LoginForm from '../../components/forms/LoginForm';

function Login() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up">
      {/* Logo móvil */}
      <div className="lg:hidden flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
          🏥
        </div>
        <div>
          <h1 className="font-extrabold text-gray-800">HIS Postas</h1>
          <p className="text-xs text-gray-400">Historias Clínicas</p>
        </div>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Iniciar Sesión</h2>
        <p className="text-sm text-gray-500">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      {/* Formulario */}
      <LoginForm />

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 HIS Postas - v1.0.0
      </p>
    </div>
  );
}

export default Login;