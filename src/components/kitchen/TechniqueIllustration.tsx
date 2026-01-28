import React, { useState } from 'react';
import { useVisibilityRequest } from '@/hooks/useVisibilityRequest';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { elementRef, illustrationState } = useVisibilityRequest({
    name: techniqueId,
    type: 'technique',
    displayName: techniqueName,
    rootMargin: '100px'
  });

  return (
    <div 
      ref={elementRef}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0",
        "bg-muted/50",
        className
      )}
      style={{ contain: 'layout style' }}
    >
      {illustrationState.isLoading && (
        <div className="w-full h-full animate-pulse bg-muted" />
      )}
      
      {illustrationState.url && (
        <img 
          src={illustrationState.url}
          alt={techniqueName}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
        />
      )}
      
      {/* Neutral placeholder - geometric shape */}
      {!illustrationState.url && !illustrationState.isLoading && (
        <div className="w-4 h-4 rounded bg-muted-foreground/15" />
      )}
    </div>
  );
};
