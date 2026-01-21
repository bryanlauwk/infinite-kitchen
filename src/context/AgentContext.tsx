import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AgentState, AgentType, AgentStatus } from '@/lib/types';

interface AgentContextType {
  agents: Record<AgentType, AgentState>;
  setAgentStatus: (type: AgentType, status: AgentStatus) => void;
  setAgentThinking: (type: AgentType, thinking: string | undefined) => void;
  setAgentAction: (type: AgentType, action: string | undefined) => void;
  resetAgents: () => void;
}

const initialAgents: Record<AgentType, AgentState> = {
  chef: {
    type: 'chef',
    name: 'Executive Chef',
    emoji: '👨‍🍳',
    description: 'Orchestrates the kitchen using 100 tools and ingredients to plan the meal.',
    status: 'idle',
  },
  sous: {
    type: 'sous',
    name: 'Sous Chef',
    emoji: '👨‍🔬',
    description: 'Masters the alchemy of flavor to determine the result of cooking actions.',
    status: 'idle',
  },
  expeditor: {
    type: 'expeditor',
    name: 'Expeditor',
    emoji: '👨‍⚖️',
    description: 'Verifies that served dishes match customer orders before delivery.',
    status: 'idle',
  },
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};

interface AgentProviderProps {
  children: ReactNode;
}

export const AgentProvider: React.FC<AgentProviderProps> = ({ children }) => {
  const [agents, setAgents] = useState<Record<AgentType, AgentState>>(initialAgents);

  const setAgentStatus = useCallback((type: AgentType, status: AgentStatus) => {
    setAgents(prev => ({
      ...prev,
      [type]: { ...prev[type], status },
    }));
  }, []);

  const setAgentThinking = useCallback((type: AgentType, thinking: string | undefined) => {
    setAgents(prev => ({
      ...prev,
      [type]: { ...prev[type], currentThinking: thinking },
    }));
  }, []);

  const setAgentAction = useCallback((type: AgentType, action: string | undefined) => {
    setAgents(prev => ({
      ...prev,
      [type]: { ...prev[type], lastAction: action },
    }));
  }, []);

  const resetAgents = useCallback(() => {
    setAgents(initialAgents);
  }, []);

  const value: AgentContextType = {
    agents,
    setAgentStatus,
    setAgentThinking,
    setAgentAction,
    resetAgents,
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
};
