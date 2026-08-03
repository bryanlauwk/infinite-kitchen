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
import { Footer } from '@/components/kitchen/Footer';
import { KitchenProvider } from '@/context/KitchenContext';
import { AgentProvider } from '@/context/AgentContext';
import { SoundProvider } from '@/context/SoundContext';

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
      <div className="px-3 py-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_280px] lg:min-h-[600px]">
          {/* Left Column - Ingredients */}
          <div className="h-[420px] lg:h-[600px]">
            <IngredientsPanel />
          </div>
          
          {/* Center Column - Orders */}
          <OrderQueue 
            onStartOrder={handleStartOrder} 
            isCooking={isCooking} 
          />
          
          {/* Right Column - Techniques */}
          <div className="h-[420px] lg:h-[600px]">
            <TechniquesPanel />
          </div>
        </div>
      </div>

      {/* Chefs & Kitchen Log - Side by Side */}
      <div className="px-3 py-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
          <ChefsSection />
          <KitchenLog />
        </div>
      </div>
      
      {/* Dishes Archive */}
      <DishesArchive />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <SoundProvider>
      <KitchenProvider>
        <AgentProvider>
          <KitchenContent />
        </AgentProvider>
      </KitchenProvider>
    </SoundProvider>
  );
};

export default Index;
