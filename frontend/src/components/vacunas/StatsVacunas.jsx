// ============================================================
// COMPONENTE: StatsVacunas
// ============================================================

import Card from '../ui/Card';
import { TIPOS_VACUNA } from '../../utils/constants';

function StatsVacunas({ stats = {}, loading = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl text-white shadow-md">
            💉
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Vacunas
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.total || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-2xl text-white shadow-md">
            📅
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Este Mes
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {loading ? '...' : stats.esteMes || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-2xl text-white shadow-md">
            🏆
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Más Aplicada
            </p>
            <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1 truncate">
              {loading ? '...' : (stats.topVacunas?.[0]?.nombre || '—')}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md" hover>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-md">
            🎯
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tipos
            </p>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
              {TIPOS_VACUNA.length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StatsVacunas;