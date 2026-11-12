// ============================================================
// COMPONENTE: StatsDashboard
// ============================================================

import Card from '../ui/Card';

function StatsDashboard({ stats = {} }) {
  const tarjetas = [
    {
      label: 'Total Pacientes',
      value: stats.totalPacientes || 0,
      variacion: stats.pacientesVariacion,
      icon: '👥',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Consultas Hoy',
      value: stats.consultasHoy || 0,
      variacion: stats.consultasVariacion,
      icon: '🩺',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Citas Pendientes',
      value: stats.citasPendientes || 0,
      icon: '📅',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Stock Bajo',
      value: stats.stockBajo || 0,
      icon: '💊',
      gradient: 'from-red-500 to-red-600',
      alerta: stats.stockBajo > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tarjetas.map((tarjeta) => (
        <Card key={tarjeta.label} padding="md" hover>
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tarjeta.gradient} flex items-center justify-center text-2xl text-white shadow-md`}
            >
              {tarjeta.icon}
            </div>
            {tarjeta.variacion !== undefined && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  tarjeta.variacion >= 0
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {tarjeta.variacion >= 0 ? '↑' : '↓'} {Math.abs(tarjeta.variacion)}%
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {tarjeta.label}
          </p>
          <p className="text-3xl font-extrabold text-gray-800 dark:text-white mt-1">
            {tarjeta.value}
          </p>
          {tarjeta.alerta && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">
              ⚠ Requiere atención
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}

export default StatsDashboard;