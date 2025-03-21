
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { Transaction } from '../TransactionItem';
import { endOfMonth, format, startOfMonth, eachDayOfInterval } from 'date-fns';

interface BarChartProps {
  transactions: Transaction[];
  className?: string;
}

const BarChart = ({ transactions, className }: BarChartProps) => {
  const currentMonth = new Date();
  
  const chartData = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    // Generate all days in the month
    const daysInMonth = eachDayOfInterval({ start, end });
    
    // Initialize data for each day with zero values
    const initialData = daysInMonth.map(day => ({
      date: format(day, 'dd'),
      fullDate: day,
      income: 0,
      expense: 0
    }));
    
    // Add transaction data to the appropriate day
    transactions.forEach(transaction => {
      const transactionDate = transaction.date;
      const dayOfMonth = format(transactionDate, 'dd');
      
      // Only consider transactions from the current month
      if (transactionDate >= start && transactionDate <= end) {
        const dayData = initialData.find(item => item.date === dayOfMonth);
        if (dayData) {
          if (transaction.type === 'income') {
            dayData.income += transaction.amount;
          } else {
            dayData.expense += transaction.amount;
          }
        }
      }
    });
    
    return initialData;
  }, [transactions, currentMonth]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const fullDate = payload[0]?.payload?.fullDate;
      return (
        <div className="bg-popover p-3 rounded-lg shadow-md border text-sm">
          <p className="font-medium">{fullDate ? format(fullDate, 'MMMM d, yyyy') : label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickFormatter={(value) => `$${value}`} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="income" 
            name="Income" 
            fill="hsl(var(--income))" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
          <Bar 
            dataKey="expense" 
            name="Expense" 
            fill="hsl(var(--expense))" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500} 
            animationBegin={300}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
