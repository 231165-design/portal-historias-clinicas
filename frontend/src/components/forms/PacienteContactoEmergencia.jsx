// ============================================================
// COMPONENTE: PacienteContactoEmergencia
// ============================================================

import Input from '../ui/Input';
import Card from '../ui/Card';

function PacienteContactoEmergencia({ formData, onChange }) {
  return (
    <Card title="🚨 Contacto de Emergencia" subtitle="Persona a contactar en caso de emergencia" padding="md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre del Contacto"
          name="contacto_emergencia"
          value={formData.contacto_emergencia}
          onChange={onChange}
          placeholder="Ej: María González"
        />

        <Input
          label="Teléfono de Emergencia"
          name="telefono_emergencia"
          type="tel"
          value={formData.telefono_emergencia}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 9);
            onChange({ target: { name: 'telefono_emergencia', value } });
          }}
          placeholder="Ej: 987654321"
          maxLength={9}
        />
      </div>
    </Card>
  );
}

export default PacienteContactoEmergencia;