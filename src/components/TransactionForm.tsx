
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Transaction } from './TransactionItem';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  editTransaction?: Transaction;
}

const CATEGORIES = [
  'Food', 'Rent', 'Utilities', 'Entertainment', 'Transport', 
  'Shopping', 'Health', 'Salary', 'Investment', 'Other'
];

const TransactionForm = ({ isOpen, onClose, onSubmit, editTransaction }: TransactionFormProps) => {
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [date, setDate] = useState<Date>(editTransaction?.date || new Date());
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<Omit<Transaction, 'id'>>({
    defaultValues: editTransaction ? {
      type: editTransaction.type,
      amount: editTransaction.amount,
      description: editTransaction.description,
      category: editTransaction.category,
      date: editTransaction.date
    } : {
      type: 'expense',
      amount: 0,
      description: '',
      category: 'Other',
      date: new Date()
    }
  });
  
  const transactionType = watch('type');
  
  const onFormSubmit = handleSubmit((data) => {
    onSubmit({
      ...data,
      amount: Number(data.amount),
      date
    });
    
    toast({
      title: editTransaction ? "Transaction updated" : "Transaction added",
      description: editTransaction 
        ? "Your transaction has been updated successfully."
        : "Your transaction has been added successfully.",
    });
    
    reset();
    onClose();
  });

  // Function to handle date selection
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details of your transaction below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onFormSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              defaultValue={editTransaction?.type || 'expense'} 
              onValueChange={(value) => setValue('type', value as 'income' | 'expense')}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency.symbol}</span>
              <Input 
                id="amount"
                type="number"
                step="0.01"
                min="0"
                className="pl-7"
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              defaultValue={editTransaction?.category || 'Other'} 
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editTransaction ? 'Update' : 'Add'} Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
