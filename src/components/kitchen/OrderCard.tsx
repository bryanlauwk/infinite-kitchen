import React from 'react';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onStart: (orderId: string) => void;
  isDisabled?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStart, isDisabled }) => {
  const isActive = order.status === 'active' || order.status === 'cooking';
  const isComplete = order.status === 'verified' || order.status === 'rejected' || order.status === 'served';
  
  return (
    <div 
      className={cn(
        "flex-shrink-0 w-32 p-3 border border-border rounded-lg bg-card transition-all",
        isActive && "border-processing ring-2 ring-processing/20"
      )}
    >
      <div className="flex items-center justify-center mb-2">
        <span className="text-3xl">{order.emoji}</span>
      </div>
      
      <h3 className="font-bold text-sm leading-tight mb-3 text-center truncate">
        {order.dishName}
      </h3>
      
      {!isComplete && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs h-7"
          onClick={() => onStart(order.id)}
          disabled={isDisabled || isActive}
        >
          {isActive ? '...' : 'Cook'}
        </Button>
      )}
      
      {isComplete && (
        <div className="text-xs text-center py-1 text-muted-foreground">
          Served
        </div>
      )}
    </div>
  );
};
