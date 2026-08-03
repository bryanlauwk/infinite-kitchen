import React, { useState } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { OrderCard } from './OrderCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrderDifficulty } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isFeaturedDish } from '@/data/featured';
import { Search } from 'lucide-react';

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
  const [dishFilter, setDishFilter] = useState<'all' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter to show only active/pending orders
  const pendingOrders = orders.filter(o => 
    o.status === 'not_started' || o.status === 'active' || o.status === 'cooking'
  );
  
  // Calculate counts per difficulty
  const difficultyCounts = difficultyOrder.reduce((acc, difficulty) => {
    acc[difficulty] = pendingOrders.filter(o => o.difficulty === difficulty).length;
    return acc;
  }, {} as Record<OrderDifficulty, number>);
  
  const featuredCount = pendingOrders.filter(order => isFeaturedDish(order.id)).length;

  // Apply filters
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredOrders = pendingOrders.filter(order => {
    const matchesDifficulty = selectedDifficulty === 'all' || order.difficulty === selectedDifficulty;
    const matchesDishFilter = dishFilter === 'all' || isFeaturedDish(order.id);
    const matchesSearch = !normalizedQuery ||
      order.dishName.toLowerCase().includes(normalizedQuery) ||
      order.id.toLowerCase().includes(normalizedQuery) ||
      order.difficulty.toLowerCase().includes(normalizedQuery);

    return matchesDifficulty && matchesDishFilter && matchesSearch;
  });
  
  // Group filtered orders by difficulty (for 'all' view)
  const groupedOrders = difficultyOrder.reduce((acc, difficulty) => {
    acc[difficulty] = filteredOrders.filter(o => o.difficulty === difficulty);
    return acc;
  }, {} as Record<OrderDifficulty, typeof filteredOrders>);
  
  return (
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated flex flex-col" style={{ maxHeight: '600px' }}>
      {/* Header with Filter and Audio Log button */}
      <div className="flex flex-col gap-3 mb-4 flex-shrink-0">
        <div className="flex-1">
          <h2 className="font-bold text-lg">Dish Orders</h2>
          <p className="text-xs text-muted-foreground">
            Showing {filteredOrders.length} of {pendingOrders.length} dishes
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_145px] gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search dishes"
              aria-label="Search dishes"
              className="h-8 rounded-xl pl-8 text-xs"
            />
          </div>
          <Select
            value={dishFilter}
            onValueChange={(value) => setDishFilter(value as 'all' | 'featured')}
          >
            <SelectTrigger className="h-8 text-xs rounded-xl">
              <SelectValue placeholder="Collection" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              <SelectItem value="all">All ({pendingOrders.length})</SelectItem>
              <SelectItem value="featured">This Week ({featuredCount})</SelectItem>
            </SelectContent>
          </Select>
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
      
      <ScrollArea className="flex-1 min-h-0" style={{ contain: 'strict' }}>
        <div className="space-y-6 pr-2" style={{ contain: 'layout style' }}>
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
              No dish orders available.
            </div>
          )}
          {pendingOrders.length > 0 && filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm italic">
              No dishes match those filters.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
