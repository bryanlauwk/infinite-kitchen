import React, { useCallback } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { useCookingLoop } from '@/hooks/useCookingLoop';
import { usePreGenerateIllustrations } from '@/hooks/usePreGenerateIllustrations';
import { Header } from '@/components/kitchen/Header';
import { HeroBanner } from '@/components/kitchen/HeroBanner';
import { OrderQueue } from '@/components/kitchen/OrderQueue';
import { IngredientsPanel } from '@/components/kitchen/IngredientsPanel';
import { TechniquesPanel } from '@/components/kitchen/TechniquesPanel';
import { ChefsSection } from '@/components/kitchen/ChefsSection';
import { KitchenLog } from '@/components/kitchen/KitchenLog';
import { DishesArchive } from '@/components/kitchen/DishesArchive';
import { KitchenProvider } from '@/context/KitchenContext';
import { AgentProvider } from '@/context/AgentContext';
import { SoundProvider } from '@/context/SoundContext';
import { IllustrationProvider } from '@/context/IllustrationContext';

const KitchenContent: React.FC = () => {
  const { orders } = useKitchen();
  const { runCookingLoop, isCooking } = useCookingLoop();
  
  // Start pre-generating illustrations on mount
  usePreGenerateIllustrations();

  const handleStartOrder = useCallback((orderId: string) => {
    runCookingLoop(orderId);
  }, [runCookingLoop]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      
      {/* Main Three-Column Layout */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4" style={{ minHeight: '600px' }}>
          {/* Left Column - Ingredients */}
          <div className="lg:h-[600px]">
            <IngredientsPanel />
          </div>
          
          {/* Center Column - Orders */}
          <OrderQueue 
            onStartOrder={handleStartOrder} 
            isCooking={isCooking} 
          />
          
          {/* Right Column - Techniques */}
          <div className="lg:h-[600px]">
            <TechniquesPanel />
          </div>
        </div>
      </div>

      {/* Chefs Section */}
      <ChefsSection />
      
      {/* Kitchen Log */}
      <KitchenLog />
      
      {/* Dishes Archive */}
      <DishesArchive />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <IllustrationProvider>
      <SoundProvider>
        <KitchenProvider>
          <AgentProvider>
            <KitchenContent />
          </AgentProvider>
        </KitchenProvider>
      </SoundProvider>
    </IllustrationProvider>
  );
};

export default Index;
