// ============================================================
// PÁGINA: Detalle de Paciente
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import pacienteService from '../../services/pacienteService';
import { formatDate, formatDateTime, calcularEdad, formatDNI } from '../../utils/formatters';

function DetallePaciente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingConsultas, setLoadingConsultas] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

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
  // CARGAR CONSULTAS (al cambiar al tab)
  // ============================================================
  useEffect(() => {
    if (activeTab === 'consultas' && paciente && consultas.length === 0) {
      const cargarConsultas = async () => {
        try {
          setLoadingConsultas(true);
          const data = await pacienteService.getConsultas(id);
          setConsultas(data || []);
        } catch (error) {
          console.error('Error al cargar consultas:', error);
        } finally {
          setLoadingConsultas(false);
        }
      };
      cargarConsultas();
    }
  }, [activeTab, paciente, id, consultas.length]);

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
  const nombreCompleto = `${paciente.nombres} ${paciente.apellidos}`;

  // ============================================================
  // TABS
  // ============================================================
  const tabs = [
    { id: 'info', label: '📋 Datos Personales', icon: '📋' },
    { id: 'contacto', label: '📞 Contacto', icon: '📞' },
    { id: 'medico', label: '🩺 Datos Médicos', icon: '🩺' },
    { id: 'consultas', label: `📅 Consultas (${consultas.length})`, icon: '📅' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ============================================================ */}
      {/* HEADER */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* CARD PRINCIPAL DEL PACIENTE */}
      {/* ============================================================ */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar name={nombreCompleto} size="2xl" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
              {nombreCompleto}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              <Badge variant="primary" size="md">
                HC: {paciente.historia_clinica}
              </Badge>
              <Badge variant="gray" size="md">
                {paciente.sexo === 'M' ? '♂ Masculino' : '♀ Femenino'}
              </Badge>
              <Badge variant="info" size="md">
                {edad} años
              </Badge>
              {paciente.tipo_seguro && (
                <Badge
                  variant={
                    paciente.tipo_seguro === 'SIS'
                      ? 'success'
                      : paciente.tipo_seguro === 'ESSALUD'
                      ? 'info'
                      : paciente.tipo_seguro === 'Privado'
                      ? 'purple'
                      : 'gray'
                  }
                  size="md"
                >
                  {paciente.tipo_seguro}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 Registrado: {formatDate(paciente.created_at)}</span>
              {paciente.telefono && <span>📱 {paciente.telefono}</span>}
              {paciente.email && <span>📧 {paciente.email}</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* ALERTAS IMPORTANTES */}
      {/* ============================================================ */}
      {paciente.alergias && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-red-800 dark:text-red-300 text-sm">
                Alergias conocidas
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {paciente.alergias}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TABS */}
      {/* ============================================================ */}
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
          {/* ============================================================ */}
          {/* TAB: INFO */}
          {/* ============================================================ */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Nombres" value={paciente.nombres} icon="👤" />
              <InfoItem label="Apellidos" value={paciente.apellidos} icon="👤" />
              <InfoItem label="DNI" value={paciente.dni ? formatDNI(paciente.dni) : '—'} icon="🆔" />
              <InfoItem label="Fecha de Nacimiento" value={formatDate(paciente.fecha_nacimiento)} icon="🎂" />
              <InfoItem label="Edad" value={`${edad} años`} icon="📅" />
              <InfoItem label="Sexo" value={paciente.sexo === 'M' ? 'Masculino' : 'Femenino'} icon="⚧" />
              <InfoItem label="Estado Civil" value={paciente.estado_civil || '—'} icon="💍" />
              <InfoItem label="Ocupación" value={paciente.ocupacion || '—'} icon="💼" />
              <InfoItem label="Grado Instrucción" value={paciente.grado_instruccion || '—'} icon="🎓" />
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: CONTACTO */}
          {/* ============================================================ */}
          {activeTab === 'contacto' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Teléfono" value={paciente.telefono || '—'} icon="📱" />
              <InfoItem label="Email" value={paciente.email || '—'} icon="📧" />
              <InfoItem label="Dirección" value={paciente.direccion || '—'} icon="🏠" />
              <InfoItem label="Distrito" value={paciente.distrito || '—'} icon="🗺️" />
              <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  🚨 Contacto de Emergencia
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="Nombre" value={paciente.contacto_emergencia || '—'} icon="👤" />
                  <InfoItem label="Teléfono" value={paciente.telefono_emergencia || '—'} icon="📱" />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: MEDICO */}
          {/* ============================================================ */}
          {activeTab === 'medico' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Grupo Sanguíneo" value={paciente.grupo_sanguineo || '—'} icon="🩸" />
              <InfoItem label="Factor RH" value={paciente.factor_rh || '—'} icon="🩸" />
              <InfoItem label="Tipo de Seguro" value={paciente.tipo_seguro || 'Ninguno'} icon="💳" />
              <InfoItem label="N° de Seguro" value={paciente.numero_seguro || '—'} icon="💳" />
              <InfoItem label="Alergias" value={paciente.alergias || 'Ninguna'} icon="⚠️" />
              <InfoItem label="Discapacidad" value={paciente.discapacidad || 'Ninguna'} icon="♿" />
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: CONSULTAS */}
          {/* ============================================================ */}
          {activeTab === 'consultas' && (
            <div>
              {loadingConsultas ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="md" text="Cargando consultas..." />
                </div>
              ) : consultas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">
                    No hay consultas registradas
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                    Este paciente aún no tiene consultas médicas registradas.
                  </p>
                  <Link
                    to={`/consultas/nueva?paciente=${id}`}
                    className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
                  >
                    🩺 Registrar primera consulta
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {consultas.map((c) => (
                    <div
                      key={c.id}
                      className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="primary" size="sm">
                            {formatDate(c.fecha_hora)}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            🩺 Dr. {c.medico?.nombres} {c.medico?.apellidos}
                          </span>
                        </div>
                        <Badge
                          variant={c.estado === 'Completada' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {c.estado}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Motivo:</span>{' '}
                          <span className="text-gray-700 dark:text-gray-300">{c.motivo_consulta}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Diagnóstico:</span>{' '}
                          <span className="text-gray-700 dark:text-gray-300 font-semibold">
                            {c.diagnostico_principal || '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// COMPONENTE AUXILIAR: InfoItem
// ============================================================
function InfoItem({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      {icon && <span className="text-xl mt-0.5">{icon}</span>}
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default DetallePaciente;