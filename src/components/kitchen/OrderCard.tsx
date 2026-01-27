import React from 'react';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DishIllustration } from './DishIllustration';

interface OrderCardProps {
  order: Order;
  onStart: (orderId: string) => void;
  isDisabled?: boolean;
}

const difficultyConfig = {
  beginner: {
    label: 'BEGINNER',
    className: 'bg-beginner text-beginner-foreground',
  },
  easy: {
    label: 'EASY',
    className: 'bg-easy text-easy-foreground',
  },
  intermediate: {
    label: 'MED',
    className: 'bg-intermediate text-intermediate-foreground',
  },
  hard: {
    label: 'HARD',
    className: 'bg-hard text-hard-foreground',
  },
  expert: {
    label: 'EXPERT',
    className: 'bg-expert text-expert-foreground',
  },
  legendary: {
    label: 'LEGEND',
    className: 'bg-legendary text-legendary-foreground',
  },
};

const getStatusText = (status: Order['status']): string => {
  switch (status) {
    case 'not_started':
      return 'Not started';
    case 'active':
    case 'cooking':
      return 'Cooking...';
    case 'served':
      return 'Served';
    case 'verified':
      return 'Verified';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Not started';
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStart, isDisabled }) => {
  const isActive = order.status === 'active' || order.status === 'cooking';
  const config = difficultyConfig[order.difficulty];
  
  return (
    <div 
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-card p-3 order-card",
        isActive && "ring-2 ring-processing/50"
      )}
    >
      {/* Difficulty Badge */}
      <div className={cn(
        "absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full",
        config.className
      )}>
        {config.label}
      </div>
      
      {/* Attempt indicator */}
      {order.recookCount && order.recookCount > 0 && (
        <div className="absolute top-2 right-2 z-10 text-[10px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
          #{order.recookCount + 1}
        </div>
      )}
      
      {/* Illustration Area */}
      <div className="mt-5 mb-3">
        <DishIllustration 
          dishName={order.dishName} 
        />
      </div>
      
      {/* Dish Name */}
      <h3 className="font-bold text-sm leading-tight text-center line-clamp-2 mb-1">
        {order.dishName}
      </h3>
      
      {/* Status Text */}
      <p className={cn(
        "text-[10px] text-center mb-3",
        isActive ? "text-processing font-medium" : "text-muted-foreground"
      )}>
        {getStatusText(order.status)}
      </p>
      
      {/* Action Button */}
      <div className="mt-auto">
        {isActive ? (
          <div className="h-8" /> 
        ) : (
          <Button
            className="w-full btn-summon text-xs h-9"
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
