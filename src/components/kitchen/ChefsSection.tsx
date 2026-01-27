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
  fallbackEmoji: string;
}> = {
  chef: {
    title: 'The Alchemist Unit',
    quirk: 'Crafts transformation stages across arguments.',
    gradientClass: 'agent-gradient-alchemist',
    fallbackEmoji: '🤖',
  },
  sous: {
    title: 'The Transmuter Core',
    quirk: 'Converts raw states into refined outputs.',
    gradientClass: 'agent-gradient-transmuter',
    fallbackEmoji: '🥚',
  },
  expeditor: {
    title: 'The Oracle Module',
    quirk: 'Evaluates completion against expectations.',
    gradientClass: 'agent-gradient-oracle',
    fallbackEmoji: '☀️',
  },
};

export const ChefsSection: React.FC = () => {
  const { agents } = useAgents();
  const agentOrder: AgentType[] = ['chef', 'sous', 'expeditor'];
  
  return (
    <section className="px-6 py-4">
      <div className="border border-border rounded-2xl p-4 bg-card card-elevated">
        <div className="mb-4">
          <h2 className="font-bold uppercase text-sm tracking-wide">The Chefs of Reality</h2>
          <p className="text-xs text-muted-foreground">
            Three function callers, one purpose.
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
                  "rounded-2xl p-4 border transition-all card-elevated",
                  profile.gradientClass,
                  isActive && "ring-2 ring-processing/40"
                )}
              >
                {/* Avatar */}
                <ChefAvatar 
                  agentType={type}
                  fallbackEmoji={profile.fallbackEmoji}
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
                
                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 text-xs rounded-xl bg-background/50"
                >
                  <Eye className="h-3 w-3" />
                  Observe
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
