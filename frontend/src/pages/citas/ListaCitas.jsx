// ============================================================
// PÁGINA: Lista de Citas
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import BannerCitas from '../../components/citas/BannerCitas';
import StatsCitas from '../../components/citas/StatsCitas';
import FiltrosCitas from '../../components/citas/FiltrosCitas';
import TarjetaCita from '../../components/citas/TarjetaCita';
import useDebounce from '../../hooks/useDebounce';
import citaService from '../../services/citaService';

function ListaCitas() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADO
  // ============================================================
  const [citas, setCitas] = useState([]);
  const [stats, setStats] = useState({});
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
      if (response) setStats(response);
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
  // HANDLERS
  // ============================================================
  const limpiarFiltros = () => {
    setSearch('');
    setFiltroEstado('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(1);
  };

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

  const hayFiltrosActivos = search || filtroEstado || fechaDesde || fechaHasta;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <BannerCitas />

      {/* Estadísticas */}
      <StatsCitas stats={stats} loading={loadingStats} />

      {/* Filtros */}
      <FiltrosCitas
        search={search}
        setSearch={setSearch}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        fechaDesde={fechaDesde}
        setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta}
        setFechaHasta={setFechaHasta}
        onNuevaCita={() => navigate('/citas/nueva')}
        onLimpiar={limpiarFiltros}
        hayFiltrosActivos={hayFiltrosActivos}
      />

      {/* Lista de citas */}
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
          {citas.map((cita) => (
            <TarjetaCita
              key={cita.id}
              cita={cita}
              onCambiarEstado={handleCambiarEstado}
              onCancelar={handleCancelar}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
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