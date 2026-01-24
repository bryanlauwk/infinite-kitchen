import React, { useCallback } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { useCookingLoop } from '@/hooks/useCookingLoop';
import { KitchenLayout } from '@/components/kitchen/KitchenLayout';
import { Header } from '@/components/kitchen/Header';
import { HeroBanner } from '@/components/kitchen/HeroBanner';
import { OrderQueue } from '@/components/kitchen/OrderQueue';
import { InventoryPanel } from '@/components/kitchen/InventoryPanel';
import { KitchenLog } from '@/components/kitchen/KitchenLog';
import { DishesArchive } from '@/components/kitchen/DishesArchive';
import { KitchenProvider } from '@/context/KitchenContext';
import { AgentProvider } from '@/context/AgentContext';

const KitchenContent: React.FC = () => {
  const { orders } = useKitchen();
  const { runCookingLoop, isCooking } = useCookingLoop();

  const handleStartOrder = useCallback((orderId: string) => {
    runCookingLoop(orderId);
  }, [runCookingLoop]);

  return (
    <KitchenLayout>
      <Header />
      <HeroBanner />
      <OrderQueue 
        onStartOrder={handleStartOrder} 
        isCooking={isCooking} 
      />
      <InventoryPanel />
      <KitchenLog />
      <DishesArchive />
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
