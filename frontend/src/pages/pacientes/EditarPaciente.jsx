// ============================================================
// PÁGINA: Editar Paciente
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PacienteForm from '../../components/forms/PacienteForm';
import Spinner from '../../components/ui/Spinner';
import pacienteService from '../../services/pacienteService';

function EditarPaciente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ============================================================
  // CARGAR PACIENTE
  // ============================================================
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await pacienteService.obtener(id);
        setPaciente(data);
      } catch (error) {
        toast.error('Paciente no encontrado');
        navigate('/pacientes');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id, navigate]);

  // ============================================================
  // GUARDAR CAMBIOS
  // ============================================================
  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      await pacienteService.actualizar(id, data);
      toast.success('Paciente actualizado correctamente');
      navigate(`/pacientes/${id}`);
    } catch (error) {
      toast.error(error.message || 'Error al actualizar');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" text="Cargando paciente..." />
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-gray-500 dark:text-gray-400">Paciente no encontrado</p>
        <button
          onClick={() => navigate('/pacientes')}
          className="mt-4 text-primary-600 hover:underline font-semibold"
        >
          ← Volver a pacientes
        </button>
      </div>
    );
  }

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
            onClick={() => navigate(`/pacientes/${id}`)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al detalle
          </button>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            Editar Paciente
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {paciente.nombres} {paciente.apellidos} · HC {paciente.historia_clinica}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* INFO */}
      {/* ============================================================ */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✏️</span>
          <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm">
              Modo edición
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Estás editando los datos de <strong>{paciente.nombres} {paciente.apellidos}</strong>.
              Los cambios se guardarán inmediatamente al hacer clic en "Actualizar Paciente".
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FORMULARIO */}
      {/* ============================================================ */}
      <PacienteForm
        initialData={paciente}
        onSubmit={handleSubmit}
        loading={saving}
        mode="edit"
      />
    </div>
  );
}

export default EditarPaciente;