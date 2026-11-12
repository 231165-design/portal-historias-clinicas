// ============================================================
// PÁGINA: Dashboard (Profesional con datos reales)
// ============================================================

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { ROLES_LABELS } from '../../utils/constants';
import dashboardService from '../../services/dashboardService';
import { formatDateTime, formatDate } from '../../utils/formatters';

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: null,
    charts: null,
    actividad: null,
  });

  // ============================================================
  // CARGAR DATOS DEL DASHBOARD
  // ============================================================
  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setLoading(true);

        // Cargar todo en paralelo
        const [stats, charts, actividad] = await Promise.allSettled([
          dashboardService.getStats(),
          dashboardService.getCharts(),
          dashboardService.getActividad(),
        ]);

        setData({
          stats: stats.status === 'fulfilled' ? stats.value : null,
          charts: charts.status === 'fulfilled' ? charts.value : null,
          actividad: actividad.status === 'fulfilled' ? actividad.value : null,
        });
      } catch (error) {
        toast.error('Error al cargar el dashboard');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
  }, []);

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  // ============================================================
  // DATOS PARA TARJETAS
  // ============================================================
  const stats = data.stats || {};
  const charts = data.charts || {};
  const actividad = data.actividad || {};

  const tarjetas = [
    {
      label: 'Total Pacientes',
      value: stats.totalPacientes || 0,
      variacion: stats.pacientesVariacion,
      icon: '👥',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Consultas Hoy',
      value: stats.consultasHoy || 0,
      variacion: stats.consultasVariacion,
      icon: '🩺',
      color: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Citas Pendientes',
      value: stats.citasPendientes || 0,
      icon: '📅',
      color: 'bg-amber-500',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Stock Bajo',
      value: stats.stockBajo || 0,
      icon: '💊',
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      alerta: stats.stockBajo > 0,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ============================================================ */}
      {/* BANNER DE BIENVENIDA */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700 dark:from-primary-800 dark:via-blue-900 dark:to-purple-900 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              🏥
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold">
                ¡Bienvenido, {user?.nombres}!
              </h1>
              <p className="text-sm text-white/80 mt-1">
                {new Date().toLocaleDateString('es-PE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <p className="text-sm text-white/90 max-w-2xl">
            Sistema de Historias Clínicas y Gestión de Postas de Salud.
            <span className="ml-2 inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistema en línea
            </span>
          </p>
        </div>
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
      </div>

      {/* ============================================================ */}
      {/* TARJETAS DE ESTADÍSTICAS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map((tarjeta) => (
          <Card key={tarjeta.label} padding="md" hover>
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tarjeta.gradient} flex items-center justify-center text-2xl text-white shadow-md`}
              >
                {tarjeta.icon}
              </div>
              {tarjeta.variacion !== undefined && (
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    tarjeta.variacion >= 0
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {tarjeta.variacion >= 0 ? '↑' : '↓'} {Math.abs(tarjeta.variacion)}%
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {tarjeta.label}
            </p>
            <p className="text-3xl font-extrabold text-gray-800 dark:text-white mt-1">
              {tarjeta.value}
            </p>
            {tarjeta.alerta && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">
                ⚠ Requiere atención
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* ============================================================ */}
      {/* GRÁFICOS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO: CONSULTAS POR MES (ocupa 2 columnas) */}
        <div className="lg:col-span-2">
          <Card
            title="Consultas por Mes"
            subtitle="Últimos 6 meses"
            padding="lg"
          >
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

        {/* GRÁFICO: DISTRIBUCIÓN POR DIAGNÓSTICO */}
        <div>
          <Card
            title="Distribución por Diagnóstico"
            subtitle="Top 5 CIE-10"
            padding="lg"
          >
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

      {/* SEGUNDA FILA DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO: CONSULTAS POR DÍA */}
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

        {/* GRÁFICO: DISTRIBUCIÓN POR EDAD */}
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

      {/* ============================================================ */}
      {/* ÚLTIMAS CONSULTAS Y ACTIVIDAD */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABLA: ÚLTIMAS CONSULTAS (2 columnas) */}
        <div className="lg:col-span-2">
          <Card
            title="Últimas Consultas"
            subtitle="Registros recientes"
            padding="lg"
            action={
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                Ver todas →
              </button>
            }
          >
            {actividad.ultimasConsultas && actividad.ultimasConsultas.length > 0 ? (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Fecha
                      </th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Paciente
                      </th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Diagnóstico
                      </th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {actividad.ultimasConsultas.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="py-2.5 px-2 text-gray-600 dark:text-gray-300 text-xs">
                          {formatDate(c.fecha_hora)}
                        </td>
                        <td className="py-2.5 px-2 font-semibold text-gray-800 dark:text-white text-xs">
                          {c.paciente?.nombres} {c.paciente?.apellidos}
                        </td>
                        <td className="py-2.5 px-2 text-gray-600 dark:text-gray-300 text-xs">
                          {c.cie10_principal || '—'} {c.diagnostico_principal?.substring(0, 30)}
                          {c.diagnostico_principal?.length > 30 ? '...' : ''}
                        </td>
                        <td className="py-2.5 px-2">
                          <Badge
                            variant={c.estado === 'Completada' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {c.estado}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No hay consultas registradas aún
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* TIMELINE: ACTIVIDAD RECIENTE */}
        <div>
          <Card
            title="Actividad Reciente"
            subtitle="Últimos movimientos"
            padding="lg"
            action={
              <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                Ver más
              </button>
            }
          >
            {actividad.actividadReciente && actividad.actividadReciente.length > 0 ? (
              <div className="space-y-4">
                {actividad.actividadReciente.map((item, index) => (
                  <div key={item.id} className="flex gap-3">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                          item.color === 'green'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : item.color === 'blue'
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        {item.icono}
                      </div>
                      {index < actividad.actividadReciente.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-1"></div>
                      )}
                    </div>
                    {/* Contenido */}
                    <div className="flex-1 pb-2">
                      <p className="text-xs font-semibold text-gray-800 dark:text-white">
                        {item.titulo}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {item.descripcion}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                        {formatDateTime(item.fecha)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No hay actividad reciente
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <div className="text-center py-4 text-xs text-gray-400 dark:text-gray-500">
        <p>
          HIS Postas v1.0.0 · Sistema de Gestión en Salud ·{' '}
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            🟢 Conexión segura
          </span>
        </p>
      </div>
    </div>
  );
}

export default Dashboard;