// ============================================================
// COMPONENTE: PacienteDatosPersonales
// ============================================================

import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { ESTADOS_CIVILES } from '../../utils/constants';

function PacienteDatosPersonales({ formData, onChange, errors }) {
  return (
    <Card title="📋 Datos Personales" subtitle="Información básica del paciente" padding="md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombres"
          name="nombres"
          value={formData.nombres}
          onChange={onChange}
          placeholder="Ej: Juan Carlos"
          error={errors.nombres}
          required
        />

        <Input
          label="Apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={onChange}
          placeholder="Ej: Pérez González"
          error={errors.apellidos}
          required
        />

        <Input
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 8);
            onChange({ target: { name: 'dni', value } });
          }}
          placeholder="Ej: 12345678"
          error={errors.dni}
          required
          maxLength={8}
          helper="8 dígitos sin espacios"
        />

        <Input
          label="Fecha de Nacimiento"
          name="fecha_nacimiento"
          type="date"
          value={formData.fecha_nacimiento}
          onChange={onChange}
          error={errors.fecha_nacimiento}
          required
          max={new Date().toISOString().split('T')[0]}
        />

        <Select
          label="Sexo"
          name="sexo"
          value={formData.sexo}
          onChange={onChange}
          options={[
            { value: 'M', label: 'Masculino' },
            { value: 'F', label: 'Femenino' },
          ]}
          placeholder="Seleccione"
          error={errors.sexo}
          required
        />

        <Select
          label="Estado Civil"
          name="estado_civil"
          value={formData.estado_civil}
          onChange={onChange}
          options={ESTADOS_CIVILES.map((e) => ({ value: e, label: e }))}
        />
      </div>
    </Card>
  );
}

export default PacienteDatosPersonales;