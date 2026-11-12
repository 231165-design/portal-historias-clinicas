// ============================================================
// COMPONENTE: SelectorPacienteVacuna
// ============================================================

import Select from '../ui/Select';
import Card from '../ui/Card';
import { calcularEdad, formatDNI } from '../../utils/formatters';

function SelectorPacienteVacuna({
  pacientes,
  pacienteId,
  pacienteSeleccionado,
  onChange,
  error,
}) {
  return (
    <Card title="👤 Paciente" subtitle="Seleccione el paciente vacunado" padding="md">
      <Select
        label="Paciente *"
        name="paciente_id"
        value={pacienteId}
        onChange={onChange}
        options={pacientes.map((p) => ({
          value: p.id,
          label: `${p.nombres} ${p.apellidos} — HC: ${p.historia_clinica}`,
        }))}
        placeholder="Seleccione un paciente"
        error={error}
        required
      />

      {pacienteSeleccionado && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                DNI
              </p>
              <p className="text-gray-800 dark:text-white font-semibold">
                {formatDNI(pacienteSeleccionado.dni) || '—'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                Edad
              </p>
              <p className="text-gray-800 dark:text-white font-semibold">
                {calcularEdad(pacienteSeleccionado.fecha_nacimiento)} años
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                Sexo
              </p>
              <p className="text-gray-800 dark:text-white font-semibold">
                {pacienteSeleccionado.sexo === 'M' ? 'Masculino' : 'Femenino'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                Teléfono
              </p>
              <p className="text-gray-800 dark:text-white font-semibold">
                {pacienteSeleccionado.telefono || '—'}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default SelectorPacienteVacuna;