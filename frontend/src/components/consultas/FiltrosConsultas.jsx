// ============================================================
// COMPONENTE: FiltrosConsultas
// ============================================================

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { TIPOS_ATENCION } from '../../utils/constants';

function FiltrosConsultas({
  search,
  setSearch,
  filtroEstado,
  setFiltroEstado,
  filtroTipo,
  setFiltroTipo,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  onNuevaConsulta,
  onLimpiar,
  hayFiltrosActivos,
}) {
  const opcionesEstado = [
    { value: '', label: 'Todos los estados' },
    { value: 'Completada', label: 'Completada' },
    { value: 'En curso', label: 'En curso' },
    { value: 'Anulada', label: 'Anulada' },
  ];

  const opcionesTipo = [
    { value: '', label: 'Todos los tipos' },
    ...TIPOS_ATENCION.map((t) => ({ value: t, label: t })),
  ];

  return (
    <Card padding="md">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="🔍 Buscar por paciente o diagnóstico..."
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
            onClick={onNuevaConsulta}
            className="whitespace-nowrap"
          >
            + Nueva Consulta
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            options={opcionesEstado}
          />
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
            onClick={onLimpiar}
            disabled={!hayFiltrosActivos}
            fullWidth
          >
            {hayFiltrosActivos ? '✕ Limpiar' : 'Sin filtros'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default FiltrosConsultas;