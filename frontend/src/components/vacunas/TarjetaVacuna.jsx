// ============================================================
// COMPONENTE: TarjetaVacuna
// ============================================================

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatDate, calcularEdad } from '../../utils/formatters';

function TarjetaVacuna({ vacuna, onEliminar }) {
  const edad = vacuna.paciente?.fecha_nacimiento
    ? calcularEdad(vacuna.paciente.fecha_nacimiento)
    : null;

  return (
    <Card padding="md" hover>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <Avatar
          name={`${vacuna.paciente?.nombres} ${vacuna.paciente?.apellidos}`}
          size="lg"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-800 dark:text-white text-base">
              {vacuna.paciente?.nombres} {vacuna.paciente?.apellidos}
            </h3>
            <Badge variant="success" size="sm">
              💉 {vacuna.tipo_vacuna}
            </Badge>
            {edad !== null && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {edad} años
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong className="text-gray-700 dark:text-gray-200">Dosis:</strong>{' '}
            {vacuna.dosis || '—'} · <strong className="text-gray-700 dark:text-gray-200">Lote:</strong>{' '}
            {vacuna.lote || '—'}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>📅 Aplicada: {formatDate(vacuna.fecha_aplicacion)}</span>
            {vacuna.lugar_aplicacion && <span>📍 {vacuna.lugar_aplicacion}</span>}
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              📋 HC: {vacuna.paciente?.historia_clinica}
            </span>
          </div>
        </div>

        <div className="flex gap-2 lg:flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEliminar(vacuna.id)}
          >
            🗑️ Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default TarjetaVacuna;