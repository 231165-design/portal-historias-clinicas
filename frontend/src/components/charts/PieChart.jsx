// ============================================================
// COMPONENTE: PieChart
// ============================================================

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_COLORS = [
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#3b82f6',
  '#06b6d4',
  '#84cc16',
  '#ef4444',
];

function PieChart({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  title,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 100,
  colors = DEFAULT_COLORS,
}) {
  const { isDark } = useTheme();

  // Colores adaptados al tema
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const bgColor = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const labelLineColor = isDark ? '#6b7280' : '#9ca3af';

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

  // Calcular total para porcentajes
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            label={({ percent }) => {
              const pct = (percent * 100).toFixed(0);
              return pct >= 5 ? `${pct}%` : '';
            }}
            labelLine={{ stroke: labelLineColor }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke={isDark ? '#1f2937' : '#ffffff'}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              fontSize: '12px',
              color: textColor,
            }}
            labelStyle={{ color: textColor, fontWeight: 'bold' }}
            formatter={(value, name) => [
              `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
              name,
            ]}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: textColor }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;