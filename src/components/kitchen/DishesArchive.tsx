import React, { useState } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { renderStars, getCustomerAvatarForDish } from '@/lib/reviewGenerator';
import { cn } from '@/lib/utils';
import { DishIllustration } from './DishIllustration';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { RecookDialog } from './RecookDialog';
import { Order } from '@/lib/types';

export const DishesArchive: React.FC = () => {
  const { orders, recookOrder } = useKitchen();
  const [dialogOrder, setDialogOrder] = useState<Order | null>(null);
  const [isImprovement, setIsImprovement] = useState(false);
  
  // Only show served/verified/rejected dishes
  const completedDishes = orders.filter(
    order => order.status === 'served' || order.status === 'verified' || order.status === 'rejected'
  );
  
  const handleRecookClick = (order: Order, improvement: boolean = false) => {
    setDialogOrder(order);
    setIsImprovement(improvement);
  };

  const handleRecook = (feedback?: string) => {
    if (!dialogOrder) return;
    
    recookOrder(dialogOrder.id, feedback);
    toast({
      title: feedback ? "Dish returned with feedback" : "Dish returned to orders",
      description: `${dialogOrder.dishName} is ready for attempt #${(dialogOrder.recookCount || 0) + 2}`,
    });
    setDialogOrder(null);
  };
  
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
          {completedDishes.map((dish, index) => {
            const customerAvatar = dish.review ? getCustomerAvatarForDish(dish.id) : null;
            
            return (
              <div 
                key={dish.id}
                className={cn(
                  "p-4 transition-all",
                  index === 0 && "animate-slide-in"
                )}
              >
                {/* Dish info row */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden">
                    <DishIllustration 
                      dishName={dish.servedDish || dish.dishName}
                      className="w-full h-full"
                    />
                  </div>
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
                
                {/* Review block with customer avatar */}
                {dish.review && customerAvatar && (
                  <div className="mt-3 p-3 bg-secondary/50 rounded-md border border-border/50">
                    <div className="flex items-start gap-3">
                      {/* Customer Avatar */}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm"
                        style={{ backgroundColor: customerAvatar.color }}
                      >
                        {customerAvatar.initials}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Customer name and stars */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-foreground/80">
                            {customerAvatar.name}
                          </span>
                          <span 
                            className="text-sm tracking-wider text-processing"
                            aria-label={`${dish.review.stars} out of 5 stars`}
                          >
                            {renderStars(dish.review.stars)}
                          </span>
                        </div>
                        
                        {/* Review comment */}
                        <p className="text-sm text-foreground/70 italic leading-relaxed">
                          "{dish.review.comment}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Waiting for review indicator */}
                {!dish.review && dish.status !== 'rejected' && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50 animate-pulse" />
                      awaiting feedback
                    </span>
                  </div>
                )}
                
                {/* Rejected dishes - show recook option */}
                {dish.status === 'rejected' && !dish.review && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground opacity-60">
                      Something felt off.
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => handleRecookClick(dish, false)}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Try Again
                    </Button>
                  </div>
                )}

                {/* Low-confidence verified dishes - show improvement option */}
                {dish.status === 'verified' && dish.improvable && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground opacity-60">
                      Could be better.
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs text-processing hover:text-processing"
                      onClick={() => handleRecookClick(dish, true)}
                    >
                      <Sparkles className="h-3 w-3" />
                      Request Improvement
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recook Dialog */}
      {dialogOrder && (
        <RecookDialog
          order={dialogOrder}
          open={!!dialogOrder}
          onOpenChange={(open) => !open && setDialogOrder(null)}
          onRecook={handleRecook}
          isImprovement={isImprovement}
        />
      )}
    </section>
  );
};
