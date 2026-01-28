import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { categoryToGroup, groupLabels, groupOrder } from '@/lib/ingredientGroups';
import { Ingredient, IngredientGroup } from '@/lib/types';
import { IngredientIllustration } from './IngredientIllustration';

export const IngredientsPanel: React.FC = () => {
  const { inventory, activeIngredients } = useKitchen();
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const ingredientRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  // Scroll to active ingredient when it changes
  useEffect(() => {
    if (activeIngredients.length > 0) {
      const firstActiveId = activeIngredients[0];
      const element = ingredientRefs.current.get(firstActiveId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIngredients]);
  
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
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated h-full flex flex-col">
      <div className="mb-3 flex-shrink-0">
        <h2 className="font-bold uppercase text-sm tracking-wide">Ingredients</h2>
        <p className="text-xs text-muted-foreground">
          What the kitchen knows.
        </p>
      </div>
      
      <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
        <div className="space-y-4 pr-2">
          {groupOrder.map(group => {
            const ingredients = groupedIngredients[group];
            if (ingredients.length === 0) return null;
            
            const isDiscovered = group === 'discovered';
            
            return (
              <div key={group}>
                <h3 className={`text-[10px] font-semibold uppercase tracking-widest mb-2 px-2 ${
                  isDiscovered ? 'text-gemini' : 'text-muted-foreground'
                }`}>
                  {isDiscovered && '✨ '}{groupLabels[group]}
                </h3>
                <div className="space-y-0.5">
                  {ingredients.map((ingredient, index) => {
                    const isSelected = selectedIngredients.has(ingredient.id);
                    const isActive = activeIngredients.includes(ingredient.id) || 
                                     activeIngredients.includes(ingredient.name.toLowerCase());
                    
                    return (
                      <div 
                        key={`${group}-${ingredient.id}-${index}`}
                        ref={(el) => {
                          if (el) {
                            ingredientRefs.current.set(ingredient.id, el);
                            ingredientRefs.current.set(ingredient.name.toLowerCase(), el);
                          }
                        }}
                        className={`ingredient-row flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded-lg transition-all duration-300 ${
                          isActive 
                            ? 'bg-gemini/20 ring-2 ring-gemini/50 scale-[1.02] shadow-md' 
                            : ''
                        }`}
                        onClick={() => toggleIngredient(ingredient.id)}
                      >
                        <Checkbox 
                          id={`ing-${ingredient.id}-${index}`}
                          checked={isSelected}
                          className="rounded border-muted-foreground/30 data-[state=checked]:bg-gemini data-[state=checked]:border-gemini"
                          onCheckedChange={() => toggleIngredient(ingredient.id)}
                        />
                        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                          <IngredientIllustration
                            ingredientName={ingredient.name}
                          />
                        </div>
                        <label 
                          htmlFor={`ing-${ingredient.id}-${index}`}
                          className={`text-sm cursor-pointer flex-1 truncate transition-all duration-300 ${
                            isActive ? 'font-semibold' : ''
                          }`}
                        >
                          <span className={isDiscovered ? 'text-gemini' : isActive ? 'text-gemini' : ''}>
                            {ingredient.name}
                          </span>
                        </label>
                        {isActive && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-gemini animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
