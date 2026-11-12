// ============================================================
// PÁGINA: Configuración del Sistema
// ============================================================

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';

function Configuracion() {
  const [config, setConfig] = useState({
    nombre_posta: 'Posta Médica San Juan',
    direccion: 'Av. Los Álamos 123',
    telefono: '01-2345678',
    email: 'contacto@postasanjuan.gob.pe',
    director: 'Dr. Carlos Mendoza',
    moneda: 'PEN',
    zona_horaria: 'America/Lima',
    items_por_pagina: 20,
    tiempo_sesion: 30,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">🔧 Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Ajustes generales del sistema</p>
      </div>

      <Alert variant="info" title="Información">
        Los cambios en la configuración afectan a todo el sistema. Verifica bien antes de guardar.
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DATOS DE LA POSTA */}
        <Card title="🏥 Datos de la Posta" padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre de la posta" name="nombre_posta" value={config.nombre_posta} onChange={handleChange} />
            <Input label="Director" name="director" value={config.director} onChange={handleChange} />
            <Input label="Teléfono" name="telefono" value={config.telefono} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={config.email} onChange={handleChange} />
            <div className="md:col-span-2">
              <Input label="Dirección" name="direccion" value={config.direccion} onChange={handleChange} />
            </div>
          </div>
        </Card>

        {/* PREFERENCIAS */}
        <Card title="⚙️ Preferencias del Sistema" padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Moneda"
              name="moneda"
              value={config.moneda}
              onChange={handleChange}
              options={[
                { value: 'PEN', label: 'Soles (S/)' },
                { value: 'USD', label: 'Dólares (US$)' },
              ]}
            />
            <Select
              label="Zona horaria"
              name="zona_horaria"
              value={config.zona_horaria}
              onChange={handleChange}
              options={[
                { value: 'America/Lima', label: 'Lima (GMT-5)' },
                { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
              ]}
            />
            <Input label="Items por página" name="items_por_pagina" type="number" value={config.items_por_pagina} onChange={handleChange} />
            <Input label="Tiempo de sesión (min)" name="tiempo_sesion" type="number" value={config.tiempo_sesion} onChange={handleChange} />
          </div>
        </Card>

        {/* BOTONES */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => toast.info('Configuración restaurada')}>
            Restaurar valores
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            💾 Guardar Configuración
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Configuracion;