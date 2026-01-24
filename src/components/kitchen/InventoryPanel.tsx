import React from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { tools } from '@/data/tools';
import { IngredientTile } from '@/components/tiles/IngredientTile';
import { ToolTile } from '@/components/tiles/ToolTile';
import { ScrollArea } from '@/components/ui/scroll-area';

export const InventoryPanel: React.FC = () => {
  const { inventory } = useKitchen();
  
  // Separate base and generated ingredients
  const baseIngredients = inventory.filter(i => !i.isGenerated);
  const generatedIngredients = inventory.filter(i => i.isGenerated);
  
  return (
    <section className="px-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingredients Panel */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="mb-3">
            <h2 className="font-bold uppercase text-sm tracking-wide">Ingredients discovered so far</h2>
            <p className="text-xs text-muted-foreground">
              Base ingredients and items found while cooking
            </p>
          </div>
          
          <ScrollArea className="h-48">
            <div className="space-y-1 pr-4">
              {/* Base Ingredients */}
              {baseIngredients.map((ingredient, index) => (
                <IngredientTile 
                  key={`base-${ingredient.id}-${index}`}
                  ingredient={ingredient}
                  isNew={false}
                />
              ))}
              
              {/* Generated Ingredients - shown inline, no special section */}
              {generatedIngredients.map((ingredient, index) => (
                <IngredientTile 
                  key={`gen-${ingredient.id}-${index}`}
                  ingredient={ingredient}
                  isNew={true}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Techniques Panel */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="mb-3">
            <h2 className="font-bold uppercase text-sm tracking-wide">Techniques Observed</h2>
            <p className="text-xs text-muted-foreground">
              Kitchen methods available
            </p>
          </div>
          
          <ScrollArea className="h-48">
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
