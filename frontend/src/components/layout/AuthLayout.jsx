// ============================================================
// COMPONENTE: AuthLayout
// ============================================================

import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* LADO IZQUIERDO - BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-blue-600 to-blue-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">HIS Postas</h1>
              <p className="text-xs text-white/70">Sistema de Historias Clínicas</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Gestiona las historias clínicas de tu posta de forma digital
          </h2>
          <p className="text-lg text-white/80">
            Sistema profesional diseñado para optimizar la atención médica en postas de salud del Perú.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6">
            {[
              { icon: '👥', label: 'Pacientes' },
              { icon: '🩺', label: 'Consultas' },
              { icon: '💊', label: 'Farmacia' },
              { icon: '📊', label: 'Reportes' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60">
          © 2026 Ministerio de Salud - Todos los derechos reservados
        </div>
      </div>

      {/* LADO DERECHO - FORMULARIO */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;