// ============================================================
// PÁGINA: Farmacia - Inventario
// ============================================================

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import useDebounce from '../../hooks/useDebounce';
import { formatDate, formatCurrency } from '../../utils/formatters';

// Mock de medicamentos
const MOCK_MEDICAMENTOS = [
  { id: 1, codigo: 'MED-001', nombre_generico: 'Paracetamol', presentacion: 'Tableta 500mg', stock_actual: 250, stock_minimo: 50, precio_unitario: 0.20, fecha_vencimiento: '2027-06-30' },
  { id: 2, codigo: 'MED-002', nombre_generico: 'Ibuprofeno', presentacion: 'Tableta 400mg', stock_actual: 180, stock_minimo: 50, precio_unitario: 0.30, fecha_vencimiento: '2027-03-15' },
  { id: 3, codigo: 'MED-003', nombre_generico: 'Amoxicilina', presentacion: 'Cápsula 500mg', stock_actual: 45, stock_minimo: 50, precio_unitario: 0.80, fecha_vencimiento: '2026-12-31' },
  { id: 4, codigo: 'MED-004', nombre_generico: 'Omeprazol', presentacion: 'Cápsula 20mg', stock_actual: 120, stock_minimo: 30, precio_unitario: 0.50, fecha_vencimiento: '2027-08-20' },
  { id: 5, codigo: 'MED-006', nombre_generico: 'Losartán', presentacion: 'Tableta 50mg', stock_actual: 15, stock_minimo: 40, precio_unitario: 0.60, fecha_vencimiento: '2027-01-25' },
];

function Inventario() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setTimeout(() => {
      setMedicamentos(MOCK_MEDICAMENTOS);
      setLoading(false);
    }, 500);
  }, []);

  const medicamentosFiltrados = medicamentos.filter((m) =>
    `${m.nombre_generico} ${m.codigo} ${m.presentacion}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  // Estadísticas
  const totalMedicamentos = medicamentos.length;
  const stockCritico = medicamentos.filter((m) => m.stock_actual <= m.stock_minimo).length;
  const porVencer = medicamentos.filter((m) => {
    const dias = (new Date(m.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24);
    return dias > 0 && dias <= 30;
  }).length;

  // Estado de stock
  const getStockBadge = (m) => {
    if (m.stock_actual <= m.stock_minimo) return { variant: 'danger', label: 'CRÍTICO' };
    if (m.stock_actual <= m.stock_minimo * 1.5) return { variant: 'warning', label: 'BAJO' };
    return { variant: 'success', label: 'OK' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">💊 Farmacia - Inventario</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de medicamentos y stock</p>
        </div>
        <Button variant="primary" onClick={() => toast.info('Función en desarrollo')}>
          ➕ Agregar Medicamento
        </Button>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl">💊</div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
              <p className="text-2xl font-extrabold text-gray-800">{totalMedicamentos}</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">⚠️</div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Stock crítico</p>
              <p className="text-2xl font-extrabold text-red-600">{stockCritico}</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">📅</div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Por vencer</p>
              <p className="text-2xl font-extrabold text-amber-600">{porVencer}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* BUSCADOR */}
      <Card padding="md">
        <Input
          placeholder="🔍 Buscar medicamento por nombre o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={(props) => (
            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        />
      </Card>

      {/* TABLA */}
      {loading ? (
        <Card padding="lg">
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" text="Cargando inventario..." />
          </div>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Código</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Medicamento</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Presentación</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Stock</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Precio</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicamentosFiltrados.map((m) => {
                  const stockBadge = getStockBadge(m);
                  const diasVencimiento = Math.ceil(
                    (new Date(m.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{m.codigo}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{m.nombre_generico}</td>
                      <td className="px-4 py-3 text-gray-600">{m.presentacion}</td>
                      <td className="px-4 py-3 text-center font-bold text-gray-800">{m.stock_actual}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={stockBadge.variant} size="sm">{stockBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">
                        {formatCurrency(m.precio_unitario)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${diasVencimiento <= 30 ? 'text-amber-600' : 'text-gray-600'}`}>
                          {formatDate(m.fecha_vencimiento)}
                          {diasVencimiento <= 30 && diasVencimiento > 0 && (
                            <span className="block text-[10px] text-amber-500">({diasVencimiento} días)</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Inventario;