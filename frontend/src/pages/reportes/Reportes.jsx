// ============================================================
// PÁGINA: Reportes
// ============================================================

import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { toast } from 'react-hot-toast';

// Mock data para gráficos
const MOCK_ATENCIONES = [
  { dia: 'Lun', atenciones: 12 },
  { dia: 'Mar', atenciones: 18 },
  { dia: 'Mié', atenciones: 15 },
  { dia: 'Jue', atenciones: 22 },
  { dia: 'Vie', atenciones: 25 },
  { dia: 'Sáb', atenciones: 10 },
  { dia: 'Dom', atenciones: 3 },
];

const MOCK_MORBILIDAD = [
  { diagnostico: 'Respiratorias', cantidad: 45 },
  { diagnostico: 'Digestivas', cantidad: 30 },
  { diagnostico: 'Cardiovasculares', cantidad: 20 },
  { diagnostico: 'Musculoesqueléticas', cantidad: 15 },
  { diagnostico: 'Otras', cantidad: 10 },
];

const MOCK_SEGURO = [
  { name: 'SIS', value: 60 },
  { name: 'ESSALUD', value: 25 },
  { name: 'Privado', value: 10 },
  { name: 'Ninguno', value: 5 },
];

const MOCK_EDAD = [
  { rango: '0-5', cantidad: 8 },
  { rango: '6-17', cantidad: 15 },
  { rango: '18-29', cantidad: 25 },
  { rango: '30-59', cantidad: 30 },
  { rango: '60+', cantidad: 12 },
];

function Reportes() {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [tipoReporte, setTipoReporte] = useState('atenciones');

  const handleExportarPDF = () => {
    toast.info('Generando PDF... (función en desarrollo)');
  };

  const handleExportarExcel = () => {
    toast.info('Generando Excel... (función en desarrollo)');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">📊 Reportes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Análisis y estadísticas del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportarExcel}>
            📥 Exportar Excel
          </Button>
          <Button variant="primary" onClick={handleExportarPDF}>
            📄 Exportar PDF
          </Button>
        </div>
      </div>

      {/* FILTROS */}
      <Card padding="md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Tipo de reporte"
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            options={[
              { value: 'atenciones', label: 'Atenciones' },
              { value: 'morbilidad', label: 'Morbilidad' },
              { value: 'vacunacion', label: 'Vacunación' },
              { value: 'pacientes', label: 'Pacientes' },
            ]}
          />
          <Input
            label="Desde"
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          <Input
            label="Hasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
          <div className="flex items-end">
            <Button variant="primary" fullWidth onClick={() => toast.success('Filtros aplicados')}>
              Aplicar filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="📈 Atenciones por día" padding="lg">
          <LineChart
            data={MOCK_ATENCIONES}
            dataKey="atenciones"
            xKey="dia"
            color="#3b82f6"
            height={280}
            showLegend
            legendName="Atenciones"
          />
        </Card>

        <Card title="🏥 Morbilidad por diagnóstico" padding="lg">
          <BarChart
            data={MOCK_MORBILIDAD}
            dataKey="cantidad"
            xKey="diagnostico"
            height={280}
            multicolor
            horizontal
          />
        </Card>

        <Card title="💳 Distribución por tipo de seguro" padding="lg">
          <PieChart
            data={MOCK_SEGURO}
            dataKey="value"
            nameKey="name"
            height={280}
            innerRadius={60}
          />
        </Card>

        <Card title="👥 Distribución por edad" padding="lg">
          <BarChart
            data={MOCK_EDAD}
            dataKey="cantidad"
            xKey="rango"
            color="#10b981"
            height={280}
            multicolor
          />
        </Card>
      </div>

      {/* INFO EXTRA */}
      <Card padding="lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-gray-800 mb-1">Sobre los reportes</h4>
            <p className="text-sm text-gray-600">
              Los datos mostrados son de ejemplo. Una vez conectados al backend, los reportes
              se generarán en tiempo real desde la base de datos, permitiendo filtrar por fecha,
              médico, diagnóstico, etc.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Reportes;