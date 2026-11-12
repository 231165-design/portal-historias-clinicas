// ============================================================
// COMPONENTE: PacienteDatosContacto
// ============================================================

import Input from '../ui/Input';
import Card from '../ui/Card';

function PacienteDatosContacto({ formData, onChange, errors }) {
  return (
    <Card title="📞 Datos de Contacto" subtitle="Información para comunicarse con el paciente" padding="md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Teléfono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 9);
            onChange({ target: { name: 'telefono', value } });
          }}
          placeholder="Ej: 987654321"
          error={errors.telefono}
          maxLength={9}
          helper="9 dígitos (opcional)"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="ejemplo@email.com"
          error={errors.email}
          helper="Opcional"
        />

        <Input
          label="Dirección"
          name="direccion"
          value={formData.direccion}
          onChange={onChange}
          placeholder="Av. Los Álamos 123"
        />

        <Input
          label="Distrito"
          name="distrito"
          value={formData.distrito}
          onChange={onChange}
          placeholder="San Juan de Lurigancho"
        />
      </div>
    </Card>
  );
}

export default PacienteDatosContacto;