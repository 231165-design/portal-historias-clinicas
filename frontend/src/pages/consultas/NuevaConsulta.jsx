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

  // ============================================================
  // CÁLCULO AUTOMÁTICO DE IMC
  // ============================================================
  const imc = (() => {
    if (formData.peso && formData.talla) {
      const tallaM = parseFloat(formData.talla) / 100;
      const peso = parseFloat(formData.peso);
      if (tallaM > 0) return (peso / (tallaM * tallaM)).toFixed(1);
    }
    return null;
  })();

  // ============================================================
  // VALIDAR
  // ============================================================
  const validate = () => {
    const newErrors = {};

    if (!formData.paciente_id) newErrors.paciente_id = 'Debe seleccionar un paciente';
    if (!formData.motivo_consulta.trim()) {
      newErrors.motivo_consulta = 'El motivo de consulta es obligatorio';
    } else if (formData.motivo_consulta.trim().length < 5) {
      newErrors.motivo_consulta = 'Mínimo 5 caracteres';
    }
    if (!formData.diagnostico_principal.trim()) {
      newErrors.diagnostico_principal = 'El diagnóstico es obligatorio';
    }

    if (formData.temperatura) {
      const temp = parseFloat(formData.temperatura);
      if (temp < 30 || temp > 45) newErrors.temperatura = 'Temperatura fuera de rango (30-45°C)';
    }
    if (formData.presion_sistolica) {
      const ps = parseInt(formData.presion_sistolica);
      if (ps < 50 || ps > 300) newErrors.presion_sistolica = 'Fuera de rango (50-300)';
    }
    if (formData.presion_diastolica) {
      const pd = parseInt(formData.presion_diastolica);
      if (pd < 30 || pd > 200) newErrors.presion_diastolica = 'Fuera de rango (30-200)';
    }
    if (formData.frecuencia_cardiaca) {
      const fc = parseInt(formData.frecuencia_cardiaca);
      if (fc < 30 || fc > 250) newErrors.frecuencia_cardiaca = 'Fuera de rango (30-250)';
    }
    if (formData.saturacion_oxigeno) {
      const sat = parseInt(formData.saturacion_oxigeno);
      if (sat < 50 || sat > 100) newErrors.saturacion_oxigeno = 'Fuera de rango (50-100)';
    }
    if (formData.peso) {
      const peso = parseFloat(formData.peso);
      if (peso < 1 || peso > 500) newErrors.peso = 'Peso fuera de rango';
    }
    if (formData.talla) {
      const talla = parseFloat(formData.talla);
      if (talla < 30 || talla > 250) newErrors.talla = 'Talla fuera de rango';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // GUARDAR CONSULTA
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
      </div>

      {/* INFO */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">
              Formato SOAP
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              <strong>S</strong>ubjetivo (motivo) · <strong>O</strong>bjetivo (examen físico) ·{' '}
              <strong>A</strong>nálisis (diagnóstico) · <strong>P</strong>lan (tratamiento)
            </p>
          </div>
        </div>
      </div>

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