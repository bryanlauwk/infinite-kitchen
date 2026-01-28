import React, { useState } from 'react';
import { useVisibilityRequest } from '@/hooks/useVisibilityRequest';

interface DishIllustrationProps {
  dishName: string;
  className?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({ 
  dishName, 
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { elementRef, illustrationState } = useVisibilityRequest({
    name: dishName,
    type: 'dish',
    rootMargin: '150px' // Prefetch dishes a bit earlier
  });

  return (
    <div 
      ref={elementRef}
      className={`relative w-full h-20 rounded-xl overflow-hidden bg-muted/50 ${className}`}
      style={{ contain: 'layout style' }}
    >
      {/* Loading state - shimmer only */}
      {illustrationState.isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/50" />
      )}
      
      {/* AI Generated Image with fade-in */}
      {illustrationState.url && (
        <img 
          src={illustrationState.url}
          alt={dishName}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
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
