// ============================================================
// COMPONENTE: FiltrosPacientes
// ============================================================

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { TIPOS_SEGURO_LIST } from '../../utils/constants';

function FiltrosPacientes({
  search,
  setSearch,
  filtroSexo,
  setFiltroSexo,
  filtroSeguro,
  setFiltroSeguro,
  filtroEdad,
  setFiltroEdad,
  onLimpiar,
  hayFiltrosActivos,
}) {
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

  return (
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
            onClick={onLimpiar}
            disabled={!hayFiltrosActivos}
            fullWidth
          >
            {hayFiltrosActivos ? '✕ Limpiar filtros' : 'Sin filtros'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default FiltrosPacientes;