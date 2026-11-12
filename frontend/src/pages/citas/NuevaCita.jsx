// ============================================================
// PÁGINA: Nueva Cita
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import pacienteService from '../../services/pacienteService';
import usuarioService from '../../services/usuarioService';
import citaService from '../../services/citaService';
import { calcularEdad, formatDNI } from '../../utils/formatters';

const TIPOS_CITA = ['Consulta', 'Control', 'Vacunación', 'Laboratorio', 'Otro'];

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
        // Cargar pacientes
        const resPacientes = await pacienteService.listar({ limit: 200 });
        setPacientes(resPacientes.data || []);

        // Cargar médicos (usuarios con rol medico)
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

    if (!formData.paciente_id) {
      newErrors.paciente_id = 'Debe seleccionar un paciente';
    }

    if (!formData.medico_id) {
      newErrors.medico_id = 'Debe seleccionar un médico';
    }

    if (!formData.fecha_hora) {
      newErrors.fecha_hora = 'La fecha y hora es obligatoria';
    } else {
      const fecha = new Date(formData.fecha_hora);
      if (fecha < new Date()) {
        newErrors.fecha_hora = 'La fecha no puede ser en el pasado';
      }
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
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            Nueva Cita
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Programa una nueva cita médica
          </p>
        </div>
      </div>

      {/* INFO */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-purple-800 dark:text-purple-300 text-sm">
              Información importante
            </h4>
            <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
              La cita se creará con estado <strong>Programada</strong>. Luego podrás confirmarla o cancelarla desde la lista de citas.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ============================================================ */}
        {/* PACIENTE Y MÉDICO */}
        {/* ============================================================ */}
        <Card title="👥 Paciente y Médico" subtitle="Datos principales de la cita" padding="md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Paciente *"
              name="paciente_id"
              value={formData.paciente_id}
              onChange={handleChange}
              options={pacientes.map((p) => ({
                value: p.id,
                label: `${p.nombres} ${p.apellidos} — HC: ${p.historia_clinica}`,
              }))}
              placeholder="Seleccione un paciente"
              error={errors.paciente_id}
              required
            />

            <Select
              label="Médico *"
              name="medico_id"
              value={formData.medico_id}
              onChange={handleChange}
              options={medicos.map((m) => ({
                value: m.id,
                label: `Dr(a). ${m.nombres} ${m.apellidos}`,
              }))}
              placeholder="Seleccione un médico"
              error={errors.medico_id}
              required
            />
          </div>

          {/* Info del paciente seleccionado */}
          {pacienteSeleccionado && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                    DNI
                  </p>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {formatDNI(pacienteSeleccionado.dni) || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                    Edad
                  </p>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {calcularEdad(pacienteSeleccionado.fecha_nacimiento)} años
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                    Sexo
                  </p>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {pacienteSeleccionado.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">
                    Teléfono
                  </p>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {pacienteSeleccionado.telefono || '—'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ============================================================ */}
        {/* FECHA Y MOTIVO */}
        {/* ============================================================ */}
        <Card title="📅 Fecha y Motivo" subtitle="¿Cuándo y por qué es la cita?" padding="md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha y hora *"
              name="fecha_hora"
              type="datetime-local"
              value={formData.fecha_hora}
              onChange={handleChange}
              error={errors.fecha_hora}
              required
              min={new Date().toISOString().slice(0, 16)}
            />

            <Select
              label="Tipo de cita"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              options={TIPOS_CITA.map((t) => ({ value: t, label: t }))}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Motivo de la cita *"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Ej: Control de presión arterial"
              error={errors.motivo}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Observaciones (opcional)
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none"
              placeholder="Información adicional sobre la cita..."
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