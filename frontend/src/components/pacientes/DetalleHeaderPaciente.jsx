// ============================================================
// COMPONENTE: DetalleHeaderPaciente
// ============================================================

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/formatters';

function DetalleHeaderPaciente({ paciente, edad }) {
  const nombreCompleto = `${paciente.nombres} ${paciente.apellidos}`;

  return (
    <>
      {/* CARD PRINCIPAL */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar name={nombreCompleto} size="2xl" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
              {nombreCompleto}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              <Badge variant="primary" size="md">
                HC: {paciente.historia_clinica}
              </Badge>
              <Badge variant="gray" size="md">
                {paciente.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}
              </Badge>
              <Badge variant="info" size="md">
                {edad} años
              </Badge>
              {paciente.tipo_seguro && (
                <Badge
                  variant={
                    paciente.tipo_seguro === 'SIS'
                      ? 'success'
                      : paciente.tipo_seguro === 'ESSALUD'
                      ? 'info'
                      : paciente.tipo_seguro === 'Privado'
                      ? 'purple'
                      : 'gray'
                  }
                  size="md"
                >
                  {paciente.tipo_seguro}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 Registrado: {formatDate(paciente.created_at)}</span>
              {paciente.telefono && <span>📱 {paciente.telefono}</span>}
              {paciente.email && <span>📧 {paciente.email}</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* ALERTA ALERGIAS */}
      {paciente.alergias && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-red-800 dark:text-red-300 text-sm">
                Alergias conocidas
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {paciente.alergias}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetalleHeaderPaciente;