import React from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { OrderCard } from './OrderCard';
import { AddOrderInput } from './AddOrderInput';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface OrderQueueProps {
  onStartOrder: (orderId: string) => void;
  isCooking: boolean;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({ onStartOrder, isCooking }) => {
  const { orders } = useKitchen();
  
  // Filter to show only active/pending orders
  const pendingOrders = orders.filter(o => 
    o.status === 'not_started' || o.status === 'active' || o.status === 'cooking'
  );
  
  return (
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated">
      {/* Header with Audio Log button */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-bold uppercase text-sm tracking-wide">The Orders of the Universe</h2>
          <p className="text-xs text-muted-foreground">
            Try Factilee Fanefilie θgent.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl">
          <Volume2 className="h-3.5 w-3.5" />
          Audio Log
        </Button>
      </div>
      
      <div className="mb-4">
        <AddOrderInput />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {pendingOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onStart={onStartOrder}
            isDisabled={isCooking}
          />
        ))}
        
        {pendingOrders.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground text-sm italic">
            No orders yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
};
