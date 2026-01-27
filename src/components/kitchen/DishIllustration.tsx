import React, { useEffect, useState } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';

interface DishIllustrationProps {
  dishName: string;
  className?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({ 
  dishName, 
  className = ''
}) => {
  const { getIllustration, requestIllustration } = useIllustrations();
  const [hasRequested, setHasRequested] = useState(false);
  
  const promptKey = `dish_${dishName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const illustrationState = getIllustration(promptKey);

  useEffect(() => {
    if (!hasRequested && !illustrationState.url && !illustrationState.isLoading) {
      setHasRequested(true);
      requestIllustration(dishName, 'dish');
    }
  }, [dishName, hasRequested, illustrationState, requestIllustration]);

  return (
    <div 
      className={`relative w-full h-20 rounded-xl overflow-hidden bg-muted/50 ${className}`}
    >
      {/* Loading state - shimmer only */}
      {illustrationState.isLoading && (
        <div className="absolute inset-0 shimmer bg-gradient-to-br from-muted to-muted/50">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: 'shimmer 1.5s infinite',
            }}
          />
        </div>
      )}
      
      {/* AI Generated Image */}
      {illustrationState.url && !illustrationState.isLoading && (
        <img 
          src={illustrationState.url}
          alt={dishName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      
      {/* Neutral placeholder when no image and not loading */}
      {!illustrationState.url && !illustrationState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-muted-foreground/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
          </div>
        </div>
      )}
    </div>
  );
};
