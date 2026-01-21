import React, { useRef, useEffect } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { TimelineEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

const agentEmojis = {
  chef: '👨‍🍳',
  sous: '👨‍🔬',
  expeditor: '👨‍⚖️',
};

const eventStyles = {
  thinking: 'border-muted text-muted-foreground italic',
  action: 'border-gemini bg-gemini/5',
  result: 'border-success bg-success/5',
  serve: 'border-processing bg-processing/5',
  judge: 'border-primary',
  error: 'border-destructive bg-destructive/5',
};

interface TimelineItemProps {
  event: TimelineEvent;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event }) => {
  return (
    <div 
      className={cn(
        "flex-shrink-0 w-64 p-3 border rounded-lg animate-slide-in",
        eventStyles[event.type]
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{agentEmojis[event.agent]}</span>
        <span className="text-xs text-muted-foreground uppercase">
          {event.agent}
        </span>
      </div>
      
      <p className="text-sm leading-relaxed mb-2">
        {event.content}
      </p>
      
      {event.functionCall && (
        <div className="font-mono text-xs bg-muted px-2 py-1 rounded">
          → {event.functionCall.name}([{event.functionCall.ingredients.join(', ')}])
        </div>
      )}
      
      {event.result && (
        <div className="flex items-center gap-2 mt-2 text-sm">
          <span className="text-lg">{event.result.emoji}</span>
          <span className="font-bold">{event.result.resultName}</span>
        </div>
      )}
    </div>
  );
};

export const TimelineLog: React.FC = () => {
  const { timeline, cookingState } = useKitchen();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to latest event
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [timeline]);
  
  return (
    <section className="px-6 py-4">
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="mb-3">
          <h2 className="font-bold uppercase text-sm tracking-wide">Kitchen Log</h2>
          <p className="text-xs text-muted-foreground">
            Chat history showing all cooking actions and results
          </p>
        </div>
        
        <div 
          ref={scrollRef}
          className="min-h-[120px] overflow-x-auto custom-scrollbar"
        >
          {timeline.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-sm text-muted-foreground italic">
              Select ingredients and click an action to start cooking
            </div>
          ) : (
            <div className="flex gap-3 pb-2">
              {timeline.map(event => (
                <TimelineItem key={event.id} event={event} />
              ))}
              
              {/* Typing indicator when cooking */}
              {cookingState.isActive && (
                <div className="flex-shrink-0 w-16 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
