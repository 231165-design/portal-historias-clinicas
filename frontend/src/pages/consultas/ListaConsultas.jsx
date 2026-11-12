// ============================================================
// PÁGINA: Lista de Consultas
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import BannerConsultas from '../../components/consultas/BannerConsultas';
import StatsConsultas from '../../components/consultas/StatsConsultas';
import FiltrosConsultas from '../../components/consultas/FiltrosConsultas';
import TarjetaConsulta from '../../components/consultas/TarjetaConsulta';
import useDebounce from '../../hooks/useDebounce';
import consultaService from '../../services/consultaService';

function ListaConsultas() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADO
  // ============================================================
  const [consultas, setConsultas] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    hoy: 0,
    pendientes: 0,
    seguimiento: 0,
    variacion: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
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
      const response = await consultaService.getEstadisticas();
      if (response) {
        setStats({
          total: response.total || 0,
          hoy: response.hoy || 0,
          pendientes: response.enCurso || 0,
          seguimiento: response.seguimiento || 0,
          variacion: response.variacion || 0,
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // ============================================================
  // CARGAR CONSULTAS
  // ============================================================
  const cargarConsultas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await consultaService.listar({
        page,
        limit,
        search: debouncedSearch,
        estado: filtroEstado,
        tipo_atencion: filtroTipo,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
      });

      if (response) {
        setConsultas(response.data || []);
        setTotal(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar consultas');
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filtroEstado, filtroTipo, fechaDesde, fechaHasta]);

  // ============================================================
  // EFFECTS
  // ============================================================
  useEffect(() => {
    cargarConsultas();
  }, [cargarConsultas]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filtroEstado, filtroTipo, fechaDesde, fechaHasta]);

  // ============================================================
  // LIMPIAR FILTROS
  // ============================================================
  const limpiarFiltros = () => {
    setSearch('');
    setFiltroEstado('');
    setFiltroTipo('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(1);
  };

  const hayFiltrosActivos = search || filtroEstado || filtroTipo || fechaDesde || fechaHasta;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* BANNER */}
      <BannerConsultas />

      {/* ESTADÍSTICAS */}
      <StatsConsultas stats={stats} loading={loadingStats} />

      {/* FILTROS */}
      <FiltrosConsultas
        search={search}
        setSearch={setSearch}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        fechaDesde={fechaDesde}
        setFechaDesde={setFechaDesde}
        fechaHasta={fechaHasta}
        setFechaHasta={setFechaHasta}
        onNuevaConsulta={() => navigate('/consultas/nueva')}
        onLimpiar={limpiarFiltros}
        hayFiltrosActivos={hayFiltrosActivos}
      />

      {/* LISTA DE CONSULTAS */}
      {loading ? (
        <Card padding="lg">
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-sm text-gray-500 dark:text-gray-400">Cargando consultas...</p>
          </div>
        </Card>
      ) : consultas.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🩺</div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">
              No hay consultas registradas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Comienza registrando la primera consulta médica del día.
            </p>
            <Button variant="primary" onClick={() => navigate('/consultas/nueva')}>
              ➕ Registrar primera consulta
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {consultas.map((consulta) => (
            <TarjetaConsulta key={consulta.id} consulta={consulta} />
          ))}
        </div>
      )}

      {/* PAGINACIÓN */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <strong>{consultas.length}</strong> de <strong>{total}</strong> consultas
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

export default ListaConsultas;