// ============================================================
// COMPONENTE: FiltrosVacunas
// ============================================================

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { TIPOS_VACUNA } from '../../utils/constants';

function FiltrosVacunas({
  search,
  setSearch,
  filtroTipo,
  setFiltroTipo,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  onNuevaVacuna,
  onLimpiar,
  hayFiltrosActivos,
}) {
  const opcionesTipo = [
    { value: '', label: 'Todos los tipos' },
    ...TIPOS_VACUNA.map((t) => ({ value: t, label: t })),
  ];

  return (
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
            onClick={onNuevaVacuna}
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

export default FiltrosVacunas;