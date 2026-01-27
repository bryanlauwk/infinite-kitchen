import React from 'react';
import { useAgents } from '@/context/AgentContext';
import { AgentType } from '@/lib/types';
import { cn } from '@/lib/utils';

const chefProfiles: Record<AgentType, { title: string; quirk: string }> = {
  chef: {
    title: 'The Alchemist',
    quirk: 'Sees ingredients as possibilities.',
  },
  sous: {
    title: 'The Transmuter',
    quirk: 'Transforms matter into meaning.',
  },
  expeditor: {
    title: 'The Oracle',
    quirk: 'Knows when a dish is ready.',
  },
};

export const ChefsSection: React.FC = () => {
  const { agents } = useAgents();
  const agentOrder: AgentType[] = ['chef', 'sous', 'expeditor'];
  
  return (
    <section className="px-6 py-4">
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="mb-4">
          <h2 className="font-bold uppercase text-sm tracking-wide">The Chefs of Reality</h2>
          <p className="text-xs text-muted-foreground">
            Three minds, one purpose.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agentOrder.map(type => {
            const agent = agents[type];
            const profile = chefProfiles[type];
            const isActive = agent.status === 'thinking' || agent.status === 'acting';
            
            return (
              <div 
                key={type}
                className={cn(
                  "rounded-xl p-4 border transition-all",
                  isActive 
                    ? "border-processing bg-processing/5" 
                    : "border-border bg-muted/30"
                )}
              >
                {/* Avatar & Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                    isActive ? "bg-processing/20" : "bg-muted"
                  )}>
                    {agent.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{profile.title}</h3>
                    <p className="text-xs text-muted-foreground">{agent.name}</p>
                  </div>
                </div>
                
                {/* Status */}
                <div className="text-xs text-muted-foreground mb-2">
                  {profile.quirk}
                </div>
                
                {/* Current Activity */}
                {isActive && agent.currentThinking && (
                  <div className="text-xs text-processing truncate">
                    {agent.currentThinking}
                  </div>
                )}
                
                {!isActive && (
                  <div className="text-xs text-muted-foreground/50 italic">
                    Waiting...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
