import React from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { tools } from '@/data/tools';
import { IngredientTile } from '@/components/tiles/IngredientTile';
import { ToolTile } from '@/components/tiles/ToolTile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles } from 'lucide-react';

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
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold uppercase text-sm tracking-wide">Ingredients</h2>
              <p className="text-xs text-muted-foreground">
                Base ingredients and items discovered while cooking
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              count: <span className="font-bold">{inventory.length}</span>
            </span>
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
              
              {/* Generated Ingredients Section */}
              {generatedIngredients.length > 0 && (
                <>
                  <div className="flex items-center gap-2 pt-3 pb-1 border-t border-border mt-2">
                    <Sparkles className="h-3 w-3 text-gemini" />
                    <span className="text-xs font-bold text-gemini uppercase tracking-wide">
                      Generated ({generatedIngredients.length})
                    </span>
                  </div>
                  {generatedIngredients.map((ingredient, index) => (
                    <IngredientTile 
                      key={`gen-${ingredient.id}-${index}`}
                      ingredient={ingredient}
                      isNew={true}
                    />
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Tools Panel */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold uppercase text-sm tracking-wide">Tools</h2>
              <p className="text-xs text-muted-foreground">
                Kitchen techniques the AI can use
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
