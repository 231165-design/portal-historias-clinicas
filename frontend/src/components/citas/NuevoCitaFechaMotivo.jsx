// ============================================================
// COMPONENTE: NuevoCitaFechaMotivo
// ============================================================

import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';

const TIPOS_CITA = ['Consulta', 'Control', 'Vacunación', 'Laboratorio', 'Otro'];

function NuevoCitaFechaMotivo({ formData, onChange, errors }) {
  return (
    <Card title="📅 Fecha y Motivo" subtitle="¿Cuándo y por qué es la cita?" padding="md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fecha y hora *"
          name="fecha_hora"
          type="datetime-local"
          value={formData.fecha_hora}
          onChange={onChange}
          error={errors.fecha_hora}
          required
          min={new Date().toISOString().slice(0, 16)}
        />

        <Select
          label="Tipo de cita"
          name="tipo"
          value={formData.tipo}
          onChange={onChange}
          options={TIPOS_CITA.map((t) => ({ value: t, label: t }))}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Motivo de la cita *"
          name="motivo"
          value={formData.motivo}
          onChange={onChange}
          placeholder="Ej: Control de presión arterial"
          error={errors.motivo}
          required
        />
      </div>

      <div className="mt-4">
        <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Observaciones (opcional)
        </label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none"
          placeholder="Información adicional sobre la cita..."
        />
      </div>
    </Card>
  );
}

export default NuevoCitaFechaMotivo;