// ============================================================
// COMPONENTE: GraficosDashboard
// ============================================================

import Card from '../ui/Card';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';

function GraficosDashboard({ charts = {} }) {
  return (
    <>
      {/* Primera fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultas por Mes */}
        <div className="lg:col-span-2">
          <Card title="Consultas por Mes" subtitle="Últimos 6 meses" padding="lg">
            <LineChart
              data={charts.consultasPorMes || []}
              dataKey="cantidad"
              xKey="mes"
              color="#3b82f6"
              height={300}
              showLegend
              legendName="Consultas"
            />
          </Card>
        </div>

        {/* Distribución por Diagnóstico */}
        <div>
          <Card title="Distribución por Diagnóstico" subtitle="Top 5 CIE-10" padding="lg">
            {charts.distribucionDiagnosticos && charts.distribucionDiagnosticos.length > 0 ? (
              <PieChart
                data={charts.distribucionDiagnosticos.map((d) => ({
                  name: d.nombre,
                  value: d.cantidad,
                  color: d.color,
                }))}
                dataKey="value"
                nameKey="name"
                height={300}
                innerRadius={60}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p className="text-sm">No hay datos disponibles</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultas por Día */}
        <Card title="Consultas por Día" subtitle="Últimos 7 días" padding="lg">
          <BarChart
            data={charts.consultasPorDia || []}
            dataKey="cantidad"
            xKey="dia"
            color="#10b981"
            height={280}
            multicolor
          />
        </Card>

        {/* Distribución por Edad */}
        <Card title="Distribución por Edad" subtitle="Pacientes por rango etario" padding="lg">
          <BarChart
            data={charts.distribucionEdad || []}
            dataKey="cantidad"
            xKey="rango"
            color="#8b5cf6"
            height={280}
            multicolor
            horizontal
          />
        </Card>
      </div>
    </>
  );
}

export default GraficosDashboard;