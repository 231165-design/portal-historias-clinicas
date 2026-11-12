// ============================================================
// PÁGINA: Lista de Citas
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
import citaService from '../../services/citaService';
import { formatDateTime, calcularEdad } from '../../utils/formatters';
import { ESTADOS_CITA } from '../../utils/constants';

function ListaCitas() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADO
  // ============================================================
  const [citas, setCitas] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    hoy: 0,
    semana: 0,
    programadas: 0,
    confirmadas: 0,
    atendidas: 0,
    canceladas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
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
      const response = await citaService.getEstadisticas();
      if (response) {
        setStats({
          total: response.total || 0,
          hoy: response.hoy || 0,
          semana: response.semana || 0,
          programadas: response.programadas || 0,
          confirmadas: response.confirmadas || 0,
          atendidas: response.atendidas || 0,
          canceladas: response.canceladas || 0,
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // ============================================================
  // CARGAR CITAS
  // ============================================================
  const cargarCitas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await citaService.listar({
        page,
        limit,
        search: debouncedSearch,
        estado: filtroEstado,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
      });

      if (response) {
        setCitas(response.data || []);
        setTotal(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar citas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filtroEstado, fechaDesde, fechaHasta]);

  // ============================================================
  // EFFECTS
  // ============================================================
  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filtroEstado, fechaDesde, fechaHasta]);

  // ============================================================
  // LIMPIAR FILTROS
  // ============================================================
  const limpiarFiltros = () => {
    setSearch('');
    setFiltroEstado('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(1);
  };

  const hayFiltrosActivos = search || filtroEstado || fechaDesde || fechaHasta;

  // ============================================================
  // OPCIONES DE FILTROS
  // ============================================================
  const opcionesEstado = [
    { value: '', label: 'Todos los estados' },
    ...Object.values(ESTADOS_CITA).map((e) => ({ value: e, label: e })),
  ];

  // ============================================================
  // BADGE DE ESTADO
  // ============================================================
  const getEstadoBadge = (estado) => {
    const variants = {
      Programada: 'info',
      Confirmada: 'cyan',
      Atendida: 'success',
      Cancelada: 'danger',
      'No asistió': 'gray',
    };
    return variants[estado] || 'gray';
  };

  // ============================================================
  // CAMBIAR ESTADO
  // ============================================================
  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await citaService.cambiarEstado(id, nuevoEstado);
      toast.success(`Cita marcada como: ${nuevoEstado}`);
      cargarCitas();
      cargarEstadisticas();
    } catch (error) {
      toast.error(error.message || 'Error al cambiar estado');
    }
  };

  // ============================================================
  // CANCELAR CITA
  // ============================================================
  const handleCancelar = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta cita?')) return;

    try {
      await citaService.eliminar(id);
      toast.success('Cita cancelada');
      cargarCitas();
      cargarEstadisticas();
    } catch (error) {
      toast.error(error.message || 'Error al cancelar');
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-700 dark:from-purple-800 dark:via-pink-800 dark:to-red-900 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              📅
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold">Gestión de Citas</h1>
              <p className="text-sm text-white/80 mt-1">
                Administra las citas programadas de la posta
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-md">
              📊
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Citas
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl text-white shadow-md">
              📅
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hoy
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.hoy}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl text-white shadow-md">
              ⏰
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Esta Semana
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.semana}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl text-white shadow-md">
              ✅
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Atendidas
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.atendidas}
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
              placeholder="🔍 Buscar por paciente o motivo..."
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
              onClick={() => navigate('/citas/nueva')}
              className="whitespace-nowrap"
            >
              + Nueva Cita
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              options={opcionesEstado}
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
      {/* LISTA DE CITAS */}
      {/* ============================================================ */}
      {loading ? (
        <Card padding="lg">
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" text="Cargando citas..." />
          </div>
        </Card>
      ) : citas.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">
              No hay citas registradas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Comienza programando la primera cita del día.
            </p>
            <Button variant="primary" onClick={() => navigate('/citas/nueva')}>
              ➕ Programar primera cita
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {citas.map((cita) => {
            const edad = cita.paciente?.fecha_nacimiento
              ? calcularEdad(cita.paciente.fecha_nacimiento)
              : null;

            return (
              <Card key={cita.id} padding="md" hover>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Avatar */}
                  <Avatar
                    name={`${cita.paciente?.nombres} ${cita.paciente?.apellidos}`}
                    size="lg"
                  />

                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-800 dark:text-white text-base">
                        {cita.paciente?.nombres} {cita.paciente?.apellidos}
                      </h3>
                      <Badge variant={getEstadoBadge(cita.estado)} size="sm">
                        {cita.estado}
                      </Badge>
                      {edad !== null && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {edad} años
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong className="text-gray-700 dark:text-gray-200">Motivo:</strong>{' '}
                      {cita.motivo || 'Sin motivo especificado'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        🩺 Dr(a). {cita.medico?.nombres} {cita.medico?.apellidos}
                      </span>
                      <span>📅 {formatDateTime(cita.fecha_hora)}</span>
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        🏷️ {cita.tipo}
                      </span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                    {cita.estado === 'Programada' && (
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleCambiarEstado(cita.id, 'Confirmada')}
                      >
                        ✓ Confirmar
                      </Button>
                    )}
                    {cita.estado === 'Confirmada' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleCambiarEstado(cita.id, 'Atendida')}
                      >
                        ✓ Atender
                      </Button>
                    )}
                    {(cita.estado === 'Programada' || cita.estado === 'Confirmada') && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelar(cita.id)}
                      >
                        ✕ Cancelar
                      </Button>
                    )}
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
            Mostrando <strong>{citas.length}</strong> de <strong>{total}</strong> citas
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

export default ListaCitas;