
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Transaction } from '../TransactionItem';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7',
  '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#8b5cf6'
];

interface PieChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
  className?: string;
}

interface CategoryData {
  name: string;
  value: number;
}

const PieChart = ({ transactions, type, className }: PieChartProps) => {
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    // Filter by transaction type and calculate totals by category
    transactions.filter(t => t.type === type)
      .forEach(transaction => {
        const { category, amount } = transaction;
        if (categoryTotals[category]) {
          categoryTotals[category] += amount;
        } else {
          categoryTotals[category] = amount;
        }
      });
    
    // Convert to array for chart
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  }, [transactions, type]);
  
  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const percentage = ((value / totalAmount) * 100).toFixed(1);
      
      return (
        <div className="bg-popover p-3 rounded-lg shadow-md border text-sm">
          <p className="font-medium">{name}</p>
          <p>${value.toFixed(2)}</p>
          <p>{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  
  return (
    <div className={className}>
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No {type} data to display</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              animationDuration={1500}
              animationBegin={300}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PieChart;
