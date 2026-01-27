import React, { useMemo } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { tools } from '@/data/tools';
import { IngredientTile } from '@/components/tiles/IngredientTile';
import { ToolTile } from '@/components/tiles/ToolTile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categoryToGroup, groupLabels, groupOrder } from '@/lib/ingredientGroups';
import { Ingredient, IngredientGroup } from '@/lib/types';

export const InventoryPanel: React.FC = () => {
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
    <section className="px-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingredients Panel */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="mb-3">
            <h2 className="font-bold uppercase text-sm tracking-wide">Ingredients Found</h2>
            <p className="text-xs text-muted-foreground">
              Things the kitchen seems to know now.
            </p>
          </div>
          
          <ScrollArea className="h-64">
            <div className="space-y-4 pr-4">
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
                        <IngredientTile 
                          key={`${group}-${ingredient.id}-${index}`}
                          ingredient={ingredient}
                          isNew={isDiscovered}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        
        {/* Techniques Panel */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="mb-3">
            <h2 className="font-bold uppercase text-sm tracking-wide">Techniques</h2>
            <p className="text-xs text-muted-foreground">
              Ways the kitchen behaves.
            </p>
          </div>
          
          <ScrollArea className="h-64">
            <div className="space-y-1 pr-4">
              {tools.map(tool => (
                <ToolTile key={tool.id} tool={tool} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};
