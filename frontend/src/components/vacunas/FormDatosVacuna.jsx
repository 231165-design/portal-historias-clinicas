// ============================================================
// COMPONENTE: FormDatosVacuna
// ============================================================

import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { TIPOS_VACUNA } from '../../utils/constants';

const DOSIS_OPCIONES = [
  '1ra dosis',
  '2da dosis',
  '3ra dosis',
  '4ta dosis',
  'Refuerzo 1',
  'Refuerzo 2',
  'Dosis única',
  'Anual',
];

function FormDatosVacuna({ formData, onChange, errors }) {
  return (
    <Card title="💉 Datos de la Vacuna" subtitle="Información de la dosis aplicada" padding="md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tipo de vacuna *"
          name="tipo_vacuna"
          value={formData.tipo_vacuna}
          onChange={onChange}
          options={TIPOS_VACUNA.map((t) => ({ value: t, label: t }))}
          placeholder="Seleccione la vacuna"
          error={errors.tipo_vacuna}
          required
        />

        <Select
          label="Dosis"
          name="dosis"
          value={formData.dosis}
          onChange={onChange}
          options={DOSIS_OPCIONES.map((d) => ({ value: d, label: d }))}
        />

        <Input
          label="Fecha de aplicación *"
          name="fecha_aplicacion"
          type="date"
          value={formData.fecha_aplicacion}
          onChange={onChange}
          error={errors.fecha_aplicacion}
          required
          max={new Date().toISOString().split('T')[0]}
        />

        <Input
          label="Lugar de aplicación"
          name="lugar_aplicacion"
          value={formData.lugar_aplicacion}
          onChange={onChange}
          placeholder="Ej: Posta Médica San Juan"
        />

        <Input
          label="Lote"
          name="lote"
          value={formData.lote}
          onChange={onChange}
          placeholder="Ej: HB-2026-001"
        />

        <Input
          label="Laboratorio"
          name="laboratorio"
          value={formData.laboratorio}
          onChange={onChange}
          placeholder="Ej: Sinovac"
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
          placeholder="Reacciones adversas, observaciones, etc..."
        />
      </div>
    </Card>
  );
}

export default FormDatosVacuna;