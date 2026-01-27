import React, { useEffect, useState } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';
import { cn } from '@/lib/utils';

interface IngredientIllustrationProps {
  ingredientName: string;
  className?: string;
}

export const IngredientIllustration: React.FC<IngredientIllustrationProps> = ({
  ingredientName,
  className,
}) => {
  const { getIllustration, requestIllustration } = useIllustrations();
  const [hasRequested, setHasRequested] = useState(false);
  
  // Normalize the ingredient name for the prompt key
  const normalizedName = ingredientName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const promptKey = `ingredient_${normalizedName}`;
  const illustrationState = getIllustration(promptKey);

  useEffect(() => {
    if (!hasRequested && !illustrationState.url && !illustrationState.isLoading) {
      setHasRequested(true);
      requestIllustration(ingredientName, 'ingredient' as any);
    }
  }, [ingredientName, hasRequested, illustrationState, requestIllustration]);

  return (
    <div 
      className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0",
        "bg-muted/50",
        className
      )}
    >
      {illustrationState.isLoading && (
        <div className="w-full h-full shimmer bg-gradient-to-br from-muted to-muted/50" />
      )}
      
      {illustrationState.url && !illustrationState.isLoading && (
        <img 
          src={illustrationState.url}
          alt={ingredientName}
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Neutral placeholder - small dot */}
      {!illustrationState.url && !illustrationState.isLoading && (
        <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
      )}
    </div>
  );
};
