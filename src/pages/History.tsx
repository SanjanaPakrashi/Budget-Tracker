
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import TransactionList from '@/components/TransactionList';
import { useTransactions } from '@/hooks/useTransactions';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All', 'Food', 'Rent', 'Utilities', 'Entertainment', 'Transport', 
  'Shopping', 'Health', 'Salary', 'Investment', 'Other'
];

const History = () => {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);
  
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by search term
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by transaction type
    const matchesType = 
      selectedType === 'all' || 
      transaction.type === selectedType;
    
    // Filter by category
    const matchesCategory = 
      selectedCategory === 'All' || 
      transaction.category === selectedCategory;
    
    // Filter by date
    const matchesDate = 
      !dateRange || 
      format(transaction.date, 'yyyy-MM-dd') === format(dateRange, 'yyyy-MM-dd');
    
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  }).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date (newest first)
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        
        <Card className="neo-morphism">
          <CardHeader>
            <CardTitle>Filter Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange ? format(dateRange, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                  {dateRange && (
                    <div className="p-3 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDateRange(undefined)}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
        
        <Card className="neo-morphism">
          <CardContent className="pt-6">
            <TransactionList
              transactions={filteredTransactions}
              onAddTransaction={addTransaction}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default History;
