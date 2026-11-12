// ============================================================
// COMPONENTE: DetalleTabSignos
// ============================================================

function SignoCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
        {label}
      </p>
      <p className="text-lg font-extrabold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}

function DetalleTabSignos({ signosVitales }) {
  if (!signosVitales) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-2">
          Sin signos vitales registrados
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Esta consulta no tiene signos vitales registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <SignoCard
        icon="🌡️"
        label="Temperatura"
        value={signosVitales.temperatura ? `${signosVitales.temperatura} °C` : '—'}
      />
      <SignoCard
        icon="🩸"
        label="Presión Arterial"
        value={
          signosVitales.presion_sistolica && signosVitales.presion_diastolica
            ? `${signosVitales.presion_sistolica}/${signosVitales.presion_diastolica}`
            : '—'
        }
      />
      <SignoCard
        icon="❤️"
        label="Frec. Cardíaca"
        value={
          signosVitales.frecuencia_cardiaca
            ? `${signosVitales.frecuencia_cardiaca} lpm`
            : '—'
        }
      />
      <SignoCard
        icon="🫁"
        label="Frec. Respiratoria"
        value={
          signosVitales.frecuencia_respiratoria
            ? `${signosVitales.frecuencia_respiratoria} rpm`
            : '—'
        }
      />
      <SignoCard
        icon="🫧"
        label="Saturación O₂"
        value={
          signosVitales.saturacion_oxigeno
            ? `${signosVitales.saturacion_oxigeno}%`
            : '—'
        }
      />
      <SignoCard
        icon="⚖️"
        label="Peso"
        value={signosVitales.peso ? `${signosVitales.peso} kg` : '—'}
      />
      <SignoCard
        icon="📏"
        label="Talla"
        value={signosVitales.talla ? `${signosVitales.talla} cm` : '—'}
      />
      <SignoCard
        icon="📊"
        label="IMC"
        value={signosVitales.imc ? `${signosVitales.imc}` : '—'}
      />
      <SignoCard
        icon="🩸"
        label="Glucosa"
        value={signosVitales.glucosa ? `${signosVitales.glucosa} mg/dL` : '—'}
      />
    </div>
  );
}

export default DetalleTabSignos;