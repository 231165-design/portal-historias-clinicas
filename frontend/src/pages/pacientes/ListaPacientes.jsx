// ============================================================
// PÁGINA: Lista de Pacientes
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PacientesTable from '../../components/tables/PacientesTable';
import ConfirmModal from '../../components/modals/ConfirmModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import useDebounce from '../../hooks/useDebounce';
import pacienteService from '../../services/pacienteService';
import { TIPOS_SEGURO_LIST } from '../../utils/constants';

function ListaPacientes() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADO
  // ============================================================
  const [pacientes, setPacientes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    consultasMes: 0,
    citasPendientes: 0,
    vacunasAlDia: 0,
    masculino: 0,
    femenino: 0,
  });
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
      if (response) {
        setStats({
          total: response.total || 0,
          consultasMes: response.consultasMes || 0,
          citasPendientes: response.citasPendientes || 0,
          vacunasAlDia: response.vacunasAlDia || 0,
          masculino: response.masculino || 0,
          femenino: response.femenino || 0,
        });
      }
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
  // ELIMINAR
  // ============================================================
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

  // ============================================================
  // NAVEGACIÓN
  // ============================================================
  const handleView = (paciente) => navigate(`/pacientes/${paciente.id}`);
  const handleEdit = (paciente) => navigate(`/pacientes/${paciente.id}/editar`);
  const handleNew = () => navigate('/pacientes/nuevo');

  // ============================================================
  // LIMPIAR FILTROS
  // ============================================================
  const limpiarFiltros = () => {
    setSearch('');
    setFiltroSexo('');
    setFiltroSeguro('');
    setFiltroEdad('');
    setPage(1);
  };

  const hayFiltrosActivos = search || filtroSexo || filtroSeguro || filtroEdad;

  // ============================================================
  // OPCIONES DE FILTROS
  // ============================================================
  const opcionesSexo = [
    { value: '', label: 'Todos los sexos' },
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
  ];

  const opcionesSeguro = [
    { value: '', label: 'Todos los seguros' },
    ...TIPOS_SEGURO_LIST.map((s) => ({ value: s, label: s })),
  ];

  const opcionesEdad = [
    { value: '', label: 'Rango de edad' },
    { value: '0-5', label: '0-5 años' },
    { value: '6-17', label: '6-17 años' },
    { value: '18-29', label: '18-29 años' },
    { value: '30-59', label: '30-59 años' },
    { value: '60+', label: '60+ años' },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">

      {/* ============================================================ */}
      {/* BANNER DE BIENVENIDA */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-primary-600 to-purple-700 dark:from-blue-800 dark:via-primary-800 dark:to-purple-900 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              👥
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold">Pacientes</h1>
              <p className="text-sm text-white/80 mt-1">
                Gestiona el registro de pacientes de la posta
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
      </div>

      {/* ============================================================ */}
      {/* ESTADÍSTICAS (4 TARJETAS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-md">
              👥
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Pacientes
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
                Consultas Mes
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.consultasMes}
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
                Citas Pendientes
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.citasPendientes}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl text-white shadow-md">
              💉
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vacunas al Día
              </p>
              <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">
                {loadingStats ? '...' : stats.vacunasAlDia}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ============================================================ */}
      {/* BARRA DE FILTROS */}
      {/* ============================================================ */}
      <Card padding="md">
        <div className="space-y-3">
          <Input
            placeholder="🔍 Buscar por nombre, apellido, DNI o historia clínica..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={(props) => (
              <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              value={filtroSexo}
              onChange={(e) => setFiltroSexo(e.target.value)}
              options={opcionesSexo}
            />
            <Select
              value={filtroSeguro}
              onChange={(e) => setFiltroSeguro(e.target.value)}
              options={opcionesSeguro}
            />
            <Select
              value={filtroEdad}
              onChange={(e) => setFiltroEdad(e.target.value)}
              options={opcionesEdad}
            />
            <Button
              variant={hayFiltrosActivos ? 'danger' : 'secondary'}
              onClick={limpiarFiltros}
              disabled={!hayFiltrosActivos}
              fullWidth
            >
              {hayFiltrosActivos ? '✕ Limpiar filtros' : 'Sin filtros'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* HEADER DE TABLA + BOTÓN NUEVO */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Lista de Pacientes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? 'Cargando...' : `Mostrando ${pacientes.length} de ${total} pacientes`}
          </p>
        </div>
        <Button variant="primary" onClick={handleNew} size="lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Paciente
        </Button>
      </div>

      {/* ============================================================ */}
      {/* TABLA DE PACIENTES */}
      {/* ============================================================ */}
      <PacientesTable
        pacientes={pacientes}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleEliminar}
      />

      {/* ============================================================ */}
      {/* PAGINACIÓN */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* MODAL ELIMINAR */}
      {/* ============================================================ */}
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