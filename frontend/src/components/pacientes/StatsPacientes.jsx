// ============================================================
// COMPONENTE: StatsPacientes
// ============================================================

import Card from '../ui/Card';

function StatsPacientes({ stats = {}, loading = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-md">
            👥
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Pacientes
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.total || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl text-white shadow-md">
            📅
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Consultas Mes
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.consultasMes || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl text-white shadow-md">
            ⏰
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Citas Pendientes
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.citasPendientes || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl text-white shadow-md">
            💉
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Vacunas al Día
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.vacunasAlDia || 0}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StatsPacientes;