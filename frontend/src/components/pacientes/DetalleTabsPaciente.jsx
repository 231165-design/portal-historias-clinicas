// ============================================================
// COMPONENTE: DetalleTabsPaciente
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import InfoItem from '../ui/InfoItem';
import pacienteService from '../../services/pacienteService';
import { formatDate, formatDNI } from '../../utils/formatters';

function DetalleTabsPaciente({ paciente, edad }) {
  const [activeTab, setActiveTab] = useState('info');
  const [consultas, setConsultas] = useState([]);
  const [loadingConsultas, setLoadingConsultas] = useState(false);

  // Cargar consultas al cambiar al tab
  useEffect(() => {
    if (activeTab === 'consultas' && consultas.length === 0) {
      const cargarConsultas = async () => {
        try {
          setLoadingConsultas(true);
          const data = await pacienteService.getConsultas(paciente.id);
          setConsultas(data || []);
        } catch (error) {
          console.error('Error al cargar consultas:', error);
        } finally {
          setLoadingConsultas(false);
        }
      };
      cargarConsultas();
    }
  }, [activeTab, paciente.id, consultas.length]);

  const tabs = [
    { id: 'info', label: '📋 Datos Personales' },
    { id: 'contacto', label: '📞 Contacto' },
    { id: 'medico', label: '🩺 Datos Médicos' },
    { id: 'consultas', label: `📅 Consultas (${consultas.length})` },
  ];

  return (
    <>
      {/* TABS HEADER */}
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

      {/* CONTENIDO TABS */}
      <div className="p-6">
        {/* TAB: INFO */}
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

        {/* TAB: CONTACTO */}
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

        {/* TAB: MEDICO */}
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

        {/* TAB: CONSULTAS */}
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
                  to={`/consultas/nueva?paciente=${paciente.id}`}
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
    </>
  );
}

export default DetalleTabsPaciente;