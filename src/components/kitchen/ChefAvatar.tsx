import React, { useEffect, useState } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';
import { cn } from '@/lib/utils';

interface ChefAvatarProps {
  agentType: 'chef' | 'sous' | 'expeditor';
  isActive?: boolean;
  className?: string;
}

// Unique identifiers for each chef that will be used as prompt keys
const agentKeys: Record<string, string> = {
  chef: 'alchemist_robot_chef',
  sous: 'transmuter_octopus_creature', 
  expeditor: 'oracle_sun_orb',
};

export const ChefAvatar: React.FC<ChefAvatarProps> = ({
  agentType,
  isActive = false,
  className,
}) => {
  const { getIllustration, requestIllustration } = useIllustrations();
  const [hasRequested, setHasRequested] = useState(false);
  
  // Use the unique agent key to get/request illustration
  const agentKey = agentKeys[agentType];
  const illustrationState = getIllustration(`chef_${agentKey}`);

  useEffect(() => {
    if (!hasRequested && !illustrationState.url && !illustrationState.isLoading) {
      setHasRequested(true);
      requestIllustration(agentKey, 'chef');
    }
  }, [agentKey, hasRequested, illustrationState, requestIllustration]);

  return (
    <div 
      className={cn(
        "w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden",
        "bg-background/80 backdrop-blur-sm border border-border/30 shadow-sm",
        isActive && "ring-2 ring-processing/50",
        className
      )}
    >
      {illustrationState.isLoading && (
        <div className="w-full h-full shimmer bg-gradient-to-br from-muted to-muted/50" />
      )}
      
      {illustrationState.url && !illustrationState.isLoading && (
        <img 
          src={illustrationState.url}
          alt={`${agentType} chef`}
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Neutral placeholder - initials instead of emoji */}
      {!illustrationState.url && !illustrationState.isLoading && (
        <div className="w-10 h-10 rounded-full bg-muted-foreground/10 flex items-center justify-center">
          <span className="text-sm font-bold text-muted-foreground/50 uppercase">
            {agentType.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
};
