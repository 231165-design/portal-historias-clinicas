// ============================================================
// COMPONENTE: DetalleTabSOAP
// ============================================================

import Badge from '../ui/Badge';
import InfoItem from '../ui/InfoItem';
import { formatDate } from '../../utils/formatters';

function DetalleTabSOAP({ consulta }) {
  return (
    <div className="space-y-6">
      {/* S — Subjetivo */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💬</span>
          <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">
            S — Subjetivo
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Motivo de consulta" value={consulta.motivo_consulta} />
          <InfoItem label="Tiempo de enfermedad" value={consulta.tiempo_enfermedad || '—'} />
        </div>
        {consulta.enfermedad_actual && (
          <div className="mt-3">
            <InfoItem label="Enfermedad actual" value={consulta.enfermedad_actual} />
          </div>
        )}
      </div>

      {/* O — Objetivo */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🔍</span>
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
            O — Objetivo
          </h3>
        </div>
        <InfoItem label="Examen físico" value={consulta.examen_fisico || '—'} />
      </div>

      {/* A — Análisis */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📋</span>
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300">
            A — Análisis
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
              Diagnóstico principal
            </p>
            <div className="flex items-center gap-2">
              {consulta.cie10_principal && (
                <Badge variant="gray" size="sm">
                  {consulta.cie10_principal}
                </Badge>
              )}
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                {consulta.diagnostico_principal || '—'}
              </p>
            </div>
          </div>
          {consulta.diagnosticos_secundarios && (
            <InfoItem
              label="Diagnósticos secundarios"
              value={consulta.diagnosticos_secundarios}
            />
          )}
        </div>
      </div>

      {/* P — Plan */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💊</span>
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300">
            P — Plan
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Tratamiento" value={consulta.tratamiento || '—'} />
          <InfoItem label="Indicaciones" value={consulta.indicaciones || '—'} />
        </div>
        {consulta.proxima_cita && (
          <div className="mt-3">
            <InfoItem
              label="Próxima cita"
              value={formatDate(consulta.proxima_cita)}
            />
          </div>
        )}
        {consulta.requiere_referencia && (
          <div className="mt-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-700 dark:text-red-300">
              ⚠️ <strong>Requiere referencia:</strong>{' '}
              {consulta.referencia_destino || 'Destino no especificado'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleTabSOAP;