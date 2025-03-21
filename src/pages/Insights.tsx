
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag
} from 'lucide-react';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import CategoryTag from '@/components/CategoryTag';
import { useTransactions } from '@/hooks/useTransactions';

const Insights = () => {
  const { transactions, summary } = useTransactions();
  const [currentView, setCurrentView] = useState('overview');
  
  // Calculate top categories
  const getTopCategories = (type: 'income' | 'expense') => {
    const categoryTotals: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === type)
      .forEach(transaction => {
        const { category, amount } = transaction;
        if (categoryTotals[category]) {
          categoryTotals[category] += amount;
        } else {
          categoryTotals[category] = amount;
        }
      });
    
    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));
  };
  
  const topExpenseCategories = getTopCategories('expense');
  const topIncomeCategories = getTopCategories('income');
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Financial Insights</h1>
        
        <Tabs defaultValue="overview" onValueChange={setCurrentView}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-slide-up space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="neo-morphism card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-income" />
                    Income vs Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    transactions={transactions} 
                    className="h-56" 
                  />
                </CardContent>
              </Card>
              
              <Card className="neo-morphism card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                      <span className="text-sm font-medium">Total Income</span>
                      <span className="text-income font-semibold">${summary.totalIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                      <span className="text-sm font-medium">Total Expenses</span>
                      <span className="text-expense font-semibold">${summary.totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                      <span className="text-sm font-medium">Net Balance</span>
                      <span className={`font-semibold ${summary.balance >= 0 ? 'text-income' : 'text-expense'}`}>
                        ${summary.balance.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                      <span className="text-sm font-medium">Savings Rate</span>
                      <span className="font-semibold">
                        {summary.totalIncome > 0 
                          ? `${((summary.balance / summary.totalIncome) * 100).toFixed(1)}%` 
                          : '0%'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses" className="animate-slide-up space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="neo-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="w-5 h-5 mr-2 text-expense" />
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart 
                    transactions={transactions} 
                    type="expense" 
                  />
                </CardContent>
              </Card>
              
              <Card className="neo-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2 text-expense" />
                    Top Expense Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topExpenseCategories.length > 0 ? (
                    <div className="space-y-3">
                      {topExpenseCategories.map(({ category, amount }) => (
                        <div 
                          key={category} 
                          className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-expense" />
                            <CategoryTag category={category} />
                          </div>
                          <span className="font-semibold text-expense">
                            -${amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-56 flex items-center justify-center bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">No expense data to display</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="income" className="animate-slide-up space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="neo-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="w-5 h-5 mr-2 text-income" />
                    Income Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart 
                    transactions={transactions} 
                    type="income" 
                  />
                </CardContent>
              </Card>
              
              <Card className="neo-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-income" />
                    Top Income Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topIncomeCategories.length > 0 ? (
                    <div className="space-y-3">
                      {topIncomeCategories.map(({ category, amount }) => (
                        <div 
                          key={category} 
                          className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-income" />
                            <CategoryTag category={category} />
                          </div>
                          <span className="font-semibold text-income">
                            +${amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-56 flex items-center justify-center bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">No income data to display</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Insights;
