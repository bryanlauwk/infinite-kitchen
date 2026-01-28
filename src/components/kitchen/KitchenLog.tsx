import React, { useRef, useEffect, useState } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { TimelineEvent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
        return `${event.functionCall.name}(${ingredients})`;
      }
      return event.content;
    case 'result':
      if (event.result) {
        return `→ ${event.result.emoji} ${event.result.resultName}`;
      }
      return event.content;
    case 'serve':
      return `◉ Dish served.`;
    case 'judge':
      return event.content.replace(/✅|❌/g, '').trim();
    case 'error':
      return `✗ ${event.content}`;
    default:
      return event.content;
  }
};

// Discovery indicator - subtle pulse dot
const DiscoveryIndicator: React.FC = () => (
  <span className="inline-flex items-center ml-2">
    <span className="w-1.5 h-1.5 rounded-full terminal-text-discovery animate-pulse" style={{ backgroundColor: 'currentColor' }} />
  </span>
);

export const KitchenLog: React.FC = () => {
  const { timeline, cookingState } = useKitchen();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    <div className={`rounded-2xl overflow-hidden border border-border card-elevated flex flex-col transition-all ${isExpanded ? 'h-[500px]' : 'h-full min-h-[200px]'}`}>
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-muted border-b border-border flex-shrink-0">
        <h2 className="font-bold uppercase text-xs tracking-wide">Kitchen Log</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            count: {timeline.length.toString().padStart(4, '0')}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse log" : "Expand log"}
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      
      {/* Terminal body */}
      <div ref={scrollRef} className="terminal-bg flex-1">
        <ScrollArea className="h-full">
            <div className="p-4 font-mono text-sm">
            {timeline.length === 0 ? (
              <div className="terminal-text-muted italic">
                &gt; Waiting for orders...
              </div>
            ) : (
                <div className="space-y-1">
                  {timeline.map(event => {
                    const isDiscovery = isDiscoveryEvent(event);
                    return (
                    <p 
                      key={event.id} 
                      className={`leading-relaxed animate-slide-in ${
                        isDiscovery 
                          ? 'terminal-text-discovery' 
                          : event.type === 'error'
                            ? 'terminal-text-error'
                            : ''
                      }`}
                    >
                      <span className="terminal-text-muted mr-2">&gt;</span>
                      {formatLogEntry(event)}
                      {isDiscovery && <DiscoveryIndicator />}
                    </p>
                    );
                  })}
                  
                  {cookingState.isActive && (
                    <p className="terminal-text-muted">
                      <span className="mr-2">&gt;</span>
                      <span className="typing-dot">.</span>
                      <span className="typing-dot">.</span>
                      <span className="typing-dot">.</span>
                    </p>
                  )}
                </div>
              )}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
};
