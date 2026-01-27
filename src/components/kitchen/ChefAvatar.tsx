import React, { useEffect, useState } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';
import { cn } from '@/lib/utils';

interface ChefAvatarProps {
  agentType: 'chef' | 'sous' | 'expeditor';
  fallbackEmoji: string;
  isActive?: boolean;
  className?: string;
}

const agentPrompts: Record<string, string> = {
  chef: 'orange and coral colored friendly robot chef with chef hat',
  sous: 'blue and teal colored egg-shaped cute cooking creature',
  expeditor: 'purple and indigo glowing orb judge character with monocle',
};

export const ChefAvatar: React.FC<ChefAvatarProps> = ({
  agentType,
  fallbackEmoji,
  isActive = false,
  className,
}) => {
  const { getIllustration, requestIllustration } = useIllustrations();
  const [hasRequested, setHasRequested] = useState(false);
  
  const promptKey = `chef_${agentType}`;
  const illustrationState = getIllustration(promptKey);

  useEffect(() => {
    if (!hasRequested && !illustrationState.url && !illustrationState.isLoading) {
      setHasRequested(true);
      requestIllustration(agentPrompts[agentType], 'chef');
    }
  }, [agentType, hasRequested, illustrationState, requestIllustration]);

  return (
    <div 
      className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden",
        "bg-background/50 backdrop-blur-sm border border-border/50",
        isActive && "animate-pulse",
        className
      )}
    >
      {illustrationState.isLoading && (
        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
      )}
      
      {illustrationState.url && !illustrationState.isLoading && (
        <img 
          src={illustrationState.url}
          alt={`${agentType} chef`}
          className="w-full h-full object-cover"
        />
      )}
      
      {!illustrationState.url && !illustrationState.isLoading && (
        <span className="text-3xl">{fallbackEmoji}</span>
      )}
    </div>
  );
};
