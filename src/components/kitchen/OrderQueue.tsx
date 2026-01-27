import React from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { OrderCard } from './OrderCard';
import { AddOrderInput } from './AddOrderInput';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrderDifficulty } from '@/lib/types';

interface OrderQueueProps {
  onStartOrder: (orderId: string) => void;
  isCooking: boolean;
}

const difficultyOrder: OrderDifficulty[] = ['beginner', 'easy', 'intermediate', 'hard', 'expert', 'legendary'];

const difficultyLabels: Record<OrderDifficulty, string> = {
  beginner: 'Beginner',
  easy: 'Easy',
  intermediate: 'Intermediate',
  hard: 'Hard',
  expert: 'Expert',
  legendary: 'Legendary',
};

export const OrderQueue: React.FC<OrderQueueProps> = ({ onStartOrder, isCooking }) => {
  const { orders } = useKitchen();
  
  // Filter to show only active/pending orders
  const pendingOrders = orders.filter(o => 
    o.status === 'not_started' || o.status === 'active' || o.status === 'cooking'
  );
  
  // Group orders by difficulty
  const groupedOrders = difficultyOrder.reduce((acc, difficulty) => {
    acc[difficulty] = pendingOrders.filter(o => o.difficulty === difficulty);
    return acc;
  }, {} as Record<OrderDifficulty, typeof pendingOrders>);
  
  return (
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated flex flex-col" style={{ maxHeight: '600px' }}>
      {/* Header with Audio Log button */}
      <div className="flex justify-between items-start mb-4 flex-shrink-0">
        <div>
          <h2 className="font-bold uppercase text-sm tracking-wide">The Orders of the Universe</h2>
          <p className="text-xs text-muted-foreground">
            64 dishes across 6 difficulty levels.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl">
          <Volume2 className="h-3.5 w-3.5" />
          Audio Log
        </Button>
      </div>
      
      <div className="mb-4 flex-shrink-0">
        <AddOrderInput />
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-6 pr-2">
          {difficultyOrder.map(difficulty => {
            const difficultyOrders = groupedOrders[difficulty];
            if (!difficultyOrders || difficultyOrders.length === 0) return null;
            
            return (
              <div key={difficulty}>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-3 text-muted-foreground flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-${difficulty}`} style={{
                    backgroundColor: `hsl(var(--${difficulty}))`
                  }} />
                  {difficultyLabels[difficulty]} ({difficultyOrders.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {difficultyOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStart={onStartOrder}
                      isDisabled={isCooking}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          
          {pendingOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm italic">
              No orders yet. Add one above.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
