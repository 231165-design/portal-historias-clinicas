// ============================================================
// PÁGINA: Lista de Vacunas
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import useDebounce from '../../hooks/useDebounce';
import vacunaService from '../../services/vacunaService';
import { formatDate, calcularEdad } from '../../utils/formatters';
import { TIPOS_VACUNA } from '../../utils/constants';

function ListaVacunas() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADO
  // ============================================================
  const [vacunas, setVacunas] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    esteMes: 0,
    topVacunas: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  // ============================================================
  // CARGAR ESTADÍSTICAS
  // ============================================================
  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoadingStats(true);
      const response = await vacunaService.getEstadisticas();
      if (response) {
        setStats({
          total: response.total || 0,
          esteMes: response.esteMes || 0,
          topVacunas: response.topVacunas || [],
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // ============================================================
  // CARGAR VACUNAS
  // ============================================================
  const cargarVacunas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await vacunaService.listar({
        page,
        limit,
        search: debouncedSearch,
        tipo_vacuna: filtroTipo,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
      });

      if (response) {
        setVacunas(response.data || []);
        setTotal(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar vacunas');
      setVacunas([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filtroTipo, fechaDesde, fechaHasta]);

  // ============================================================
  // EFFECTS
  // ============================================================
  useEffect(() => {
    cargarVacunas();
  }, [cargarVacunas]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filtroTipo, fechaDesde, fechaHasta]);

  // ============================================================
  // LIMPIAR FILTROS
  // ============================================================
  const limpiarFiltros = () => {
    setSearch('');
    setFiltroTipo('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(1);
  };

  const hayFiltrosActivos = search || filtroTipo || fechaDesde || fechaHasta;

  // ============================================================
  // OPCIONES DE FILTROS
  // ============================================================
  const opcionesTipo = [
    { value: '', label: 'Todos los tipos' },
    ...TIPOS_VACUNA.map((t) => ({ value: t, label: t })),
  ];

  // ============================================================
  // ELIMINAR
  // ============================================================
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta vacuna?')) return;

    try {
      await vacunaService.eliminar(id);
      toast.success('Vacuna eliminada correctamente');
      cargarVacunas();
      cargarEstadisticas();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar');
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">

      {/* ============================================================ */}
      {/* BANNER */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-900 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              💉
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold">Gestión de Vacunas</h1>
              <p className="text-sm text-white/80 mt-1">
                Registro de vacunación de la posta
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
      </div>

      {/* ============================================================ */}
      {/* ESTADÍSTICAS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl text-white shadow-md">
              💉
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Vacunas
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-2xl text-white shadow-md">
              📅
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Este Mes
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.esteMes}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-2xl text-white shadow-md">
              🏆
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Más Aplicada
              </p>
              <p className="text-sm font-extrabold text-gray-800 dark:text-white mt-1 truncate">
                {loadingStats ? '...' : (stats.topVacunas[0]?.nombre || '—')}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-md">
              🎯
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tipos
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {TIPOS_VACUNA.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ============================================================ */}
      {/* FILTROS */}
      {/* ============================================================ */}
      <Card padding="md">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="🔍 Buscar por paciente o tipo de vacuna..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={(props) => (
                <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            />
            <Button
              variant="primary"
              onClick={() => navigate('/vacunas/nueva')}
              className="whitespace-nowrap"
            >
              + Nueva Vacuna
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              options={opcionesTipo}
            />
            <Input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              placeholder="Desde"
            />
            <Input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              placeholder="Hasta"
            />
            <Button
              variant={hayFiltrosActivos ? 'danger' : 'secondary'}
              onClick={limpiarFiltros}
              disabled={!hayFiltrosActivos}
              fullWidth
            >
              {hayFiltrosActivos ? '✕ Limpiar' : 'Sin filtros'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* LISTA DE VACUNAS */}
      {/* ============================================================ */}
      {loading ? (
        <Card padding="lg">
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" text="Cargando vacunas..." />
          </div>
        </Card>
      ) : vacunas.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💉</div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">
              No hay vacunas registradas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Comienza registrando la primera vacuna del paciente.
            </p>
            <Button variant="primary" onClick={() => navigate('/vacunas/nueva')}>
              ➕ Registrar primera vacuna
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {vacunas.map((vacuna) => {
            const edad = vacuna.paciente?.fecha_nacimiento
              ? calcularEdad(vacuna.paciente.fecha_nacimiento)
              : null;

            return (
              <Card key={vacuna.id} padding="md" hover>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <Avatar
                    name={`${vacuna.paciente?.nombres} ${vacuna.paciente?.apellidos}`}
                    size="lg"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-800 dark:text-white text-base">
                        {vacuna.paciente?.nombres} {vacuna.paciente?.apellidos}
                      </h3>
                      <Badge variant="success" size="sm">
                        💉 {vacuna.tipo_vacuna}
                      </Badge>
                      {edad !== null && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {edad} años
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="text-gray-700 dark:text-gray-200">Dosis:</strong>{' '}
                      {vacuna.dosis || '—'} · <strong className="text-gray-700 dark:text-gray-200">Lote:</strong>{' '}
                      {vacuna.lote || '—'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>📅 Aplicada: {formatDate(vacuna.fecha_aplicacion)}</span>
                      {vacuna.lugar_aplicacion && <span>📍 {vacuna.lugar_aplicacion}</span>}
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        📋 HC: {vacuna.paciente?.historia_clinica}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 lg:flex-shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEliminar(vacuna.id)}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* PAGINACIÓN */}
      {/* ============================================================ */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <strong>{vacunas.length}</strong> de <strong>{total}</strong> vacunas
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let numPage;
                if (totalPages <= 5) numPage = i + 1;
                else if (page <= 3) numPage = i + 1;
                else if (page >= totalPages - 2) numPage = totalPages - 4 + i;
                else numPage = page - 2 + i;

                return (
                  <button
                    key={numPage}
                    onClick={() => setPage(numPage)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                      page === numPage
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {numPage}
                  </button>
                );
              })}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaVacunas;