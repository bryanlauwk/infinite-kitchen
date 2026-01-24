import React from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm tracking-wide">Dishes Cooked</h2>
          <p className="text-xs text-muted-foreground">
            A record of what has been prepared
          </p>
        </div>
        
        <ScrollArea className="max-h-48">
          <div className="space-y-3">
            {completedDishes.map((dish) => (
              <div 
                key={dish.id}
                className="border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{dish.emoji}</span>
                  <span className="font-medium text-sm">{dish.dishName}</span>
                </div>
                {dish.servedDish && dish.servedDish !== dish.dishName && (
                  <p className="text-xs text-muted-foreground ml-7">
                    Served as: {dish.servedDish}
                  </p>
                )}
                {dish.judgeResult && (
                  <p className="text-xs text-muted-foreground ml-7 italic">
                    {dish.judgeResult.reasoning}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
};
