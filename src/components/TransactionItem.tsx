
import React from 'react';
import { format } from 'date-fns';
import CategoryTag from './CategoryTag';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical, 
  Edit, 
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

const TransactionItem = ({ transaction, onEdit, onDelete }: TransactionItemProps) => {
  const { type, amount, description, category, date } = transaction;
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-xl bg-white dark:bg-card neo-morphism animate-scale-in transition-all duration-300 hover:shadow-md group">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          type === 'income' 
            ? "bg-income/10 text-income" 
            : "bg-expense/10 text-expense"
        )}>
          {type === 'income' 
            ? <ArrowUpRight className="w-5 h-5" /> 
            : <ArrowDownRight className="w-5 h-5" />}
        </div>
        
        <div className="space-y-1">
          <p className="font-medium">{description}</p>
          <div className="flex items-center gap-2">
            <CategoryTag category={category} />
            <span className="text-xs text-muted-foreground">
              {format(date, 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={cn(
          "font-semibold",
          type === 'income' ? "text-income" : "text-expense"
        )}>
          {type === 'income' ? '+' : '-'}₹{amount.toFixed(2)}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit?.(transaction)}>
              <Edit className="w-4 h-4 mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(transaction)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TransactionItem;
