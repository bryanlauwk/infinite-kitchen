import React, { useMemo } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categoryToGroup, groupLabels, groupOrder } from '@/lib/ingredientGroups';
import { Ingredient, IngredientGroup } from '@/lib/types';

export const IngredientsPanel: React.FC = () => {
  const { inventory } = useKitchen();
  
  // Group ingredients by category group
  const groupedIngredients = useMemo(() => {
    const groups: Record<IngredientGroup, Ingredient[]> = {
      discovered: [],
      primary: [],
      macronutrients: [],
      micronutrients: [],
      culinary: [],
    };
    
    inventory.forEach(ingredient => {
      if (ingredient.isGenerated) {
        groups.discovered.push(ingredient);
      } else {
        const group = categoryToGroup[ingredient.category];
        if (group) {
          groups[group].push(ingredient);
        }
      }
    });
    
    return groups;
  }, [inventory]);
  
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="mb-3">
        <h2 className="font-bold uppercase text-sm tracking-wide">Ingredients</h2>
        <p className="text-xs text-muted-foreground">
          What the kitchen knows.
        </p>
      </div>
      
      <ScrollArea className="h-[320px]">
        <div className="space-y-4 pr-2">
          {groupOrder.map(group => {
            const ingredients = groupedIngredients[group];
            if (ingredients.length === 0) return null;
            
            const isDiscovered = group === 'discovered';
            
            return (
              <div key={group}>
                <h3 className={`text-xs font-medium uppercase tracking-wider mb-2 ${
                  isDiscovered ? 'text-gemini' : 'text-muted-foreground'
                }`}>
                  {isDiscovered && '✨ '}{groupLabels[group]}
                </h3>
                <div className="space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <div 
                      key={`${group}-${ingredient.id}-${index}`}
                      className="flex items-center gap-2 text-sm py-1"
                    >
                      <span className="text-base">{ingredient.emoji}</span>
                      <span className={isDiscovered ? 'text-gemini' : ''}>
                        {ingredient.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
