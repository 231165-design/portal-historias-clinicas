// ============================================================
// PÁGINA: Nuevo Paciente
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PacienteForm from '../../components/forms/PacienteForm';
import pacienteService from '../../services/pacienteService';

function NuevoPaciente() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ============================================================
  // GUARDAR PACIENTE
  // ============================================================
  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const nuevo = await pacienteService.crear(data);
      toast.success(`Paciente registrado: ${nuevo.historia_clinica}`);
      navigate('/pacientes');
    } catch (error) {
      toast.error(error.message || 'Error al registrar paciente');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* ============================================================ */}
      {/* HEADER */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/pacientes')}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a pacientes
          </button>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            Registrar Nuevo Paciente
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete el formulario para registrar un nuevo paciente en el sistema
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* INFO */}
      {/* ============================================================ */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">
              Información importante
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              El número de Historia Clínica se generará automáticamente al guardar el paciente.
              Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FORMULARIO */}
      {/* ============================================================ */}
      <PacienteForm
        onSubmit={handleSubmit}
        loading={loading}
        mode="create"
      />
    </div>
  );
}

export default NuevoPaciente;