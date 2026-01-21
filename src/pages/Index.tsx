import React, { useState, useCallback } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { useAgents } from '@/context/AgentContext';
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
  const { 
    cookingState, 
    startOrder, 
    setCookingActive,
    addTimelineEvent,
    orders 
  } = useKitchen();
  const { setAgentStatus, setAgentThinking } = useAgents();
  
  const handleStartOrder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    startOrder(orderId);
    setCookingActive(true);
    
    // Add initial timeline event
    addTimelineEvent({
      type: 'thinking',
      agent: 'chef',
      content: `Starting order: ${order.dishName}. Let me plan the cooking steps...`,
    });
    
    setAgentStatus('chef', 'thinking');
    setAgentThinking('chef', `Planning ${order.dishName}...`);
    
    toast.info(`Started cooking: ${order.dishName}`);
    
    // Demo: simulate cooking (edge functions will handle real logic)
    setTimeout(() => {
      setAgentStatus('chef', 'idle');
      setAgentThinking('chef', undefined);
      setCookingActive(false);
      toast.success('Backend edge functions ready for full cooking loop!');
    }, 2000);
  }, [orders, startOrder, setCookingActive, addTimelineEvent, setAgentStatus, setAgentThinking]);

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
        isCooking={cookingState.isActive} 
      />
      <KitchenStaff 
        onStartOrder={handleStartFromStaff}
        isCooking={cookingState.isActive}
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
