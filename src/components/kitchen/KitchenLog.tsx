import React, { useRef, useEffect } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { TimelineEvent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
            A procedural record of cooking activity
          </p>
        </div>
        
        <div ref={scrollRef}>
          <ScrollArea className="h-32">
            {timeline.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground italic">
                Waiting for orders
              </div>
            ) : (
              <div className="space-y-1 pr-4">
                {timeline.map(event => (
                  <p 
                    key={event.id} 
                    className="text-sm text-foreground leading-relaxed animate-slide-in"
                  >
                    {formatLogEntry(event)}
                  </p>
                ))}
                
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
