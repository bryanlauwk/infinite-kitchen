import React, { useRef, useEffect } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { TimelineEvent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

// Check if this is a discovery event
const isDiscoveryEvent = (event: TimelineEvent): boolean => {
  return event.type === 'result' && 
    (event.content.includes('NEW DISCOVERY') || event.result?.isDiscovery === true);
};

// Documentary-style log entry - calm, procedural, one action per line
const formatLogEntry = (event: TimelineEvent): string => {
  switch (event.type) {
    case 'thinking':
      return event.content;
    case 'action':
      if (event.functionCall) {
        const ingredients = event.functionCall.ingredients.join(', ');
        return `${event.functionCall.name}: ${ingredients}`;
      }
      return event.content;
    case 'result':
      if (event.result) {
        return `${event.result.emoji} ${event.result.resultName}`;
      }
      return event.content;
    case 'serve':
      return `Dish served.`;
    case 'judge':
      return event.content.replace(/✅|❌/g, '').trim();
    case 'error':
      return event.content;
    default:
      return event.content;
  }
};

// Discovery indicator - subtle pulse dot (no gamified "NEW" badge per PRD)
const DiscoveryIndicator: React.FC = () => (
  <span className="inline-flex items-center ml-2">
    <span className="w-1.5 h-1.5 rounded-full bg-gemini animate-pulse" />
  </span>
);

export const KitchenLog: React.FC = () => {
  const { timeline, cookingState } = useKitchen();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to latest event
  useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [timeline]);
  
  return (
    <section className="px-6 py-4">
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm tracking-wide">Kitchen Log</h2>
          <p className="text-xs text-muted-foreground">
            What just happened.
          </p>
        </div>
        
        <div ref={scrollRef}>
          <ScrollArea className="h-32">
            {timeline.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground italic">
                Waiting for orders.
              </div>
            ) : (
              <div className="space-y-1 pr-4">
                {timeline.map(event => {
                  const isDiscovery = isDiscoveryEvent(event);
                  return (
                    <p 
                      key={event.id} 
                      className={`text-sm leading-relaxed animate-slide-in ${
                        isDiscovery 
                          ? 'text-gemini font-medium' 
                          : 'text-foreground'
                      }`}
                    >
                      {formatLogEntry(event)}
                      {isDiscovery && <DiscoveryIndicator />}
                    </p>
                  );
                })}
                
                {/* Activity indicator when cooking */}
                {cookingState.isActive && (
                  <p className="text-sm text-muted-foreground italic">
                    ...
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};
