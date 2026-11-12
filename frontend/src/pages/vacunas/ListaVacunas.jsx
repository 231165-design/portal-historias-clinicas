// ============================================================
// PÁGINA: Lista de Vacunas
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import BannerVacunas from '../../components/vacunas/BannerVacunas';
import StatsVacunas from '../../components/vacunas/StatsVacunas';
import FiltrosVacunas from '../../components/vacunas/FiltrosVacunas';
import TarjetaVacuna from '../../components/vacunas/TarjetaVacuna';
import useDebounce from '../../hooks/useDebounce';
import vacunaService from '../../services/vacunaService';

function ListaVacunas() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADO
  // ============================================================
  const [vacunas, setVacunas] = useState([]);
  const [stats, setStats] = useState({});
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
      if (response) setStats(response);
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
  // HANDLERS
  // ============================================================
  const limpiarFiltros = () => {
    setSearch('');
    setFiltroTipo('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(1);
  };

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

  const hayFiltrosActivos = search || filtroTipo || fechaDesde || fechaHasta;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <BannerVacunas />

      {/* Estadísticas */}
      <StatsVacunas stats={stats} loading={loadingStats} />

      {/* Filtros */}
      <FiltrosVacunas
        search={search}
        setSearch={setSearch}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        fechaDesde={fechaDesde}
        setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta}
        setFechaHasta={setFechaHasta}
        onNuevaVacuna={() => navigate('/vacunas/nueva')}
        onLimpiar={limpiarFiltros}
        hayFiltrosActivos={hayFiltrosActivos}
      />

      {/* Lista de vacunas */}
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
          {vacunas.map((vacuna) => (
            <TarjetaVacuna
              key={vacuna.id}
              vacuna={vacuna}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
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