import React from 'react';
import { useAgents } from '@/context/AgentContext';
import { AgentType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ChefAvatar } from './ChefAvatar';

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

export const ChefsSection: React.FC = () => {
  const { agents } = useAgents();
  const agentOrder: AgentType[] = ['chef', 'sous', 'expeditor'];
  
  return (
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated h-full flex flex-col">
      <div className="mb-3 flex-shrink-0">
        <h2 className="font-bold uppercase text-sm tracking-wide">The Chefs of Reality</h2>
        <p className="text-xs text-muted-foreground">
          Three function callers, one purpose.
        </p>
      </div>
      
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
      </div>
  );
};
