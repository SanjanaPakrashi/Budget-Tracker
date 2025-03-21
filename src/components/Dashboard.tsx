
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  IndianRupee, 
  ArrowDownRight, 
  ArrowUpRight, 
  CreditCard,
  TrendingUp 
} from 'lucide-react';
import TransactionList from './TransactionList';
import BarChart from './charts/BarChart';
import { useTransactions } from '@/hooks/useTransactions';
import { useCurrency } from '@/hooks/useCurrency';

const Dashboard = () => {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    summary 
  } = useTransactions();
  
  const { currency } = useCurrency();
  const { totalIncome, totalExpenses, balance, transactionCount } = summary;
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="neo-morphism card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <IndianRupee className="text-muted-foreground w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency.symbol}{balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {balance >= 0 
                ? "You're doing great!"
                : "You're spending more than you earn"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="neo-morphism card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <ArrowUpRight className="text-income w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">{currency.symbol}{totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total incoming funds
            </p>
          </CardContent>
        </Card>
        
        <Card className="neo-morphism card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <ArrowDownRight className="text-expense w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">{currency.symbol}{totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total outgoing funds
            </p>
          </CardContent>
        </Card>
        
        <Card className="neo-morphism card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="text-muted-foreground w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionCount}</div>
            <p className="text-xs text-muted-foreground">
              Total number of transactions
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Card className="neo-morphism">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Monthly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart transactions={transactions} />
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card className="neo-morphism">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList 
            transactions={recentTransactions}
            onAddTransaction={addTransaction}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
