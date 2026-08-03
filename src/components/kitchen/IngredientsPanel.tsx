import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { categoryToGroup, groupLabels, groupOrder } from '@/lib/ingredientGroups';
import { Ingredient, IngredientGroup } from '@/lib/types';
import { IngredientIllustration } from './IngredientIllustration';
import { isFeaturedIngredient } from '@/data/featured';
import { Search } from 'lucide-react';

type IngredientFilter = 'all' | 'featured' | 'base' | 'discovered';

export const IngredientsPanel: React.FC = () => {
  const { inventory, activeIngredients } = useKitchen();
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<IngredientFilter>('all');
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
  
  const filteredInventory = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return inventory.filter(ingredient => {
      const matchesSearch = !normalizedQuery ||
        ingredient.name.toLowerCase().includes(normalizedQuery) ||
        ingredient.id.toLowerCase().includes(normalizedQuery) ||
        ingredient.category.toLowerCase().includes(normalizedQuery);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'featured' && isFeaturedIngredient(ingredient.id)) ||
        (filter === 'base' && !ingredient.isGenerated) ||
        (filter === 'discovered' && !!ingredient.isGenerated);

      return matchesSearch && matchesFilter;
    });
  }, [filter, inventory, searchQuery]);

  // Group ingredients by category group
  const groupedIngredients = useMemo(() => {
    const groups: Record<IngredientGroup, Ingredient[]> = {
      discovered: [],
      primary: [],
      macronutrients: [],
      micronutrients: [],
      culinary: [],
    };
    
    filteredInventory.forEach(ingredient => {
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
  }, [filteredInventory]);

  const featuredCount = useMemo(
    () => inventory.filter(ingredient => isFeaturedIngredient(ingredient.id)).length,
    [inventory]
  );
  
  return (
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated h-full flex flex-col">
      <div className="mb-3 flex-shrink-0 space-y-3">
        <h2 className="font-bold uppercase text-sm tracking-wide">Ingredients</h2>
        <p className="text-xs text-muted-foreground">
          Showing {filteredInventory.length} of {inventory.length} known items.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_135px] lg:grid-cols-1 gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search pantry"
              aria-label="Search ingredients"
              className="h-9 rounded-lg pl-8 text-xs"
            />
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value as IngredientFilter)}>
            <SelectTrigger className="h-9 rounded-lg text-xs">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              <SelectItem value="all">All ({inventory.length})</SelectItem>
              <SelectItem value="featured">This Week ({featuredCount})</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="discovered">Discovered</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                        {isFeaturedIngredient(ingredient.id) && (
                          <Badge variant="outline" className="h-5 flex-shrink-0 rounded px-1.5 text-[9px] uppercase tracking-wide text-processing border-processing/40">
                            this week
                          </Badge>
                        )}
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
          {filteredInventory.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No ingredients match that search.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
