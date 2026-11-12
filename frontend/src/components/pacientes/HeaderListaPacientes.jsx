// ============================================================
// COMPONENTE: HeaderListaPacientes
// ============================================================

import Button from '../ui/Button';

function HeaderListaPacientes({ total, mostrando, loading, onNuevo }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Lista de Pacientes
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {loading ? 'Cargando...' : `Mostrando ${mostrando} de ${total} pacientes`}
        </p>
      </div>
      <Button variant="primary" onClick={onNuevo} size="lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Paciente
      </Button>
    </div>
  );
}

export default HeaderListaPacientes;