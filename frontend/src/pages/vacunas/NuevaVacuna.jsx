// ============================================================
// PÁGINA: Nueva Vacuna
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import pacienteService from '../../services/pacienteService';
import vacunaService from '../../services/vacunaService';
import { TIPOS_VACUNA } from '../../utils/constants';
import { calcularEdad, formatDNI } from '../../utils/formatters';

const DOSIS_OPCIONES = [
  '1ra dosis',
  '2da dosis',
  '3ra dosis',
  '4ta dosis',
  'Refuerzo 1',
  'Refuerzo 2',
  'Dosis única',
  'Anual',
];

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
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💉</span>
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
              Registro de vacunación
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
              Complete los datos según el carnet de vacunación del paciente. Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ============================================================ */}
        {/* PACIENTE */}
        {/* ============================================================ */}
        <Card title="👤 Paciente" subtitle="Seleccione el paciente vacunado" padding="md">
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

          {pacienteSeleccionado && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">DNI</p>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {formatDNI(pacienteSeleccionado.dni) || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">Edad</p>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {calcularEdad(pacienteSeleccionado.fecha_nacimiento)} años
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">Sexo</p>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {pacienteSeleccionado.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 uppercase font-semibold mb-0.5">Teléfono</p>
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {pacienteSeleccionado.telefono || '—'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ============================================================ */}
        {/* DATOS DE LA VACUNA */}
        {/* ============================================================ */}
        <Card title="💉 Datos de la Vacuna" subtitle="Información de la dosis aplicada" padding="md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo de vacuna *"
              name="tipo_vacuna"
              value={formData.tipo_vacuna}
              onChange={handleChange}
              options={TIPOS_VACUNA.map((t) => ({ value: t, label: t }))}
              placeholder="Seleccione la vacuna"
              error={errors.tipo_vacuna}
              required
            />

            <Select
              label="Dosis"
              name="dosis"
              value={formData.dosis}
              onChange={handleChange}
              options={DOSIS_OPCIONES.map((d) => ({ value: d, label: d }))}
            />

            <Input
              label="Fecha de aplicación *"
              name="fecha_aplicacion"
              type="date"
              value={formData.fecha_aplicacion}
              onChange={handleChange}
              error={errors.fecha_aplicacion}
              required
              max={new Date().toISOString().split('T')[0]}
            />

            <Input
              label="Lugar de aplicación"
              name="lugar_aplicacion"
              value={formData.lugar_aplicacion}
              onChange={handleChange}
              placeholder="Ej: Posta Médica San Juan"
            />

            <Input
              label="Lote"
              name="lote"
              value={formData.lote}
              onChange={handleChange}
              placeholder="Ej: HB-2026-001"
            />

            <Input
              label="Laboratorio"
              name="laboratorio"
              value={formData.laboratorio}
              onChange={handleChange}
              placeholder="Ej: Sinovac"
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
              placeholder="Reacciones adversas, observaciones, etc..."
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