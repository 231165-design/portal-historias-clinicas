// ============================================================
// COMPONENTE: FiltrosCitas
// ============================================================

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { ESTADOS_CITA } from '../../utils/constants';

function FiltrosCitas({
  search,
  setSearch,
  filtroEstado,
  setFiltroEstado,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  onNuevaCita,
  onLimpiar,
  hayFiltrosActivos,
}) {
  const opcionesEstado = [
    { value: '', label: 'Todos los estados' },
    ...Object.values(ESTADOS_CITA).map((e) => ({ value: e, label: e })),
  ];

  return (
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
            onClick={onNuevaCita}
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

export default FiltrosCitas;