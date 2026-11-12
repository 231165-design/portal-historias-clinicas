// ============================================================
// COMPONENTE: StatsConsultas
// ============================================================

import Card from '../ui/Card';

function StatsConsultas({ stats = {}, loading = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-md">
            👥
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Consultas
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loading ? '...' : stats.total}
              </p>
              {stats.variacion !== 0 && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    stats.variacion >= 0
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {stats.variacion >= 0 ? '↑' : '↓'} {Math.abs(stats.variacion)}%
                </span>
              )}
            </div>
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
              Hoy
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.hoy}
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
              Pendientes
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.pendientes}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl text-white shadow-md">
            🔄
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              En Seguimiento
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.seguimiento}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StatsConsultas;