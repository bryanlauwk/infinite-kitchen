import React, { useEffect, useState } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';
import { cn } from '@/lib/utils';

interface ChefAvatarProps {
  agentType: 'chef' | 'sous' | 'expeditor';
  fallbackEmoji: string;
  isActive?: boolean;
  className?: string;
}

// Unique identifiers for each chef that will be used as prompt keys
const agentKeys: Record<string, string> = {
  chef: 'alchemist_robot_chef',
  sous: 'transmuter_octopus_creature', 
  expeditor: 'oracle_sun_orb',
};

// Detailed prompts for generating each chef avatar
const agentPrompts: Record<string, string> = {
  chef: 'A cute friendly robot chef character with chef hat and ladle. Light gray and blue metallic colors. Vector art style with soft gradients. Simple geometric shapes, rounded friendly appearance. Clean white background. No text.',
  sous: 'A whimsical purple octopus chef creature character. Cute cartoon style with soft gradients and rounded shapes. Playful and friendly expression. Clean white background. No text. Think indie game mascot.',
  expeditor: 'A warm glowing sun orb character with a friendly face. Orange and golden yellow colors with soft gradients. Cosmic and magical appearance. Clean white background. No text. Vector art style.',
};

export const ChefAvatar: React.FC<ChefAvatarProps> = ({
  agentType,
  fallbackEmoji,
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
      // Pass the unique key as the "dishName" parameter so the context generates the correct promptKey
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
      
      {!illustrationState.url && !illustrationState.isLoading && (
        <span className="text-3xl">{fallbackEmoji}</span>
      )}
    </div>
  );
};
