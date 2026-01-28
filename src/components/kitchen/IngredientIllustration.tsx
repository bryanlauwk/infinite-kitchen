import React, { useState } from 'react';
import { useVisibilityRequest } from '@/hooks/useVisibilityRequest';
import { cn } from '@/lib/utils';

interface IngredientIllustrationProps {
  ingredientName: string;
  className?: string;
}

export const IngredientIllustration: React.FC<IngredientIllustrationProps> = ({
  ingredientName,
  className,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Normalize the ingredient name for the key
  const normalizedName = ingredientName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  const { elementRef, illustrationState } = useVisibilityRequest({
    name: normalizedName,
    type: 'ingredient',
    displayName: ingredientName,
    rootMargin: '100px'
  });

  return (
    <div 
      ref={elementRef}
      className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0",
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
          alt={ingredientName}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
        />
      )}
      
      {/* Neutral placeholder - small dot */}
      {!illustrationState.url && !illustrationState.isLoading && (
        <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
      )}
    </div>
  );
};
