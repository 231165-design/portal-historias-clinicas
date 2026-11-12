// ============================================================
// PÁGINA: Detalle de Paciente
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import DetalleHeaderPaciente from '../../components/pacientes/DetalleHeaderPaciente';
import DetalleTabsPaciente from '../../components/pacientes/DetalleTabsPaciente';
import pacienteService from '../../services/pacienteService';
import { calcularEdad } from '../../utils/formatters';

function DetallePaciente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

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
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" text="Cargando información del paciente..." />
      </div>
    );
  }

  if (!paciente) return null;

  const edad = calcularEdad(paciente.fecha_nacimiento);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate('/pacientes')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a pacientes
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/pacientes/${id}/editar`)}
          >
            ✏️ Editar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/consultas/nueva?paciente=${id}`)}
          >
            🩺 Nueva Consulta
          </Button>
        </div>
      </div>

      {/* CARD PRINCIPAL DEL PACIENTE */}
      <DetalleHeaderPaciente paciente={paciente} edad={edad} />

      {/* TABS + CONTENIDO */}
      <Card padding="none">
        <DetalleTabsPaciente paciente={paciente} edad={edad} />
      </Card>
    </div>
  );
}

export default DetallePaciente;