// ============================================================
// COMPONENTE: TarjetaCita
// ============================================================

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatDateTime, calcularEdad } from '../../utils/formatters';

function TarjetaCita({ cita, onCambiarEstado, onCancelar }) {
  const edad = cita.paciente?.fecha_nacimiento
    ? calcularEdad(cita.paciente.fecha_nacimiento)
    : null;

  const getEstadoBadge = (estado) => {
    const variants = {
      Programada: 'info',
      Confirmada: 'cyan',
      Atendida: 'success',
      Cancelada: 'danger',
      'No asistió': 'gray',
    };
    return variants[estado] || 'gray';
  };

  return (
    <Card padding="md" hover>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Avatar */}
        <Avatar
          name={`${cita.paciente?.nombres} ${cita.paciente?.apellidos}`}
          size="lg"
        />

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-800 dark:text-white text-base">
              {cita.paciente?.nombres} {cita.paciente?.apellidos}
            </h3>
            <Badge variant={getEstadoBadge(cita.estado)} size="sm">
              {cita.estado}
            </Badge>
            {edad !== null && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {edad} años
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong className="text-gray-700 dark:text-gray-200">Motivo:</strong>{' '}
            {cita.motivo || 'Sin motivo especificado'}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>
              🩺 Dr(a). {cita.medico?.nombres} {cita.medico?.apellidos}
            </span>
            <span>📅 {formatDateTime(cita.fecha_hora)}</span>
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              🏷️ {cita.tipo}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
          {cita.estado === 'Programada' && (
            <Button
              variant="info"
              size="sm"
              onClick={() => onCambiarEstado(cita.id, 'Confirmada')}
            >
              ✓ Confirmar
            </Button>
          )}
          {cita.estado === 'Confirmada' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onCambiarEstado(cita.id, 'Atendida')}
            >
              ✓ Atender
            </Button>
          )}
          {(cita.estado === 'Programada' || cita.estado === 'Confirmada') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancelar(cita.id)}
            >
              ✕ Cancelar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default TarjetaCita;