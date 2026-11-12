// ============================================================
// PÁGINA: Dashboard
// ============================================================

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import BannerBienvenida from '../../components/dashboard/BannerBienvenida';
import StatsDashboard from '../../components/dashboard/StatsDashboard';
import GraficosDashboard from '../../components/dashboard/GraficosDashboard';
import ActividadDashboard from '../../components/dashboard/ActividadDashboard';
import dashboardService from '../../services/dashboardService';

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: null,
    charts: null,
    actividad: null,
  });

  // ============================================================
  // CARGAR DATOS
  // ============================================================
  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setLoading(true);

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
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner de bienvenida */}
      <BannerBienvenida nombre={user?.nombres} />

      {/* Tarjetas de estadísticas */}
      <StatsDashboard stats={data.stats || {}} />

      {/* Gráficos */}
      <GraficosDashboard charts={data.charts || {}} />

      {/* Actividad y últimas consultas */}
      <ActividadDashboard actividad={data.actividad || {}} />

      {/* Footer */}
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