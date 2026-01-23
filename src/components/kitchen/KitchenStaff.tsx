import React, { useState } from 'react';
import { useAgents } from '@/context/AgentContext';
import { AgentCard } from './AgentCard';
import { AgentType } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface KitchenStaffProps {
  onStartOrder: () => void;
  isCooking: boolean;
}

export const KitchenStaff: React.FC<KitchenStaffProps> = ({ onStartOrder, isCooking }) => {
  const { agents } = useAgents();
  const [openAgent, setOpenAgent] = useState<AgentType | null>(null);
  
  const agentOrder: AgentType[] = ['chef', 'sous', 'expeditor'];
  
  return (
    <>
      <section className="px-6 py-2">
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="mb-3">
            <h2 className="font-bold uppercase text-sm tracking-wide">Kitchen Staff</h2>
            <p className="text-xs text-muted-foreground">
              Three AI chefs working together to cook your order
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {agentOrder.map(type => (
              <AgentCard
                key={type}
                agent={agents[type]}
                isMain={type === 'chef'}
                onStartOrder={type === 'chef' ? onStartOrder : undefined}
                onOpen={() => setOpenAgent(type)}
                isCooking={isCooking}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Agent Detail Dialog */}
      <Dialog open={openAgent !== null} onOpenChange={() => setOpenAgent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{openAgent && agents[openAgent].emoji}</span>
              {openAgent && agents[openAgent].name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {openAgent && agents[openAgent].description}
            </p>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase">Current Status</h4>
              <div className="p-3 bg-muted rounded-lg text-sm">
                {openAgent && agents[openAgent].status === 'idle' && 'Waiting for orders...'}
                {openAgent && agents[openAgent].status === 'thinking' && (
                  <span className="text-processing">
                    {agents[openAgent].currentThinking || 'Thinking...'}
                  </span>
                )}
                {openAgent && agents[openAgent].status === 'acting' && (
                  <span className="text-gemini">
                    Executing: {agents[openAgent].lastAction}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
