import React from 'react';
import { AgentState, AgentType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: AgentState;
  isMain?: boolean;
  onStartOrder?: () => void;
  onOpen?: () => void;
  isCooking?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  isMain, 
  onStartOrder,
  onOpen,
  isCooking 
}) => {
  const statusStyles = {
    idle: 'bg-muted',
    thinking: 'bg-processing/10 border-processing animate-pulse',
    acting: 'bg-gemini/10 border-gemini',
    complete: 'bg-success/10 border-success',
  };

  return (
    <div 
      className={cn(
        "border border-border rounded-lg p-4 bg-card transition-all",
        isMain && "col-span-1 md:col-span-1",
        statusStyles[agent.status]
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{agent.emoji}</span>
        <h3 className="font-bold text-sm">{agent.name}</h3>
      </div>
      
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        {agent.description}
      </p>
      
      {/* Thinking display */}
      {agent.currentThinking && (
        <div className="mb-3 p-2 bg-muted rounded text-xs italic text-muted-foreground">
          {agent.currentThinking}
        </div>
      )}
      
      <div className="flex gap-2">
        {isMain && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 text-xs"
            disabled={isCooking}
            onClick={onStartOrder}
          >
            {isCooking ? 'Cooking...' : 'Start an order'}
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-xs"
          onClick={onOpen}
        >
          <Search className="h-3 w-3" />
          Open
        </Button>
      </div>
    </div>
  );
};
