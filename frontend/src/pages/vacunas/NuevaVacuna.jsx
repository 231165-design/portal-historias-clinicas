// ============================================================
// PÁGINA: Nueva Vacuna
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import InfoRegistroVacuna from '../../components/vacunas/InfoRegistroVacuna';
import SelectorPacienteVacuna from '../../components/vacunas/SelectorPacienteVacuna';
import FormDatosVacuna from '../../components/vacunas/FormDatosVacuna';
import pacienteService from '../../services/pacienteService';
import vacunaService from '../../services/vacunaService';

function NuevaVacuna() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pacienteIdParam = searchParams.get('paciente');

  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // ============================================================
  // ESTADO DEL FORMULARIO
  // ============================================================
  const [formData, setFormData] = useState({
    paciente_id: pacienteIdParam || '',
    tipo_vacuna: '',
    dosis: '1ra dosis',
    lote: '',
    laboratorio: '',
    fecha_aplicacion: new Date().toISOString().split('T')[0],
    lugar_aplicacion: 'Posta Médica',
    observaciones: '',
  });

  const [errors, setErrors] = useState({});

  // ============================================================
  // CARGAR PACIENTES
  // ============================================================
  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const response = await pacienteService.listar({ limit: 200 });
        setPacientes(response.data || []);
      } catch (error) {
        toast.error('Error al cargar pacientes');
      }
    };
    cargarPacientes();
  }, []);

  // ============================================================
  // CARGAR PACIENTE SI VIENE POR PARÁMETRO
  // ============================================================
  useEffect(() => {
    if (pacienteIdParam && pacientes.length > 0) {
      const found = pacientes.find((p) => p.id.toString() === pacienteIdParam);
      if (found) setPacienteSeleccionado(found);
    }
  }, [pacienteIdParam, pacientes]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'paciente_id') {
      const paciente = pacientes.find((p) => p.id.toString() === value);
      setPacienteSeleccionado(paciente || null);
    }
  };

  // ============================================================
  // VALIDAR
  // ============================================================
  const validate = () => {
    const newErrors = {};

    if (!formData.paciente_id) {
      newErrors.paciente_id = 'Debe seleccionar un paciente';
    }

    if (!formData.tipo_vacuna) {
      newErrors.tipo_vacuna = 'El tipo de vacuna es obligatorio';
    }

    if (!formData.fecha_aplicacion) {
      newErrors.fecha_aplicacion = 'La fecha de aplicación es obligatoria';
    } else if (new Date(formData.fecha_aplicacion) > new Date()) {
      newErrors.fecha_aplicacion = 'La fecha no puede ser futura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // GUARDAR
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      const firstError = document.querySelector('.border-medical-red');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    try {
      await vacunaService.crear({
        paciente_id: parseInt(formData.paciente_id),
        tipo_vacuna: formData.tipo_vacuna,
        dosis: formData.dosis,
        lote: formData.lote || null,
        laboratorio: formData.laboratorio || null,
        fecha_aplicacion: formData.fecha_aplicacion,
        lugar_aplicacion: formData.lugar_aplicacion || null,
        observaciones: formData.observaciones || null,
      });

      toast.success('Vacuna registrada correctamente');
      navigate('/vacunas');
    } catch (error) {
      toast.error(error.message || 'Error al registrar vacuna');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* HEADER */}
      <div>
        <button
          onClick={() => navigate('/vacunas')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a vacunas
        </button>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
          Registrar Vacuna
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Registra una nueva dosis de vacuna aplicada al paciente
        </p>
      </div>

      {/* INFO */}
      <InfoRegistroVacuna />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SelectorPacienteVacuna
          pacientes={pacientes}
          pacienteId={formData.paciente_id}
          pacienteSeleccionado={pacienteSeleccionado}
          onChange={handleChange}
          error={errors.paciente_id}
        />

        <FormDatosVacuna
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/vacunas')}
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
            💾 Registrar Vacuna
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NuevaVacuna;