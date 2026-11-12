// ============================================================
// PÁGINA: Lista de Pacientes
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PacientesTable from '../../components/tables/PacientesTable';
import ConfirmModal from '../../components/modals/ConfirmModal';
import Button from '../../components/ui/Button';
import BannerPacientes from '../../components/pacientes/BannerPacientes';
import StatsPacientes from '../../components/pacientes/StatsPacientes';
import FiltrosPacientes from '../../components/pacientes/FiltrosPacientes';
import HeaderListaPacientes from '../../components/pacientes/HeaderListaPacientes';
import useDebounce from '../../hooks/useDebounce';
import pacienteService from '../../services/pacienteService';

function ListaPacientes() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADO
  // ============================================================
  const [pacientes, setPacientes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroSexo, setFiltroSexo] = useState('');
  const [filtroSeguro, setFiltroSeguro] = useState('');
  const [filtroEdad, setFiltroEdad] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal eliminar
  const [modalOpen, setModalOpen] = useState(false);
  const [pacienteAEliminar, setPacienteAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // ============================================================
  // CARGAR ESTADÍSTICAS
  // ============================================================
  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoadingStats(true);
      const response = await pacienteService.getEstadisticas();
      if (response) setStats(response);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // ============================================================
  // CARGAR PACIENTES
  // ============================================================
  const cargarPacientes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pacienteService.listar({
        page,
        limit,
        search: debouncedSearch,
        sexo: filtroSexo,
        tipo_seguro: filtroSeguro,
        rango_edad: filtroEdad,
      });

      if (response) {
        setPacientes(response.data || []);
        setTotal(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar pacientes');
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filtroSexo, filtroSeguro, filtroEdad]);

  // ============================================================
  // EFFECTS
  // ============================================================
  useEffect(() => {
    cargarPacientes();
  }, [cargarPacientes]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filtroSexo, filtroSeguro, filtroEdad]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const limpiarFiltros = () => {
    setSearch('');
    setFiltroSexo('');
    setFiltroSeguro('');
    setFiltroEdad('');
    setPage(1);
  };

  const handleEliminar = (paciente) => {
    setPacienteAEliminar(paciente);
    setModalOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!pacienteAEliminar) return;

    try {
      setEliminando(true);
      await pacienteService.eliminar(pacienteAEliminar.id);
      toast.success('Paciente eliminado correctamente');
      setModalOpen(false);
      setPacienteAEliminar(null);
      await cargarPacientes();
      await cargarEstadisticas();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar paciente');
    } finally {
      setEliminando(false);
    }
  };

  const hayFiltrosActivos = search || filtroSexo || filtroSeguro || filtroEdad;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <BannerPacientes />

      {/* Estadísticas */}
      <StatsPacientes stats={stats} loading={loadingStats} />

      {/* Filtros */}
      <FiltrosPacientes
        search={search}
        setSearch={setSearch}
        filtroSexo={filtroSexo}
        setFiltroSexo={setFiltroSexo}
        filtroSeguro={filtroSeguro}
        setFiltroSeguro={setFiltroSeguro}
        filtroEdad={filtroEdad}
        setFiltroEdad={setFiltroEdad}
        onLimpiar={limpiarFiltros}
        hayFiltrosActivos={hayFiltrosActivos}
      />

      {/* Header + Botón nuevo */}
      <HeaderListaPacientes
        total={total}
        mostrando={pacientes.length}
        loading={loading}
        onNuevo={() => navigate('/pacientes/nuevo')}
      />

      {/* Tabla de pacientes */}
      <PacientesTable
        pacientes={pacientes}
        loading={loading}
        onView={(p) => navigate(`/pacientes/${p.id}`)}
        onEdit={(p) => navigate(`/pacientes/${p.id}/editar`)}
        onDelete={handleEliminar}
      />

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong> · {total} registros
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

      {/* Modal Eliminar */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPacienteAEliminar(null);
        }}
        onConfirm={confirmarEliminar}
        title="¿Eliminar paciente?"
        message={`Estás a punto de eliminar a ${pacienteAEliminar?.nombres} ${pacienteAEliminar?.apellidos}. Esta acción no se puede deshacer.`}
        variant="danger"
        confirmText="Sí, eliminar"
        loading={eliminando}
      />
    </div>
  );
}

export default ListaPacientes;