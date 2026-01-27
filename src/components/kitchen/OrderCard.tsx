import React from 'react';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onStart: (orderId: string) => void;
  isDisabled?: boolean;
}

const difficultyConfig = {
  easy: {
    label: 'EASY',
    className: 'bg-easy text-easy-foreground',
    cardClass: 'order-card-easy',
  },
  intermediate: {
    label: 'MED',
    className: 'bg-intermediate text-intermediate-foreground',
    cardClass: 'order-card-intermediate',
  },
  hard: {
    label: 'HARD',
    className: 'bg-hard text-hard-foreground',
    cardClass: 'order-card-hard',
  },
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStart, isDisabled }) => {
  const isActive = order.status === 'active' || order.status === 'cooking';
  const config = difficultyConfig[order.difficulty];
  
  return (
    <div 
      className={cn(
        "relative flex flex-col rounded-xl border border-border p-3 transition-all",
        config.cardClass,
        isActive && "ring-2 ring-processing/50"
      )}
    >
      {/* Difficulty Badge */}
      <div className={cn(
        "absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded",
        config.className
      )}>
        {config.label}
      </div>
      
      {/* Attempt indicator */}
      {order.recookCount && order.recookCount > 0 && (
        <div className="absolute top-2 right-2 text-[10px] text-muted-foreground">
          #{order.recookCount + 1}
        </div>
      )}
      
      {/* Emoji Display */}
      <div className="flex items-center justify-center py-4 mt-2">
        <span className="text-4xl">{order.emoji}</span>
      </div>
      
      {/* Dish Name */}
      <h3 className="font-bold text-sm leading-tight mb-3 text-center line-clamp-2">
        {order.dishName}
      </h3>
      
      {/* Status / Action */}
      <div className="mt-auto">
        {isActive ? (
          <div className="text-xs text-center py-2 text-processing font-medium">
            Cooking...
          </div>
        ) : (
          <Button
            className="w-full btn-summon text-xs h-8"
            onClick={() => onStart(order.id)}
            disabled={isDisabled}
          >
            Summon
          </Button>
        )}
      </div>
    </div>
  );
};
