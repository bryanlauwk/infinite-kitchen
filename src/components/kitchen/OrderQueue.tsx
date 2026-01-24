import React, { useRef } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { OrderCard } from './OrderCard';
import { AddOrderInput } from './AddOrderInput';

interface OrderQueueProps {
  onStartOrder: (orderId: string) => void;
  isCooking: boolean;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({ onStartOrder, isCooking }) => {
  const { orders } = useKitchen();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="px-6 py-4">
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm tracking-wide">Orders</h2>
          <p className="text-xs text-muted-foreground">
            Order any dish — the kitchen figures out the rest
          </p>
        </div>
        
        <div className="mb-4">
          <AddOrderInput />
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto custom-scrollbar pb-2"
        >
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStart={onStartOrder}
              isDisabled={isCooking}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
