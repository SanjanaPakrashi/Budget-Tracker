
import { useState, useEffect } from 'react';
import { Transaction } from '@/components/TransactionItem';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useTransactions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only load transactions if a user is logged in
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }
    
    // Load user-specific transactions
    const loadTransactions = () => {
      try {
        const storageKey = `transactions_${user.id}`;
        const storedTransactions = localStorage.getItem(storageKey);
        
        if (storedTransactions) {
          // Parse the stored data and convert string dates back to Date objects
          const parsed = JSON.parse(storedTransactions).map((t: any) => ({
            ...t,
            date: new Date(t.date)
          }));
          setTransactions(parsed);
        } else {
          // For new users, start with an empty array
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions. Starting with empty data.",
          variant: "destructive",
        });
        setTransactions([]);
      }
      setIsLoading(false);
    };
    
    loadTransactions();
  }, [toast, user]);
  
  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && user) {
      const storageKey = `transactions_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(transactions));
    }
  }, [transactions, isLoading, user]);
  
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  };
  
  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => 
      prev.filter(transaction => transaction.id !== transactionId)
    );
  };
  
  // Calculate summary statistics
  const summary = {
    totalIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0),
      
    totalExpenses: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0),
      
    balance: transactions.reduce(
      (balance, { type, amount }) => 
        type === 'income' ? balance + amount : balance - amount, 
      0
    ),
    
    transactionCount: transactions.length
  };
  
  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    summary
  };
};
