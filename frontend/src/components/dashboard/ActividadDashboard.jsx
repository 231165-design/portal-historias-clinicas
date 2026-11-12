// ============================================================
// COMPONENTE: ActividadDashboard
// ============================================================

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDate, formatDateTime } from '../../utils/formatters';

function ActividadDashboard({ actividad = {} }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Últimas Consultas */}
      <div className="lg:col-span-2">
        <Card
          title="Últimas Consultas"
          subtitle="Registros recientes"
          padding="lg"
          action={
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold">
              Ver todas →
            </button>
          }
        >
          {actividad.ultimasConsultas && actividad.ultimasConsultas.length > 0 ? (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Fecha
                    </th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Paciente
                    </th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Diagnóstico
                    </th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {actividad.ultimasConsultas.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="py-2.5 px-2 text-gray-600 dark:text-gray-300 text-xs">
                        {formatDate(c.fecha_hora)}
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-gray-800 dark:text-white text-xs">
                        {c.paciente?.nombres} {c.paciente?.apellidos}
                      </td>
                      <td className="py-2.5 px-2 text-gray-600 dark:text-gray-300 text-xs">
                        {c.cie10_principal || '—'} {c.diagnostico_principal?.substring(0, 30)}
                        {c.diagnostico_principal?.length > 30 ? '...' : ''}
                      </td>
                      <td className="py-2.5 px-2">
                        <Badge
                          variant={c.estado === 'Completada' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {c.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay consultas registradas aún
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Timeline: Actividad Reciente */}
      <div>
        <Card
          title="Actividad Reciente"
          subtitle="Últimos movimientos"
          padding="lg"
          action={
            <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold">
              Ver más
            </button>
          }
        >
          {actividad.actividadReciente && actividad.actividadReciente.length > 0 ? (
            <div className="space-y-4">
              {actividad.actividadReciente.map((item, index) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                        item.color === 'green'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30'
                          : item.color === 'blue'
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      {item.icono}
                    </div>
                    {index < actividad.actividadReciente.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-xs font-semibold text-gray-800 dark:text-white">
                      {item.titulo}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {item.descripcion}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      {formatDateTime(item.fecha)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay actividad reciente
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ActividadDashboard;