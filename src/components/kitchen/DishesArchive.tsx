import React from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { renderStars } from '@/lib/reviewGenerator';
import { cn } from '@/lib/utils';

export const DishesArchive: React.FC = () => {
  const { orders } = useKitchen();
  
  // Only show served/verified/rejected dishes
  const completedDishes = orders.filter(
    order => order.status === 'served' || order.status === 'verified' || order.status === 'rejected'
  );
  
  if (completedDishes.length === 0) {
    return null; // Don't show until first dish is completed
  }
  
  return (
    <section className="px-6 py-4">
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-bold uppercase text-sm tracking-wide">Dishes Served</h2>
          <p className="text-xs text-muted-foreground">
            They left the kitchen.
          </p>
        </div>
        
        {/* Dishes list */}
        <div className="divide-y divide-border">
          {completedDishes.map((dish, index) => (
            <div 
              key={dish.id}
              className={cn(
                "p-4 transition-all",
                index === 0 && "animate-slide-in"
              )}
            >
              {/* Dish info row */}
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl flex-shrink-0">{dish.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-tight">
                    {dish.servedDish || dish.dishName}
                  </h3>
                  {dish.servedDish && dish.servedDish !== dish.dishName && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      (ordered as: {dish.dishName})
                    </p>
                  )}
                </div>
              </div>
              
              {/* Review block - delayed feel */}
              {dish.review && (
                <div className="ml-9 mt-3 p-3 bg-secondary/50 rounded-md border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-sm tracking-wider"
                      aria-label={`${dish.review.stars} out of 5 stars`}
                    >
                      {renderStars(dish.review.stars)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 italic leading-relaxed">
                    "{dish.review.comment}"
                  </p>
                </div>
              )}
              
              {/* Waiting for review indicator */}
              {!dish.review && dish.status !== 'rejected' && (
                <div className="ml-9 mt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50 animate-pulse" />
                    awaiting feedback
                  </span>
                </div>
              )}
              
              {/* Rejected dishes don't get reviews */}
              {dish.status === 'rejected' && !dish.review && (
                <div className="ml-9 mt-2 text-xs text-muted-foreground">
                  <span className="opacity-60">Something felt off.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
