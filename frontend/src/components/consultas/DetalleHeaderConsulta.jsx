// ============================================================
// COMPONENTE: DetalleHeaderConsulta
// ============================================================

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { formatDateTime, calcularEdad, formatDNI } from '../../utils/formatters';

function DetalleHeaderConsulta({ consulta }) {
  const paciente = consulta.paciente;
  const medico = consulta.medico;
  const edad = paciente?.fecha_nacimiento
    ? calcularEdad(paciente.fecha_nacimiento)
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
    <Card padding="lg">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <Avatar
          name={`${paciente?.nombres} ${paciente?.apellidos}`}
          size="2xl"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
              {paciente?.nombres} {paciente?.apellidos}
            </h1>
            <Badge variant={getEstadoBadge(consulta.estado)} size="md">
              {consulta.estado}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              HC: {paciente?.historia_clinica}
            </span>
            {paciente?.dni && <span>DNI: {formatDNI(paciente.dni)}</span>}
            {edad !== null && <span>{edad} años</span>}
            <span>{paciente?.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}</span>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                Fecha
              </p>
              <p className="text-gray-800 dark:text-white font-semibold">
                {formatDateTime(consulta.fecha_hora)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                Médico
              </p>
              <p className="text-gray-800 dark:text-white font-semibold">
                Dr(a). {medico?.nombres} {medico?.apellidos}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                Tipo de atención
              </p>
              <p className="text-gray-800 dark:text-white font-semibold">
                {consulta.tipo_atencion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DetalleHeaderConsulta;