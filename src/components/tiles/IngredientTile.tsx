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
        isNew && "animate-slide-in border-gemini bg-gemini/5"
      )}
    >
      <span className="text-base opacity-60">{ingredient.emoji}</span>
      <span className="text-sm truncate flex-1">{ingredient.name}</span>
      {isNew && (
        <span className="text-[10px] font-medium text-gemini uppercase tracking-wider">
          NEW
        </span>
      )}
    </div>
  );
};
