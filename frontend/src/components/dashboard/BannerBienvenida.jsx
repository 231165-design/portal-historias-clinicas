// ============================================================
// COMPONENTE: BannerBienvenida
// ============================================================

function BannerBienvenida({ nombre }) {
  const fechaActual = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700 dark:from-primary-800 dark:via-blue-900 dark:to-purple-900 p-6 lg:p-8 text-white shadow-xl">
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
            🏥
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold">
              ¡Bienvenido, {nombre}!
            </h1>
            <p className="text-sm text-white/80 mt-1 capitalize">{fechaActual}</p>
          </div>
        </div>
        <p className="text-sm text-white/90 max-w-2xl">
          Sistema de Historias Clínicas y Gestión de Postas de Salud.
          <span className="ml-2 inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistema en línea
          </span>
        </p>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
    </div>
  );
}

export default BannerBienvenida;