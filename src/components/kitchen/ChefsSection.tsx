import React, { useState } from 'react';
import { useAgents } from '@/context/AgentContext';
import { AgentType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChefAvatar } from './ChefAvatar';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const chefProfiles: Record<AgentType, { 
  title: string; 
  quirk: string; 
  gradientClass: string;
}> = {
  chef: {
    title: 'Chef de Cuisine',
    quirk: 'Analyzes orders and orchestrates cooking actions.',
    gradientClass: 'agent-gradient-alchemist',
  },
  sous: {
    title: 'Sous Chef',
    quirk: 'Determines transformation outcomes for each action.',
    gradientClass: 'agent-gradient-transmuter',
  },
  expeditor: {
    title: 'Expeditor',
    quirk: 'Validates served dishes against customer orders.',
    gradientClass: 'agent-gradient-oracle',
  },
};

// Compact view row component
const CompactChefRow: React.FC<{
  type: AgentType;
  agent: { status: string; currentThinking?: string };
  profile: { title: string; gradientClass: string };
}> = ({ type, agent, profile }) => {
  const isActive = agent.status === 'thinking' || agent.status === 'acting';
  
  return (
    <div className={cn(
      "flex items-center gap-3 p-2 rounded-xl border transition-all",
      profile.gradientClass,
      isActive && "ring-2 ring-processing/40"
    )}>
      <div className="relative flex-shrink-0">
        <ChefAvatar agentType={type} isActive={isActive} className="w-10 h-10" />
        {isActive && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-processing rounded-full animate-pulse border-2 border-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium">{profile.title}</span>
        {isActive && agent.currentThinking ? (
          <p className="text-[10px] text-processing truncate">{agent.currentThinking}</p>
        ) : (
          <p className="text-[10px] text-muted-foreground/60 italic">Idle</p>
        )}
      </div>
    </div>
  );
};

export const ChefsSection: React.FC = () => {
  const { agents } = useAgents();
  const [isCompact, setIsCompact] = useState(false);
  const agentOrder: AgentType[] = ['chef', 'sous', 'expeditor'];
  
  return (
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated h-full flex flex-col">
      <div className="mb-3 flex-shrink-0 flex items-center justify-between">
        <div>
          <h2 className="font-bold uppercase text-sm tracking-wide">The Chefs of Reality</h2>
          <p className="text-xs text-muted-foreground">
            Three function callers, one purpose.
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => setIsCompact(!isCompact)}
          title={isCompact ? "Expand view" : "Compact view"}
        >
          {isCompact ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      
      {isCompact ? (
        // Compact view - horizontal list
        <div className="flex-1 flex flex-col gap-2">
          {agentOrder.map(type => (
            <CompactChefRow
              key={type}
              type={type}
              agent={agents[type]}
              profile={chefProfiles[type]}
            />
          ))}
        </div>
      ) : (
        // Full view - vertical cards
        <div className="flex-1 grid grid-cols-1 gap-3">
          {agentOrder.map(type => {
            const agent = agents[type];
            const profile = chefProfiles[type];
            const isActive = agent.status === 'thinking' || agent.status === 'acting';
            
            return (
              <div 
                key={type}
                className={cn(
                  "rounded-2xl p-4 border transition-all card-elevated",
                  profile.gradientClass,
                  isActive && "ring-2 ring-processing/40"
                )}
              >
                {/* Avatar */}
                <ChefAvatar 
                  agentType={type}
                  isActive={isActive}
                  className="mb-4"
                />
                
                {/* Title & Description */}
                <h3 className="font-bold text-sm mb-1">{profile.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                  {profile.quirk}
                </p>
                
                {/* Current Activity */}
                {isActive && agent.currentThinking && (
                  <div className="text-[11px] text-processing truncate mb-3 bg-processing/10 rounded-lg px-2 py-1.5">
                    {agent.currentThinking}
                  </div>
                )}
                
                {!isActive && (
                  <div className="text-[11px] text-muted-foreground/60 italic mb-3">
                    Idle state
                  </div>
                )}
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
