import React from 'react';
import { getDishGradient, inferDishCategory, DishCategory } from '@/lib/dishColors';

interface DishIllustrationProps {
  dishName: string;
  emoji: string;
  className?: string;
}

// SVG decorative elements based on dish category
const CategoryDecoration: React.FC<{ category: DishCategory }> = ({ category }) => {
  switch (category) {
    case 'cosmic':
      return (
        <>
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3" />
          <circle cx="85" cy="25" r="2" fill="currentColor" opacity="0.25" />
          <circle cx="15" cy="55" r="2" fill="currentColor" opacity="0.2" />
          <path 
            d="M70 50 L73 45 L76 50 L73 55 Z" 
            fill="currentColor" 
            opacity="0.2"
          />
        </>
      );
    case 'pasta':
      return (
        <>
          <path 
            d="M15 35 Q25 30 35 35 Q45 40 55 35" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none" 
            opacity="0.15"
          />
          <path 
            d="M65 55 Q75 50 85 55" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none" 
            opacity="0.12"
          />
        </>
      );
    case 'salad':
      return (
        <>
          <circle cx="18" cy="25" r="5" fill="currentColor" opacity="0.1" />
          <circle cx="80" cy="50" r="4" fill="currentColor" opacity="0.08" />
          <path 
            d="M70 20 Q75 25 70 30" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none" 
            opacity="0.12"
          />
        </>
      );
    case 'seafood':
      return (
        <>
          <path 
            d="M20 40 Q25 35 30 40 Q35 45 40 40" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.15"
          />
          <circle cx="80" cy="30" r="2" fill="currentColor" opacity="0.15" />
          <circle cx="75" cy="55" r="3" fill="currentColor" opacity="0.1" />
        </>
      );
    case 'dessert':
      return (
        <>
          <circle cx="20" cy="22" r="4" fill="currentColor" opacity="0.12" />
          <circle cx="82" cy="50" r="3" fill="currentColor" opacity="0.1" />
          <path 
            d="M70 25 L72 20 L74 25" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.15"
          />
        </>
      );
    default:
      return (
        <>
          <circle cx="15" cy="25" r="3" fill="currentColor" opacity="0.08" />
          <circle cx="85" cy="50" r="2" fill="currentColor" opacity="0.06" />
        </>
      );
  }
};

export const DishIllustration: React.FC<DishIllustrationProps> = ({ 
  dishName, 
  emoji,
  className = ''
}) => {
  const category = inferDishCategory(dishName);
  const gradient = getDishGradient(dishName);
  
  return (
    <div 
      className={`relative w-full h-20 rounded-xl overflow-hidden ${className}`}
      style={{ background: gradient }}
    >
      {/* SVG decorative layer */}
      <svg 
        className="absolute inset-0 w-full h-full text-foreground"
        viewBox="0 0 100 70"
        preserveAspectRatio="xMidYMid slice"
      >
        <CategoryDecoration category={category} />
      </svg>
      
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
    </div>
  );
};
