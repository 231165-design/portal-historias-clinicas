// ============================================================
// PÁGINA: Detalle de Consulta
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import DetalleHeaderConsulta from '../../components/consultas/DetalleHeaderConsulta';
import DetalleTabSOAP from '../../components/consultas/DetalleTabSOAP';
import DetalleTabSignos from '../../components/consultas/DetalleTabSignos';
import DetalleTabPaciente from '../../components/consultas/DetalleTabPaciente';
import consultaService from '../../services/consultaService';

function DetalleConsulta() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [consulta, setConsulta] = useState(null);
  const [signosVitales, setSignosVitales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('soap');

  // ============================================================
  // CARGAR CONSULTA
  // ============================================================
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await consultaService.obtener(id);
        setConsulta(data);

        try {
          const signos = await consultaService.getSignosVitales(id);
          setSignosVitales(signos);
        } catch {
          // No hay signos vitales registrados
        }
      } catch (error) {
        toast.error('Consulta no encontrada');
        navigate('/consultas');
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
        <Spinner size="lg" text="Cargando consulta..." />
      </div>
    );
  }

  if (!consulta) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-gray-500 dark:text-gray-400">Consulta no encontrada</p>
        <button
          onClick={() => navigate('/consultas')}
          className="mt-4 text-primary-600 hover:underline font-semibold"
        >
          ← Volver a consultas
        </button>
      </div>
    );
  }

  const paciente = consulta.paciente;

  // ============================================================
  // TABS
  // ============================================================
  const tabs = [
    { id: 'soap', label: '📋 SOAP' },
    { id: 'signos', label: '📊 Signos Vitales' },
    { id: 'paciente', label: '👤 Paciente' },
  ];

  // ============================================================
  // IMPRIMIR
  // ============================================================
  const handleImprimir = () => {
    window.print();
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate('/consultas')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a consultas
        </button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" onClick={handleImprimir}>
            🖨️ Imprimir
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/pacientes/${paciente?.id}`)}
          >
            👤 Ver paciente
          </Button>
        </div>
      </div>

      {/* CARD PRINCIPAL */}
      <DetalleHeaderConsulta consulta={consulta} />

      {/* TABS */}
      <Card padding="none">
        <div className="border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50/30 dark:bg-primary-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'soap' && <DetalleTabSOAP consulta={consulta} />}
          {activeTab === 'signos' && <DetalleTabSignos signosVitales={signosVitales} />}
          {activeTab === 'paciente' && <DetalleTabPaciente paciente={paciente} />}
        </div>
      </Card>
    </div>
  );
}

export default DetalleConsulta;