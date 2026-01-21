import React, { useRef, useEffect } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { ingredients } from '@/data/ingredients';
import { tools } from '@/data/tools';
import { IngredientTile } from '@/components/tiles/IngredientTile';
import { ToolTile } from '@/components/tiles/ToolTile';
import { ScrollArea } from '@/components/ui/scroll-area';

export const InventoryPanel: React.FC = () => {
  const { inventory } = useKitchen();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Find newly generated ingredients
  const generatedIngredients = inventory.filter(i => i.isGenerated);
  
  return (
    <section className="px-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingredients Panel */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold uppercase text-sm tracking-wide">Ingredients</h2>
              <p className="text-xs text-muted-foreground">
                Select ingredients to use as function arguments
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              count: <span className="font-bold">{inventory.length}</span>
            </span>
          </div>
          
          <ScrollArea className="h-48">
            <div className="space-y-1 pr-4">
              {inventory.map((ingredient, index) => (
                <IngredientTile 
                  key={`${ingredient.id}-${index}`}
                  ingredient={ingredient}
                  isNew={ingredient.isGenerated}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Tools Panel */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold uppercase text-sm tracking-wide">Tools</h2>
              <p className="text-xs text-muted-foreground">
                Use function calls to combine ingredients
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              count: <span className="font-bold">{tools.length}</span>
            </span>
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
