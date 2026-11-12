// ============================================================
// COMPONENTE: InfoRegistroVacuna
// ============================================================

function InfoRegistroVacuna() {
  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💉</span>
        <div>
          <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
            Registro de vacunación
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            Complete los datos según el carnet de vacunación del paciente. Los campos marcados con{' '}
            <span className="text-red-500 font-bold">*</span> son obligatorios.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoRegistroVacuna;