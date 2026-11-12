// ============================================================
// PÁGINA: Nueva Cita
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import NuevoCitaPacienteMedico from '../../components/citas/NuevoCitaPacienteMedico';
import NuevoCitaFechaMotivo from '../../components/citas/NuevoCitaFechaMotivo';
import pacienteService from '../../services/pacienteService';
import usuarioService from '../../services/usuarioService';
import citaService from '../../services/citaService';

function NuevaCita() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // ============================================================
  // ESTADO DEL FORMULARIO
  // ============================================================
  const [formData, setFormData] = useState({
    paciente_id: '',
    medico_id: '',
    fecha_hora: '',
    motivo: '',
    tipo: 'Consulta',
    observaciones: '',
  });

  const [errors, setErrors] = useState({});

  // ============================================================
  // CARGAR PACIENTES Y MÉDICOS
  // ============================================================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resPacientes = await pacienteService.listar({ limit: 200 });
        setPacientes(resPacientes.data || []);

        const resMedicos = await usuarioService.listar({ limit: 100 });
        const soloMedicos = (resMedicos.data || []).filter(
          (u) => u.rol === 'medico' || u.rol?.nombre === 'medico'
        );
        setMedicos(soloMedicos);
      } catch (error) {
        toast.error('Error al cargar datos');
      }
    };
    cargarDatos();
  }, []);

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

    if (!formData.paciente_id) newErrors.paciente_id = 'Debe seleccionar un paciente';
    if (!formData.medico_id) newErrors.medico_id = 'Debe seleccionar un médico';

    if (!formData.fecha_hora) {
      newErrors.fecha_hora = 'La fecha y hora es obligatoria';
    } else if (new Date(formData.fecha_hora) < new Date()) {
      newErrors.fecha_hora = 'La fecha no puede ser en el pasado';
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = 'El motivo es obligatorio';
    } else if (formData.motivo.trim().length < 5) {
      newErrors.motivo = 'Mínimo 5 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // GUARDAR CITA
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      const firstError = document.querySelector('.border-medical-red');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      await citaService.crear({
        paciente_id: parseInt(formData.paciente_id),
        medico_id: parseInt(formData.medico_id),
        fecha_hora: formData.fecha_hora,
        motivo: formData.motivo,
        tipo: formData.tipo,
        observaciones: formData.observaciones || null,
        estado: 'Programada',
      });

      toast.success('Cita programada correctamente');
      navigate('/citas');
    } catch (error) {
      toast.error(error.message || 'Error al programar la cita');
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
          onClick={() => navigate('/citas')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a citas
        </button>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">Nueva Cita</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Programa una nueva cita médica
        </p>
      </div>

      {/* INFO */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-purple-800 dark:text-purple-300 text-sm">Información importante</h4>
            <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
              La cita se creará con estado <strong>Programada</strong>. Luego podrás confirmarla o cancelarla desde la lista de citas.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PACIENTE Y MÉDICO */}
        <NuevoCitaPacienteMedico
          pacientes={pacientes}
          medicos={medicos}
          formData={formData}
          onChange={handleChange}
          errors={errors}
          pacienteSeleccionado={pacienteSeleccionado}
        />

        {/* FECHA Y MOTIVO */}
        <NuevoCitaFechaMotivo
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/citas')}
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
            💾 Programar Cita
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NuevaCita;