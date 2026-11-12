// ============================================================
// COMPONENTE: FormSignosVitales
// ============================================================

import Card from '../ui/Card';
import Input from '../ui/Input';

function FormSignosVitales({ formData, onChange, errors, imc }) {
  return (
    <Card title="📊 Signos Vitales" subtitle="Opcional — complete si los registró" padding="md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          label="Temperatura (°C)"
          name="temperatura"
          type="number"
          step="0.1"
          value={formData.temperatura}
          onChange={onChange}
          placeholder="36.5"
          error={errors.temperatura}
        />
        <Input
          label="Peso (kg)"
          name="peso"
          type="number"
          step="0.1"
          value={formData.peso}
          onChange={onChange}
          placeholder="70"
          error={errors.peso}
        />
        <Input
          label="Talla (cm)"
          name="talla"
          type="number"
          step="0.1"
          value={formData.talla}
          onChange={onChange}
          placeholder="170"
          error={errors.talla}
        />
        <div>
          <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
            IMC
          </label>
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-800 dark:text-white">
            {imc || '—'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Input
          label="Presión Sistólica"
          name="presion_sistolica"
          type="number"
          value={formData.presion_sistolica}
          onChange={onChange}
          placeholder="120"
          error={errors.presion_sistolica}
        />
        <Input
          label="Presión Diastólica"
          name="presion_diastolica"
          type="number"
          value={formData.presion_diastolica}
          onChange={onChange}
          placeholder="80"
          error={errors.presion_diastolica}
        />
        <Input
          label="Frecuencia Cardíaca"
          name="frecuencia_cardiaca"
          type="number"
          value={formData.frecuencia_cardiaca}
          onChange={onChange}
          placeholder="75"
          error={errors.frecuencia_cardiaca}
        />
        <Input
          label="Frecuencia Respiratoria"
          name="frecuencia_respiratoria"
          type="number"
          value={formData.frecuencia_respiratoria}
          onChange={onChange}
          placeholder="18"
        />
        <Input
          label="Saturación O₂ (%)"
          name="saturacion_oxigeno"
          type="number"
          value={formData.saturacion_oxigeno}
          onChange={onChange}
          placeholder="98"
          error={errors.saturacion_oxigeno}
        />
        <Input
          label="Glucosa (mg/dL)"
          name="glucosa"
          type="number"
          value={formData.glucosa}
          onChange={onChange}
          placeholder="100"
        />
      </div>
    </Card>
  );
}

export default FormSignosVitales;