// ============================================================
// COMPONENTE: LineChart
// ============================================================

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

function LineChart({
  data = [],
  dataKey = 'value',
  xKey = 'name',
  color = '#3b82f6',
  height = 300,
  title,
  showLegend = false,
  legendName = 'Valor',
}) {
  const { isDark } = useTheme();

  // Colores adaptados al tema
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#4b5563' : '#e5e7eb';
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const bgColor = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700"
        style={{ height }}
      >
        <p className="text-sm text-gray-400 dark:text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={{ stroke: axisColor }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={{ stroke: axisColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              fontSize: '12px',
              color: textColor,
            }}
            labelStyle={{ color: textColor, fontWeight: 'bold' }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '12px', color: textColor }}
              iconType="circle"
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
            name={legendName}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;