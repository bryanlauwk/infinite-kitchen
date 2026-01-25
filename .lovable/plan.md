

# Three-Agent Collaboration + Categorized Ingredients System

## Overview

This plan ensures the three Gemini 3 Flash agents collaborate properly to deliver dishes, and reorganizes the ingredient display with newly discovered items at the top and a proper category structure.

---

## Part 1: Agent Collaboration Verification

The three agents are already working together correctly in the cooking loop:

### Current Agent Flow
```text
User clicks "Cook"
       |
       v
+------------------+
|  COOKING AGENT   |  <- Plans the recipe, selects tools/ingredients
|  (Orchestrator)  |     Uses 102 cooking function tools
+--------+---------+
         |
         | Calls tool (e.g., pan_fry, chop, etc.)
         v
+------------------+
|  ALCHEMY AGENT   |  <- Transforms ingredients based on action
|  (Transformer)   |     Determines result name, emoji, description
+--------+---------+
         |
         | Returns new ingredient to inventory
         v
(Loop continues until serve() is called)
         |
         v
+------------------+
|  JUDGE AGENT     |  <- Verifies served dish matches order
|  (Verifier)      |     Uses semantic similarity
+------------------+
         |
         v
     Order Fulfilled or Rejected
```

### Agent Responsibilities (Already Implemented)

| Agent | Role | Implementation |
|-------|------|----------------|
| Cooking Agent | Orchestrates 100+ tools and ingredients to plan meals | `cooking-agent/index.ts` - Uses function calling with 102 tools |
| Alchemy Agent (Sous) | Determines results of cooking actions | `alchemy-agent/index.ts` - Transforms ingredients via AI |
| Judge Agent (Expeditor) | Verifies dish matches order semantically | `judge-agent/index.ts` - Semantic comparison |

**Status**: The agent system is correctly implemented. The cooking loop in `useCookingLoop.ts` properly sequences calls between all three agents.

---

## Part 2: Ingredient System Reorganization

### Current Issues

1. **New ingredients appear at the bottom** - Hard to notice discoveries
2. **All ingredients in one flat list** - No visual organization
3. **Categories not displayed** - Just "base" vs "generated"

### New Category Structure

Based on the PRD, organize ingredients into these main groups:

| Group | Current Categories | Description |
|-------|-------------------|-------------|
| **Primary/Whole Foods** | `proteins`, `vegetables`, `fruits` | Raw, unprocessed ingredients |
| **Macronutrients** | `dairy`, `grains`, `nuts` | Energy-providing foods |
| **Micronutrients** | `spices` | Herbs, seasonings, vitamins |
| **Culinary Ingredients** | `liquids`, `condiments` | Cooking oils, sauces, flavor enhancers |
| **Discovered** | `generated` (isGenerated: true) | NEW - Items found while cooking |

---

## File Changes

### 1. `src/lib/types.ts`

Update category types to include the new high-level groupings:

```typescript
export type IngredientCategory = 
  | 'proteins'
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'grains'
  | 'spices'
  | 'liquids'
  | 'condiments'
  | 'nuts'
  | 'generated';

// Add new type for display grouping
export type IngredientGroup = 
  | 'primary'      // proteins, vegetables, fruits
  | 'macronutrients'  // dairy, grains, nuts
  | 'micronutrients'  // spices
  | 'culinary'     // liquids, condiments
  | 'discovered';  // generated
```

### 2. `src/lib/ingredientGroups.ts` (New File)

Create a helper to organize categories into groups:

```typescript
export const categoryToGroup: Record<IngredientCategory, IngredientGroup> = {
  proteins: 'primary',
  vegetables: 'primary',
  fruits: 'primary',
  dairy: 'macronutrients',
  grains: 'macronutrients',
  nuts: 'macronutrients',
  spices: 'micronutrients',
  liquids: 'culinary',
  condiments: 'culinary',
  generated: 'discovered',
};

export const groupLabels: Record<IngredientGroup, string> = {
  discovered: 'Newly Discovered',
  primary: 'Primary Foods',
  macronutrients: 'Grains & Dairy',
  micronutrients: 'Herbs & Spices',
  culinary: 'Oils & Condiments',
};

export const groupOrder: IngredientGroup[] = [
  'discovered',      // NEW items always at top
  'primary',
  'macronutrients',
  'micronutrients',
  'culinary',
];
```

### 3. `src/components/kitchen/InventoryPanel.tsx`

Reorganize to show newly discovered at top, then grouped categories:

```typescript
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
      groups[group].push(ingredient);
    }
  });
  
  return groups;
}, [inventory]);
```

Display structure:
```text
+----------------------------------+
| INGREDIENTS DISCOVERED SO FAR    |
+----------------------------------+
| ✨ Newly Discovered              |  <- Highlighted section
|   🍳 Scrambled Eggs    NEW       |
|   🧈 Melted Butter     NEW       |
+----------------------------------+
| Primary Foods                    |
|   🥚 egg  🍗 chicken  🥩 beef    |
|   🥬 spinach  🥦 broccoli  ...   |
+----------------------------------+
| Grains & Dairy                   |
|   🍚 rice  🍞 bread  🧀 cheese   |
+----------------------------------+
| Herbs & Spices                   |
|   🧂 salt  🌶️ pepper  🌿 basil   |
+----------------------------------+
| Oils & Condiments                |
|   🫒 olive oil  🍯 honey  ...    |
+----------------------------------+
```

### 4. `src/components/tiles/IngredientTile.tsx`

Update to show "NEW" badge for discovered ingredients:

```typescript
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
```

---

## Technical Notes

### Agent Collaboration
- The cooking loop correctly maintains `conversationHistory` to prevent infinite loops
- Each agent call is sequential: Cooking -> Alchemy -> (loop) -> Judge
- Sound effects trigger appropriately at each stage

### Ingredient Discovery Flow
1. User orders a dish
2. Cooking Agent calls action (e.g., `whisk([egg, milk])`)
3. Alchemy Agent returns result (e.g., "Egg Mixture")
4. New ingredient added to inventory with `isGenerated: true`
5. UI shows it in "Newly Discovered" section with "NEW" badge
6. Ingredient persists for future cooking sessions

---

## Summary of Changes

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/types.ts` | Modify | Add `IngredientGroup` type |
| `src/lib/ingredientGroups.ts` | Create | Category-to-group mapping and labels |
| `src/components/kitchen/InventoryPanel.tsx` | Modify | Group ingredients, show discovered at top |
| `src/components/tiles/IngredientTile.tsx` | Modify | Add "NEW" badge for discovered items |

