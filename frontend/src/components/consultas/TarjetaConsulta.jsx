// ============================================================
// COMPONENTE: TarjetaConsulta
// ============================================================

import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatDateTime, calcularEdad } from '../../utils/formatters';

function TarjetaConsulta({ consulta }) {
  const navigate = useNavigate();
  const edad = consulta.paciente?.fecha_nacimiento
    ? calcularEdad(consulta.paciente.fecha_nacimiento)
    : null;

  const getEstadoBadge = (estado) => {
    const variants = {
      Completada: 'success',
      'En curso': 'warning',
      Anulada: 'danger',
    };
    return variants[estado] || 'gray';
  };

  return (
    <Card padding="md" hover>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <Avatar
          name={`${consulta.paciente?.nombres} ${consulta.paciente?.apellidos}`}
          size="lg"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-800 dark:text-white text-base">
              {consulta.paciente?.nombres} {consulta.paciente?.apellidos}
            </h3>
            <Badge variant={getEstadoBadge(consulta.estado)} size="sm">
              {consulta.estado}
            </Badge>
            {edad !== null && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {edad} años
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong className="text-gray-700 dark:text-gray-200">Motivo:</strong>{' '}
            {consulta.motivo_consulta}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>
              🩺 Dr(a). {consulta.medico?.nombres} {consulta.medico?.apellidos}
            </span>
            <span>📅 {formatDateTime(consulta.fecha_hora)}</span>
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              📋 HC: {consulta.paciente?.historia_clinica}
            </span>
          </div>
        </div>

        <div className="lg:text-right lg:w-64 lg:flex-shrink-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
            Diagnóstico
          </p>
          <div className="flex items-center gap-2 lg:justify-end flex-wrap">
            {consulta.cie10_principal && (
              <Badge variant="gray" size="sm">
                {consulta.cie10_principal}
              </Badge>
            )}
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {consulta.diagnostico_principal || 'Sin diagnóstico'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 lg:flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/consultas/${consulta.id}`)}
          >
            Ver detalle →
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default TarjetaConsulta;