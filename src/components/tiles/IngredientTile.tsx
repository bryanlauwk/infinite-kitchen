import React from 'react';
import { Ingredient } from '@/lib/types';
import { cn } from '@/lib/utils';

interface IngredientTileProps {
  ingredient: Ingredient;
  isNew?: boolean;
}

export const IngredientTile: React.FC<IngredientTileProps> = ({ ingredient, isNew }) => {
  return (
    <div 
      className={cn(
        "tile flex items-center gap-2 py-2",
        isNew && "animate-slide-in border-gemini/30 bg-gemini/5"
      )}
    >
      <span className="text-base opacity-60">{ingredient.emoji}</span>
      <span className="text-sm truncate flex-1">{ingredient.name}</span>
      {isNew && (
        <span className="w-1.5 h-1.5 rounded-full bg-gemini animate-pulse" />
      )}
    </div>
  );
};
