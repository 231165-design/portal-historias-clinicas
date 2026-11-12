// ============================================================
// COMPONENTE: DetalleTabPaciente
// ============================================================

import InfoItem from '../ui/InfoItem';
import { formatDate, calcularEdad, formatDNI } from '../../utils/formatters';

function DetalleTabPaciente({ paciente }) {
  const edad = paciente?.fecha_nacimiento
    ? calcularEdad(paciente.fecha_nacimiento)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoItem label="Nombres" value={paciente?.nombres} icon="👤" />
      <InfoItem label="Apellidos" value={paciente?.apellidos} icon="👤" />
      <InfoItem
        label="DNI"
        value={paciente?.dni ? formatDNI(paciente.dni) : '—'}
        icon="🆔"
      />
      <InfoItem label="Historia Clínica" value={paciente?.historia_clinica} icon="📋" />
      <InfoItem
        label="Fecha de Nacimiento"
        value={paciente?.fecha_nacimiento ? formatDate(paciente.fecha_nacimiento) : '—'}
        icon="🎂"
      />
      <InfoItem label="Edad" value={edad !== null ? `${edad} años` : '—'} icon="📅" />
      <InfoItem
        label="Sexo"
        value={paciente?.sexo === 'M' ? 'Masculino' : 'Femenino'}
        icon="⚧"
      />
      <InfoItem label="Teléfono" value={paciente?.telefono || '—'} icon="📱" />
      <InfoItem label="Dirección" value={paciente?.direccion || '—'} icon="🏠" />
    </div>
  );
}

export default DetalleTabPaciente;