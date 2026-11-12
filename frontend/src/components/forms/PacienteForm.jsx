// ============================================================
// COMPONENTE: PacienteForm
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import PacienteDatosPersonales from './PacienteDatosPersonales';
import PacienteDatosContacto from './PacienteDatosContacto';
import PacienteDatosMedicos from './PacienteDatosMedicos';
import PacienteContactoEmergencia from './PacienteContactoEmergencia';
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

function PacienteForm({ initialData = null, onSubmit, loading = false, mode = 'create' }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  // ============================================================
  // VALIDACIONES
  // ============================================================
  const validate = () => {
    const newErrors = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'El nombre es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.nombres)) {
      newErrors.nombres = 'Solo se permiten letras y espacios';
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = 'Mínimo 2 caracteres';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'El apellido es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.apellidos)) {
      newErrors.apellidos = 'Solo se permiten letras y espacios';
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Mínimo 2 caracteres';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!validators.isDNI(formData.dni)) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
    }

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
        if (edad > 120) newErrors.fecha_nacimiento = 'Edad inválida (mayor a 120 años)';
        if (edad < 0) newErrors.fecha_nacimiento = 'Fecha inválida';
      }
    }

    if (!formData.sexo) newErrors.sexo = 'El sexo es obligatorio';

    if (formData.telefono && !validators.isPhone(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido (mínimo 6 dígitos)';
    }

    if (formData.email && !validators.isEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <Alert variant="error" title="Error al guardar" onClose={() => setServerError('')}>
          {serverError}
        </Alert>
      )}

      <PacienteDatosPersonales formData={formData} onChange={handleChange} errors={errors} />
      <PacienteDatosContacto formData={formData} onChange={handleChange} errors={errors} />
      <PacienteDatosMedicos formData={formData} onChange={handleChange} />
      <PacienteContactoEmergencia formData={formData} onChange={handleChange} />

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