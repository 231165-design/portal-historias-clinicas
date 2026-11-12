// ============================================================
// PÁGINA: Auditoría
// ============================================================

import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import useDebounce from '../../hooks/useDebounce';
import { formatDateTime } from '../../utils/formatters';

// Mock de auditoría
const MOCK_AUDITORIA = [
  { id: 1, usuario: 'Carlos Mendoza', accion: 'LOGIN', modulo: 'AUTH', detalle: 'Inicio de sesión exitoso', ip: '192.168.1.10', created_at: '2026-11-12T08:00:00' },
  { id: 2, usuario: 'Ana Torres', accion: 'CREAR', modulo: 'PACIENTES', detalle: 'Paciente Juan Pérez creado', ip: '192.168.1.15', created_at: '2026-11-12T08:30:00' },
  { id: 3, usuario: 'Carlos Mendoza', accion: 'EDITAR', modulo: 'PACIENTES', detalle: 'Paciente María García actualizada', ip: '192.168.1.10', created_at: '2026-11-12T09:15:00' },
  { id: 4, usuario: 'Luis Ramírez', accion: 'CREAR', modulo: 'VACUNAS', detalle: 'Vacuna aplicada a Rosa Flores', ip: '192.168.1.20', created_at: '2026-11-12T10:00:00' },
  { id: 5, usuario: 'Ana Torres', accion: 'LOGOUT', modulo: 'AUTH', detalle: 'Cierre de sesión', ip: '192.168.1.15', created_at: '2026-11-12T17:00:00' },
];

function Auditoria() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setTimeout(() => {
      setRegistros(MOCK_AUDITORIA);
      setLoading(false);
    }, 500);
  }, []);

  const registrosFiltrados = registros.filter((r) =>
    `${r.usuario} ${r.accion} ${r.modulo} ${r.detalle}`.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const getAccionBadge = (accion) => {
    const variants = {
      LOGIN: 'success',
      LOGOUT: 'gray',
      CREAR: 'primary',
      EDITAR: 'warning',
      ELIMINAR: 'danger',
      CONSULTAR: 'info',
    };
    return variants[accion] || 'gray';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">🛡️ Auditoría del Sistema</h1>
        <p className="text-sm text-gray-500 mt-1">Registro de todas las acciones realizadas</p>
      </div>

      <Card padding="md">
        <Input placeholder="🔍 Buscar por usuario, acción o módulo..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      {loading ? (
        <Card padding="lg"><div className="text-center py-10"><Spinner size="lg" text="Cargando auditoría..." /></div></Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha/Hora</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Usuario</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Acción</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Módulo</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Detalle</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrosFiltrados.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-600">{formatDateTime(r.created_at)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{r.usuario}</td>
                    <td className="px-4 py-3"><Badge variant={getAccionBadge(r.accion)} size="sm">{r.accion}</Badge></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{r.modulo}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{r.detalle}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{r.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Auditoria;