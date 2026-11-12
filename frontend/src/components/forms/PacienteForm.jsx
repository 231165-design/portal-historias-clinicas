// ============================================================
// COMPONENTE: PacienteForm
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import Card from '../ui/Card';
import {
  GRUPOS_SANGUINEOS,
  TIPOS_SEGURO_LIST,
  ESTADOS_CIVILES,
} from '../../utils/constants';
import validators from '../../utils/validators';

// ============================================================
// DATOS INICIALES
// ============================================================
const EMPTY_FORM = {
  nombres: '',
  apellidos: '',
  dni: '',
  fecha_nacimiento: '',
  sexo: '',
  estado_civil: 'Soltero',
  telefono: '',
  email: '',
  direccion: '',
  distrito: '',
  grupo_sanguineo: '',
  tipo_seguro: 'Ninguno',
  numero_seguro: '',
  alergias: '',
  contacto_emergencia: '',
  telefono_emergencia: '',
};

// ============================================================
// COMPONENTE
// ============================================================
function PacienteForm({ initialData = null, onSubmit, loading = false, mode = 'create' }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...EMPTY_FORM,
        ...initialData,
        fecha_nacimiento: initialData.fecha_nacimiento
          ? initialData.fecha_nacimiento.split('T')[0]
          : '',
      });
    }
  }, [initialData]);

  // Manejar cambio de input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  // ============================================================
  // VALIDACIONES COMPLETAS
  // ============================================================
  const validate = () => {
    const newErrors = {};

    // Nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'El nombre es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.nombres)) {
      newErrors.nombres = 'Solo se permiten letras y espacios';
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = 'Mínimo 2 caracteres';
    }

    // Apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'El apellido es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.apellidos)) {
      newErrors.apellidos = 'Solo se permiten letras y espacios';
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Mínimo 2 caracteres';
    }

    // DNI
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!validators.isDNI(formData.dni)) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
    }

    // Fecha de nacimiento
    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const fecha = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      if (fecha > hoy) {
        newErrors.fecha_nacimiento = 'La fecha no puede ser futura';
      } else {
        const edad =
          hoy.getFullYear() -
          fecha.getFullYear() -
          (hoy.getMonth() < fecha.getMonth() ||
          (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate())
            ? 1
            : 0);
        if (edad > 120) {
          newErrors.fecha_nacimiento = 'Edad inválida (mayor a 120 años)';
        }
        if (edad < 0) {
          newErrors.fecha_nacimiento = 'Fecha inválida';
        }
      }
    }

    // Sexo
    if (!formData.sexo) {
      newErrors.sexo = 'El sexo es obligatorio';
    }

    // Teléfono (opcional, pero si existe debe ser válido)
    if (formData.telefono && !validators.isPhone(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido (mínimo 6 dígitos)';
    }

    // Email (opcional, pero si existe debe ser válido)
    if (formData.email && !validators.isEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      // Scroll al primer error
      const firstError = document.querySelector('.border-medical-red');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setServerError(error.message || 'Error al guardar el paciente');
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error del servidor */}
      {serverError && (
        <Alert variant="error" title="Error al guardar" onClose={() => setServerError('')}>
          {serverError}
        </Alert>
      )}

      {/* ============================================================ */}
      {/* DATOS PERSONALES */}
      {/* ============================================================ */}
      <Card title="📋 Datos Personales" subtitle="Información básica del paciente" padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            placeholder="Ej: Juan Carlos"
            error={errors.nombres}
            required
          />

          <Input
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
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
              setFormData((prev) => ({ ...prev, dni: value }));
              if (errors.dni) setErrors((prev) => ({ ...prev, dni: '' }));
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
            onChange={handleChange}
            error={errors.fecha_nacimiento}
            required
            max={new Date().toISOString().split('T')[0]}
          />

          <Select
            label="Sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
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
            onChange={handleChange}
            options={ESTADOS_CIVILES.map((e) => ({ value: e, label: e }))}
          />
        </div>
      </Card>

      {/* ============================================================ */}
      {/* DATOS DE CONTACTO */}
      {/* ============================================================ */}
      <Card title="📞 Datos de Contacto" subtitle="Información para comunicarse con el paciente" padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Teléfono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 9);
              setFormData((prev) => ({ ...prev, telefono: value }));
              if (errors.telefono) setErrors((prev) => ({ ...prev, telefono: '' }));
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
            onChange={handleChange}
            placeholder="ejemplo@email.com"
            error={errors.email}
            helper="Opcional"
          />

          <Input
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Av. Los Álamos 123"
          />

          <Input
            label="Distrito"
            name="distrito"
            value={formData.distrito}
            onChange={handleChange}
            placeholder="San Juan de Lurigancho"
          />
        </div>
      </Card>

      {/* ============================================================ */}
      {/* DATOS MÉDICOS */}
      {/* ============================================================ */}
      <Card title="🩺 Datos Médicos" subtitle="Información clínica del paciente" padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Grupo Sanguíneo"
            name="grupo_sanguineo"
            value={formData.grupo_sanguineo}
            onChange={handleChange}
            options={GRUPOS_SANGUINEOS.map((g) => ({ value: g, label: g }))}
            placeholder="Seleccione"
          />

          <Select
            label="Tipo de Seguro"
            name="tipo_seguro"
            value={formData.tipo_seguro}
            onChange={handleChange}
            options={TIPOS_SEGURO_LIST.map((t) => ({ value: t, label: t }))}
          />

          <Input
            label="Número de Seguro"
            name="numero_seguro"
            value={formData.numero_seguro}
            onChange={handleChange}
            placeholder="Ej: SIS-123456"
          />

          <Input
            label="Alergias"
            name="alergias"
            value={formData.alergias}
            onChange={handleChange}
            placeholder="Ej: Penicilina, Aspirina"
          />
        </div>
      </Card>

      {/* ============================================================ */}
      {/* CONTACTO DE EMERGENCIA */}
      {/* ============================================================ */}
      <Card title="🚨 Contacto de Emergencia" subtitle="Persona a contactar en caso de emergencia" padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Contacto"
            name="contacto_emergencia"
            value={formData.contacto_emergencia}
            onChange={handleChange}
            placeholder="Ej: María González"
          />

          <Input
            label="Teléfono de Emergencia"
            name="telefono_emergencia"
            type="tel"
            value={formData.telefono_emergencia}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 9);
              setFormData((prev) => ({ ...prev, telefono_emergencia: value }));
            }}
            placeholder="Ej: 987654321"
            maxLength={9}
          />
        </div>
      </Card>

      {/* ============================================================ */}
      {/* BOTONES */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/pacientes')}
          fullWidth
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth
        >
          {mode === 'create' ? '➕ Registrar Paciente' : '💾 Actualizar Paciente'}
        </Button>
      </div>
    </form>
  );
}

export default PacienteForm;