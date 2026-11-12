// ============================================================
// PÁGINA: Nueva Consulta
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import SelectorPaciente from '../../components/consultas/SelectorPaciente';
import FormSignosVitales from '../../components/consultas/FormSignosVitales';
import FormSOAP from '../../components/consultas/FormSOAP';
import InfoFormatoSOAP from '../../components/consultas/InfoFormatoSOAP';
import { validateConsulta, calcularIMC } from '../../components/consultas/ValidacionesConsulta';
import pacienteService from '../../services/pacienteService';
import consultaService from '../../services/consultaService';

function NuevaConsulta() {
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
    temperatura: '',
    presion_sistolica: '',
    presion_diastolica: '',
    frecuencia_cardiaca: '',
    frecuencia_respiratoria: '',
    saturacion_oxigeno: '',
    peso: '',
    talla: '',
    perimetro_abdominal: '',
    glucosa: '',
    tipo_atencion: 'Consulta',
    motivo_consulta: '',
    tiempo_enfermedad: '',
    enfermedad_actual: '',
    examen_fisico: '',
    diagnostico_principal: '',
    cie10_principal: '',
    diagnosticos_secundarios: '',
    tratamiento: '',
    indicaciones: '',
    requiere_referencia: false,
    referencia_destino: '',
    proxima_cita: '',
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'paciente_id') {
      const paciente = pacientes.find((p) => p.id.toString() === value);
      setPacienteSeleccionado(paciente || null);
    }
  };

  // Calcular IMC usando helper
  const imc = calcularIMC(formData.peso, formData.talla);

  // ============================================================
  // GUARDAR CONSULTA
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateConsulta(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstError = document.querySelector('.border-medical-red');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      const nuevaConsulta = await consultaService.crear({
        paciente_id: parseInt(formData.paciente_id),
        tipo_atencion: formData.tipo_atencion,
        motivo_consulta: formData.motivo_consulta,
        tiempo_enfermedad: formData.tiempo_enfermedad || null,
        enfermedad_actual: formData.enfermedad_actual || null,
        examen_fisico: formData.examen_fisico || null,
        diagnostico_principal: formData.diagnostico_principal,
        cie10_principal: formData.cie10_principal || null,
        diagnosticos_secundarios: formData.diagnosticos_secundarios || null,
        tratamiento: formData.tratamiento || null,
        indicaciones: formData.indicaciones || null,
        requiere_referencia: formData.requiere_referencia,
        referencia_destino: formData.referencia_destino || null,
        proxima_cita: formData.proxima_cita || null,
        estado: 'Completada',
      });

      const tieneSignosVitales =
        formData.temperatura || formData.presion_sistolica || formData.peso || formData.talla;

      if (tieneSignosVitales && nuevaConsulta?.id) {
        try {
          await consultaService.registrarSignosVitales(nuevaConsulta.id, {
            temperatura: formData.temperatura || null,
            presion_sistolica: formData.presion_sistolica || null,
            presion_diastolica: formData.presion_diastolica || null,
            frecuencia_cardiaca: formData.frecuencia_cardiaca || null,
            frecuencia_respiratoria: formData.frecuencia_respiratoria || null,
            saturacion_oxigeno: formData.saturacion_oxigeno || null,
            peso: formData.peso || null,
            talla: formData.talla || null,
            perimetro_abdominal: formData.perimetro_abdominal || null,
            glucosa: formData.glucosa || null,
          });
        } catch (signosError) {
          console.warn('Error al guardar signos vitales:', signosError);
        }
      }

      toast.success('Consulta registrada correctamente');
      navigate('/consultas');
    } catch (error) {
      toast.error(error.message || 'Error al registrar consulta');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* HEADER */}
      <div>
        <button
          onClick={() => navigate('/consultas')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a consultas
        </button>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
          Nueva Consulta Médica
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Registra la atención médica del paciente (formato SOAP)
        </p>
      </div>

      {/* INFO SOAP */}
      <InfoFormatoSOAP />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SelectorPaciente
          pacientes={pacientes}
          pacienteId={formData.paciente_id}
          pacienteSeleccionado={pacienteSeleccionado}
          onChange={handleChange}
          error={errors.paciente_id}
        />

        <FormSignosVitales
          formData={formData}
          onChange={handleChange}
          errors={errors}
          imc={imc}
        />

        <FormSOAP
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/consultas')}
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
            💾 Registrar Consulta
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NuevaConsulta;