import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { YearlyData } from '../models/YearlyData';
import { SimulationService } from '../services/simulationService';
import './NetWorthChart.scss';

interface NetWorthChartProps {
  data: YearlyData[];
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  if (data.length === 0) {
    return <div className="net-worth-chart empty">No data to display</div>;
  }

  const chartData = data.map((row, index) => ({
    year: index,
    age: row.age1,
    netWorth: Math.round(row.netWorth / 1000),
    inflationAdjusted: Math.round(row.inflationAdjusted / 1000),
  }));

  const formatCurrency = (value: number) => SimulationService.formatCurrency(value);

  return (
    <div className="net-worth-chart">
      <h3>Net Worth Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
          <XAxis
            dataKey="age"
            label={{ value: 'Age', position: 'insideBottom', offset: -5, style: { fill: '#b0b0b0' } }}
            stroke="#b0b0b0"
            tick={{ fill: '#b0b0b0' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            label={{ value: 'Net Worth ($)', angle: -90, position: 'insideLeft', style: { fill: '#b0b0b0' } }}
            stroke="#b0b0b0"
            tick={{ fill: '#b0b0b0' }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Age: ${label}`}
            contentStyle={{
              backgroundColor: '#252525',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              color: '#e0e0e0',
            }}
            labelStyle={{ color: '#e0e0e0' }}
          />
          <Legend
            wrapperStyle={{ color: '#e0e0e0' }}
          />
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="#6366f1"
            strokeWidth={2}
            name="Net Worth"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="inflationAdjusted"
            stroke="#10b981"
            strokeWidth={2}
            name="Inflation Adjusted"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

