
import React, { useState } from 'react';
import { Transaction, default as TransactionItem } from './TransactionItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TransactionForm from './TransactionForm';
import { useToast } from '@/components/ui/use-toast';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const TransactionList = ({ 
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction
}: TransactionListProps) => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };
  
  const handleDelete = (transaction: Transaction) => {
    onDeleteTransaction(transaction.id);
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been deleted successfully.",
    });
  };
  
  const handleFormSubmit = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      onUpdateTransaction({ ...data, id: editingTransaction.id });
    } else {
      onAddTransaction(data);
    }
    setEditingTransaction(undefined);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>
      
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 border rounded-xl bg-muted/30">
            <p className="text-muted-foreground">No transactions yet</p>
            <Button 
              variant="link" 
              onClick={() => setIsFormOpen(true)}
              className="mt-2"
            >
              Add your first transaction
            </Button>
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      
      <TransactionForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editTransaction={editingTransaction}
      />
    </div>
  );
};

export default TransactionList;
