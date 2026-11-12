// ============================================================
// PÁGINA: Historia Clínica
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import pacienteService from '../../services/pacienteService';
import { formatDate, calcularEdad, formatDNI } from '../../utils/formatters';

// Mock de consultas (mientras no haya backend)
const MOCK_CONSULTAS = [
  {
    id: 1,
    fecha_hora: '2026-11-10T09:30:00',
    medico: 'Dr. Carlos Mendoza',
    motivo: 'Dolor de cabeza persistente',
    diagnostico: 'Cefalea tensional',
    cie10: 'G44.2',
    tratamiento: 'Paracetamol 500mg cada 8h',
    signos: { temp: '36.8°C', pa: '130/85', fc: '78', peso: '78.5kg', talla: '172cm', imc: '26.5' },
  },
  {
    id: 2,
    fecha_hora: '2026-10-15T14:00:00',
    medico: 'Dra. Ana Torres',
    motivo: 'Control general',
    diagnostico: 'Paciente estable',
    cie10: 'Z00.0',
    tratamiento: 'Ninguno',
    signos: { temp: '36.5°C', pa: '120/80', fc: '72', peso: '77kg', talla: '172cm', imc: '26.0' },
  },
];

function HistoriaClinica() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [activeTab, setActiveTab] = useState('resumen');

  // ============================================================
  // BUSCAR PACIENTE
  // ============================================================
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Ingrese un DNI o Historia Clínica');
      return;
    }

    setSearching(true);
    try {
      const result = await pacienteService.buscar(searchTerm.trim());
      if (result) {
        setPaciente(result);
        toast.success('Paciente encontrado');
      } else {
        toast.error('Paciente no encontrado');
        setPaciente(null);
      }
    } catch (error) {
      toast.error('Error al buscar paciente');
      setPaciente(null);
    } finally {
      setSearching(false);
    }
  };

  // ============================================================
  // RENDER: BÚSQUEDA
  // ============================================================
  if (!paciente) {
    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-extrabold text-gray-800">Historia Clínica</h1>
          <p className="text-sm text-gray-500 mt-2">
            Busca un paciente por DNI o número de Historia Clínica
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              label="DNI o N° de Historia Clínica"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: 12345678 o 2026-00001"
              icon={(props) => (
                <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            />
            <Button type="submit" variant="primary" fullWidth size="lg" loading={searching}>
              🔍 Buscar Historia Clínica
            </Button>
          </form>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>💡 También puedes ir a la lista de pacientes:</p>
          <Link to="/pacientes" className="text-primary-600 hover:underline font-semibold">
            Ver todos los pacientes →
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER: HISTORIA CLÍNICA COMPLETA
  // ============================================================
  const edad = calcularEdad(paciente.fecha_nacimiento);
  const nombreCompleto = `${paciente.nombres} ${paciente.apellidos}`;

  const tabs = [
    { id: 'resumen', label: '📋 Resumen' },
    { id: 'consultas', label: '🩺 Consultas' },
    { id: 'antecedentes', label: '📚 Antecedentes' },
    { id: 'vacunas', label: '💉 Vacunas' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => setPaciente(null)}>
          ← Nueva búsqueda
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          🖨️ Imprimir HC
        </Button>
      </div>

      {/* CARD PACIENTE */}
      <Card padding="lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar name={nombreCompleto} size="2xl" />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-gray-800">{nombreCompleto}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <Badge variant="primary" size="md">HC: {paciente.historia_clinica}</Badge>
              <Badge variant="gray" size="md">{paciente.sexo === 'M' ? '♂' : '♀'} {edad} años</Badge>
              <Badge variant="info" size="md">DNI: {formatDNI(paciente.dni)}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              🩸 {paciente.grupo_sanguineo || '—'} · {paciente.tipo_seguro || 'Sin seguro'}
            </p>
          </div>
        </div>
      </Card>

      {/* ALERTA ALERGIAS */}
      {paciente.alergias && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <strong className="text-red-800">Alergias:</strong>{' '}
              <span className="text-red-700">{paciente.alergias}</span>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <Card padding="none">
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'resumen' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Nombre completo" value={nombreCompleto} />
              <InfoItem label="DNI" value={formatDNI(paciente.dni)} />
              <InfoItem label="Fecha de nacimiento" value={formatDate(paciente.fecha_nacimiento)} />
              <InfoItem label="Edad" value={`${edad} años`} />
              <InfoItem label="Sexo" value={paciente.sexo === 'M' ? 'Masculino' : 'Femenino'} />
              <InfoItem label="Estado civil" value={paciente.estado_civil || '—'} />
              <InfoItem label="Teléfono" value={paciente.telefono || '—'} />
              <InfoItem label="Dirección" value={paciente.direccion || '—'} />
              <InfoItem label="Grupo sanguíneo" value={paciente.grupo_sanguineo || '—'} />
              <InfoItem label="Tipo de seguro" value={paciente.tipo_seguro || '—'} />
            </div>
          )}

          {activeTab === 'consultas' && (
            <div className="space-y-4">
              {MOCK_CONSULTAS.map((c) => (
                <div key={c.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">{formatDate(c.fecha_hora)}</Badge>
                      <span className="text-sm font-semibold text-gray-700">{c.medico}</span>
                    </div>
                    <Badge variant="success" size="sm">Completada</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><strong className="text-gray-600">Motivo:</strong> {c.motivo}</div>
                    <div><strong className="text-gray-600">Diagnóstico:</strong> {c.diagnostico} ({c.cie10})</div>
                    <div className="md:col-span-2"><strong className="text-gray-600">Tratamiento:</strong> {c.tratamiento}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                    <div><span className="text-gray-400">Temp:</span> {c.signos.temp}</div>
                    <div><span className="text-gray-400">PA:</span> {c.signos.pa}</div>
                    <div><span className="text-gray-400">FC:</span> {c.signos.fc}</div>
                    <div><span className="text-gray-400">Peso:</span> {c.signos.peso}</div>
                    <div><span className="text-gray-400">Talla:</span> {c.signos.talla}</div>
                    <div><span className="text-gray-400">IMC:</span> {c.signos.imc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'antecedentes' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-amber-800 mb-2">🩺 Antecedentes personales</h4>
                <p className="text-sm text-amber-700">Sin antecedentes registrados</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2">👨‍👩‍👧 Antecedentes familiares</h4>
                <p className="text-sm text-blue-700">Sin antecedentes registrados</p>
              </div>
            </div>
          )}

          {activeTab === 'vacunas' && (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">💉</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Carnet de vacunación</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Las vacunas se mostrarán aquí una vez que el módulo de vacunación esté completo.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

export default HistoriaClinica;