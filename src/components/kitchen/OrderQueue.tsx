import React from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { OrderCard } from './OrderCard';
import { AddOrderInput } from './AddOrderInput';

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
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="mb-4">
        <h2 className="font-bold uppercase text-sm tracking-wide">The Orders of the Universe</h2>
        <p className="text-xs text-muted-foreground">
          Dishes awaiting their destiny.
        </p>
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
          <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
            No orders yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
};
