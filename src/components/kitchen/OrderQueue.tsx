import React, { useState } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { OrderCard } from './OrderCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrderDifficulty } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<OrderDifficulty | 'all'>('all');
  
  // Filter to show only active/pending orders
  const pendingOrders = orders.filter(o => 
    o.status === 'not_started' || o.status === 'active' || o.status === 'cooking'
  );
  
  // Calculate counts per difficulty
  const difficultyCounts = difficultyOrder.reduce((acc, difficulty) => {
    acc[difficulty] = pendingOrders.filter(o => o.difficulty === difficulty).length;
    return acc;
  }, {} as Record<OrderDifficulty, number>);
  
  // Apply filter
  const filteredOrders = selectedDifficulty === 'all' 
    ? pendingOrders 
    : pendingOrders.filter(o => o.difficulty === selectedDifficulty);
  
  // Group filtered orders by difficulty (for 'all' view)
  const groupedOrders = difficultyOrder.reduce((acc, difficulty) => {
    acc[difficulty] = filteredOrders.filter(o => o.difficulty === difficulty);
    return acc;
  }, {} as Record<OrderDifficulty, typeof filteredOrders>);
  
  return (
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated flex flex-col" style={{ maxHeight: '600px' }}>
      {/* Header with Filter and Audio Log button */}
      <div className="flex justify-between items-start mb-4 flex-shrink-0">
        <div className="flex-1">
          <h2 className="font-bold uppercase text-sm tracking-wide">The Orders of the Universe</h2>
          <p className="text-xs text-muted-foreground">
            Showing {filteredOrders.length} of {pendingOrders.length} dishes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={selectedDifficulty} 
            onValueChange={(value) => setSelectedDifficulty(value as OrderDifficulty | 'all')}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs rounded-xl">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              <SelectItem value="all">All Dishes ({pendingOrders.length})</SelectItem>
              {difficultyOrder.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficultyLabels[difficulty]} ({difficultyCounts[difficulty]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-6 pr-2">
          {selectedDifficulty === 'all' ? (
            // Grouped view for "All Dishes"
            difficultyOrder.map(difficulty => {
              const difficultyOrders = groupedOrders[difficulty];
              if (!difficultyOrders || difficultyOrders.length === 0) return null;
              
              return (
                <div key={difficulty}>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-3 text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{
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
            })
          ) : (
            // Flat grid view for specific difficulty filter
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStart={onStartOrder}
                  isDisabled={isCooking}
                />
              ))}
            </div>
          )}
          
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
