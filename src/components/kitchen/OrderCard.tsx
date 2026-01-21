import React from 'react';
import { Order, OrderDifficulty } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onStart: (orderId: string) => void;
  isDisabled?: boolean;
}

const difficultyColors: Record<OrderDifficulty, string> = {
  easy: 'bg-easy text-easy-foreground',
  intermediate: 'bg-intermediate text-intermediate-foreground',
  hard: 'bg-hard text-hard-foreground',
};

const statusLabels: Record<Order['status'], string> = {
  not_started: 'Not started',
  active: 'Active',
  cooking: 'Cooking...',
  served: 'Served',
  verified: 'Verified ✓',
  rejected: 'Rejected ✗',
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStart, isDisabled }) => {
  const isActive = order.status === 'active' || order.status === 'cooking';
  const isComplete = order.status === 'verified' || order.status === 'rejected';
  
  return (
    <div 
      className={cn(
        "flex-shrink-0 w-32 p-3 border border-border rounded-lg bg-card transition-all",
        isActive && "border-processing ring-2 ring-processing/20",
        order.status === 'verified' && "border-success",
        order.status === 'rejected' && "border-destructive"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span 
          className={cn(
            "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
            difficultyColors[order.difficulty]
          )}
        >
          {order.difficulty}
        </span>
        <span className="text-2xl">{order.emoji}</span>
      </div>
      
      <h3 className="font-bold text-sm leading-tight mb-1 truncate">
        {order.dishName}
      </h3>
      
      <p className="text-xs text-muted-foreground mb-3">
        {statusLabels[order.status]}
      </p>
      
      {!isComplete && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs h-7"
          onClick={() => onStart(order.id)}
          disabled={isDisabled || isActive}
        >
          {isActive ? 'Cooking...' : 'Start'}
        </Button>
      )}
      
      {isComplete && (
        <div className={cn(
          "text-xs font-bold text-center py-1 rounded",
          order.status === 'verified' ? "text-success" : "text-destructive"
        )}>
          {order.status === 'verified' ? '✓ Complete' : '✗ Failed'}
        </div>
      )}
    </div>
  );
};
