import React, { useEffect, useState } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';
import { getDishGradient } from '@/lib/dishColors';

interface DishIllustrationProps {
  dishName: string;
  emoji: string;
  className?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({ 
  dishName, 
  emoji,
  className = ''
}) => {
  const { getIllustration, requestIllustration } = useIllustrations();
  const [hasRequested, setHasRequested] = useState(false);
  
  const promptKey = `dish_${dishName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const illustrationState = getIllustration(promptKey);
  const fallbackGradient = getDishGradient(dishName);

  useEffect(() => {
    if (!hasRequested && !illustrationState.url && !illustrationState.isLoading) {
      setHasRequested(true);
      requestIllustration(dishName, 'dish');
    }
  }, [dishName, hasRequested, illustrationState, requestIllustration]);

  return (
    <div 
      className={`relative w-full h-20 rounded-xl overflow-hidden ${className}`}
      style={{ background: illustrationState.url ? undefined : fallbackGradient }}
    >
      {/* Loading state with gradient placeholder */}
      {illustrationState.isLoading && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ background: fallbackGradient }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-50">{emoji}</span>
          </div>
          {/* Shimmer effect */}
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
            // Fallback to emoji if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      
      {/* Fallback: Gradient + Emoji (when no image and not loading) */}
      {!illustrationState.url && !illustrationState.isLoading && (
        <>
          {/* Grainy texture overlay */}
          <div 
            className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Emoji centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl drop-shadow-sm">{emoji}</span>
          </div>
          
          {/* Subtle inner glow */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 2px 12px rgba(255,255,255,0.3)',
            }}
          />
        </>
      )}
    </div>
  );
};
