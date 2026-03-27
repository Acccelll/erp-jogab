import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/shared/lib/utils';

interface LineChartProps {
  data: Array<{ label: string; value: number; secondaryValue?: number }>;
  height?: number;
  format?: 'currency' | 'number';
  label1?: string;
  label2?: string;
}

export function LineChart({ data, height = 300, format = 'number', label1 = 'Previsto', label2 = 'Realizado' }: LineChartProps) {
  const formatValue = (value: number) => {
    if (format === 'currency') return formatCurrency(value);
    return value.toLocaleString('pt-BR');
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            tickFormatter={formatValue}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [formatValue(value)]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 10, paddingBottom: 20 }}
          />
          <Line
            name={label1}
            type="monotone"
            dataKey="value"
            stroke="#006B3F"
            strokeWidth={2}
            dot={{ r: 4, fill: '#006B3F', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
          {data[0]?.secondaryValue !== undefined && (
            <Line
              name={label2}
              type="monotone"
              dataKey="secondaryValue"
              stroke="#D97706"
              strokeWidth={2}
              dot={{ r: 4, fill: '#D97706', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
