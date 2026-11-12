// ============================================================
// COMPONENTE: FormSOAP
// ============================================================

import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { TIPOS_ATENCION } from '../../utils/constants';

function FormSOAP({ formData, onChange, errors }) {
  return (
    <>
      {/* ============================================================ */}
      {/* S - SUBJETIVO */}
      {/* ============================================================ */}
      <Card title="💬 S — Subjetivo" subtitle="Motivo de consulta y síntomas" padding="md">
        <div className="space-y-4">
          <Select
            label="Tipo de atención"
            name="tipo_atencion"
            value={formData.tipo_atencion}
            onChange={onChange}
            options={TIPOS_ATENCION.map((t) => ({ value: t, label: t }))}
          />
          <Input
            label="Motivo de consulta"
            name="motivo_consulta"
            value={formData.motivo_consulta}
            onChange={onChange}
            placeholder="Ej: Dolor de cabeza persistente"
            error={errors.motivo_consulta}
            required
          />
          <Input
            label="Tiempo de enfermedad"
            name="tiempo_enfermedad"
            value={formData.tiempo_enfermedad}
            onChange={onChange}
            placeholder="Ej: 3 días"
          />
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Enfermedad actual
            </label>
            <textarea
              name="enfermedad_actual"
              value={formData.enfermedad_actual}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none"
              placeholder="Descripción detallada de los síntomas..."
            />
          </div>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* O - OBJETIVO */}
      {/* ============================================================ */}
      <Card title="🔍 O — Objetivo" subtitle="Hallazgos del examen físico" padding="md">
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Examen físico
          </label>
          <textarea
            name="examen_fisico"
            value={formData.examen_fisico}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none"
            placeholder="Descripción del examen físico..."
          />
        </div>
      </Card>

      {/* ============================================================ */}
      {/* A - ANÁLISIS */}
      {/* ============================================================ */}
      <Card title="📋 A — Análisis" subtitle="Diagnóstico del paciente" padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Diagnóstico principal"
            name="diagnostico_principal"
            value={formData.diagnostico_principal}
            onChange={onChange}
            placeholder="Ej: Cefalea tensional"
            error={errors.diagnostico_principal}
            required
          />
          <Input
            label="Código CIE-10"
            name="cie10_principal"
            value={formData.cie10_principal}
            onChange={onChange}
            placeholder="Ej: G44.2"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Diagnósticos secundarios
          </label>
          <textarea
            name="diagnosticos_secundarios"
            value={formData.diagnosticos_secundarios}
            onChange={onChange}
            rows={2}
            className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none"
            placeholder="Otros diagnósticos (opcional)"
          />
        </div>
      </Card>

      {/* ============================================================ */}
      {/* P - PLAN */}
      {/* ============================================================ */}
      <Card title="💊 P — Plan" subtitle="Tratamiento e indicaciones" padding="md">
        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tratamiento
            </label>
            <textarea
              name="tratamiento"
              value={formData.tratamiento}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none"
              placeholder="Medicamentos, dosis y frecuencia..."
            />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Indicaciones
            </label>
            <textarea
              name="indicaciones"
              value={formData.indicaciones}
              onChange={onChange}
              rows={2}
              className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none"
              placeholder="Reposo, dieta, etc..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="requiere_referencia"
              name="requiere_referencia"
              checked={formData.requiere_referencia}
              onChange={onChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-200"
            />
            <label htmlFor="requiere_referencia" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Requiere referencia a otro establecimiento
            </label>
          </div>

          {formData.requiere_referencia && (
            <Input
              label="Destino de la referencia"
              name="referencia_destino"
              value={formData.referencia_destino}
              onChange={onChange}
              placeholder="Ej: Hospital Nacional"
            />
          )}

          <Input
            label="Próxima cita"
            name="proxima_cita"
            type="date"
            value={formData.proxima_cita}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </Card>
    </>
  );
}

export default FormSOAP;