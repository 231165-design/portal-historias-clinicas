// ============================================================
// COMPONENTE: InfoFormatoSOAP
// ============================================================

function InfoFormatoSOAP() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">
            Formato SOAP
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            <strong>S</strong>ubjetivo (motivo) · <strong>O</strong>bjetivo (examen físico) ·{' '}
            <strong>A</strong>nálisis (diagnóstico) · <strong>P</strong>lan (tratamiento)
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoFormatoSOAP;