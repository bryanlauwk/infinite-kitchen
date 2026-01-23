import React, { useCallback } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { useCookingLoop } from '@/hooks/useCookingLoop';
import { KitchenLayout } from '@/components/kitchen/KitchenLayout';
import { Header } from '@/components/kitchen/Header';
import { HeroBanner } from '@/components/kitchen/HeroBanner';
import { OrderQueue } from '@/components/kitchen/OrderQueue';
import { KitchenStaff } from '@/components/kitchen/KitchenStaff';
import { InventoryPanel } from '@/components/kitchen/InventoryPanel';
import { TimelineLog } from '@/components/kitchen/TimelineLog';
import { KitchenProvider } from '@/context/KitchenContext';
import { AgentProvider } from '@/context/AgentContext';
import { toast } from 'sonner';

const KitchenContent: React.FC = () => {
  const { orders } = useKitchen();
  const { runCookingLoop, isCooking } = useCookingLoop();

  const handleStartOrder = useCallback((orderId: string) => {
    runCookingLoop(orderId);
  }, [runCookingLoop]);

  const handleStartFromStaff = useCallback(() => {
    const pendingOrder = orders.find(o => o.status === 'not_started');
    if (pendingOrder) {
      handleStartOrder(pendingOrder.id);
    } else {
      toast.error('No pending orders available');
    }
  }, [orders, handleStartOrder]);

  return (
    <KitchenLayout>
      <Header />
      <HeroBanner />
      <OrderQueue 
        onStartOrder={handleStartOrder} 
        isCooking={isCooking} 
      />
      <KitchenStaff 
        onStartOrder={handleStartFromStaff}
        isCooking={isCooking}
      />
      <InventoryPanel />
      <TimelineLog />
    </KitchenLayout>
  );
};

const Index: React.FC = () => {
  return (
    <KitchenProvider>
      <AgentProvider>
        <KitchenContent />
      </AgentProvider>
    </KitchenProvider>
  );
};

export default Index;
