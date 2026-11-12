// ============================================================
// COMPONENTE: PacienteDatosMedicos
// ============================================================

import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { GRUPOS_SANGUINEOS, TIPOS_SEGURO_LIST } from '../../utils/constants';

function PacienteDatosMedicos({ formData, onChange }) {
  return (
    <Card title="🩺 Datos Médicos" subtitle="Información clínica del paciente" padding="md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Grupo Sanguíneo"
          name="grupo_sanguineo"
          value={formData.grupo_sanguineo}
          onChange={onChange}
          options={GRUPOS_SANGUINEOS.map((g) => ({ value: g, label: g }))}
          placeholder="Seleccione"
        />

        <Select
          label="Tipo de Seguro"
          name="tipo_seguro"
          value={formData.tipo_seguro}
          onChange={onChange}
          options={TIPOS_SEGURO_LIST.map((t) => ({ value: t, label: t }))}
        />

        <Input
          label="Número de Seguro"
          name="numero_seguro"
          value={formData.numero_seguro}
          onChange={onChange}
          placeholder="Ej: SIS-123456"
        />

        <Input
          label="Alergias"
          name="alergias"
          value={formData.alergias}
          onChange={onChange}
          placeholder="Ej: Penicilina, Aspirina"
        />
      </div>
    </Card>
  );
}

export default PacienteDatosMedicos;