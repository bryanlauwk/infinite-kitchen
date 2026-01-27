import React, { useEffect, useState } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';
import { cn } from '@/lib/utils';

interface TechniqueIllustrationProps {
  techniqueName: string;
  techniqueId: string;
  className?: string;
}

export const TechniqueIllustration: React.FC<TechniqueIllustrationProps> = ({
  techniqueName,
  techniqueId,
  className,
}) => {
  const { getIllustration, requestIllustration } = useIllustrations();
  const [hasRequested, setHasRequested] = useState(false);
  
  // Use techniqueId for consistent key generation (no special characters)
  const promptKey = `technique_${techniqueId}`;
  const illustrationState = getIllustration(promptKey);

  useEffect(() => {
    if (!hasRequested && !illustrationState.url && !illustrationState.isLoading) {
      setHasRequested(true);
      // Pass techniqueId as the name for consistent key generation
      requestIllustration(techniqueId, 'technique', techniqueName);
    }
  }, [techniqueId, techniqueName, hasRequested, illustrationState, requestIllustration]);

  return (
    <div 
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0",
        "bg-muted/50",
        className
      )}
    >
      {illustrationState.isLoading && (
        <div className="w-full h-full animate-pulse bg-muted" />
      )}
      
      {illustrationState.url && !illustrationState.isLoading && (
        <img 
          src={illustrationState.url}
          alt={techniqueName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      
      {/* Neutral placeholder - geometric shape */}
      {!illustrationState.url && !illustrationState.isLoading && (
        <div className="w-4 h-4 rounded bg-muted-foreground/15" />
      )}
    </div>
  );
};
