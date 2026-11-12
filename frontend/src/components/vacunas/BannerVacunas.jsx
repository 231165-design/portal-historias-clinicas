// ============================================================
// COMPONENTE: BannerVacunas
// ============================================================

function BannerVacunas() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-900 p-6 lg:p-8 text-white shadow-xl">
      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
            💉
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold">Gestión de Vacunas</h1>
            <p className="text-sm text-white/80 mt-1">
              Registro de vacunación de la posta
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
    </div>
  );
}

export default BannerVacunas;