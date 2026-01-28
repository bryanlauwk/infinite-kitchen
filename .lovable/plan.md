

# Fix Bak Kut Teh Cooking Issues & Enhance Discovery System

## Problems Identified

### 1. AI Hallucination of Ingredient IDs
The Chef de Cuisine (cooking-agent) sometimes generates non-existent ingredient IDs like `garlicAddress` instead of `garlic`. This causes the cooking loop to create placeholder ingredients that don't match anything in inventory, breaking the recipe flow.

### 2. Repetitive Action Loop (No Progress Detection)
The agent gets stuck repeating the same action (e.g., `crush(black_pepper)` 4-5 times) without progressing to the next step. There's no loop detection to identify this pattern and force progression.

### 3. Missing Southeast Asian Spices
The base inventory lacks essential ingredients for authentic Bak Kut Teh and other Southeast Asian dishes:
- Star anise, cloves, cinnamon sticks (Chinese 5-spice base)
- White peppercorns (key for Bak Kut Teh broth)
- Dang gui (angelica root)
- Dried shrimp, shallots
- Galangal, lemongrass, kaffir lime leaves

### 4. Discovered Ingredients Not Persisting
Currently, new ingredients discovered during cooking (via alchemy-agent) are only added to the session-local inventory. When `isDiscovery: true`, they are added to persistent inventory - but this system could be more robust.

---

## Implementation Plan

### Phase 1: Ingredient ID Validation & Normalization

**File: `supabase/functions/cooking-agent/index.ts`**

Add a post-processing step to validate and normalize ingredient IDs before returning:

| Check | Action |
|-------|--------|
| ID contains garbage (`Address`, `123`, special chars) | Extract base word and match to inventory |
| ID not in inventory but similar exists | Fuzzy match to closest inventory item |
| ID is ingredient name (not ID) | Convert to proper snake_case ID |

```text
Example transformations:
- "garlicAddress" → "garlic"
- "Black Pepper" → "black_pepper"  
- "pork ribs" → "pork" (closest match)
```

### Phase 2: Loop Detection in Cooking Loop

**File: `src/hooks/useCookingLoop.ts`**

Track recent actions and detect repetitive patterns:

```text
New tracking:
- actionHistory: Array of { action, ingredients } for last 5 iterations
- Check if current action+ingredients matches any of last 3 actions
- If duplicate detected:
  - Log warning
  - Add context to conversation: "You already did this. Try something different."
  - If 3 consecutive duplicates: force-serve the last generated ingredient
```

| Counter | Behavior |
|---------|----------|
| 1st repeat | Continue, add warning to history |
| 2nd repeat | Add explicit instruction to try different approach |
| 3rd repeat | Auto-serve last generated ingredient |

### Phase 3: Expand Southeast Asian Spice Inventory

**File: `src/data/ingredients.ts`**

Add 15 new Southeast Asian ingredients:

| Category | New Ingredients |
|----------|-----------------|
| Spices | star_anise, cloves, white_pepper, dang_gui (angelica), cinnamon_stick, five_spice_powder |
| Aromatics | galangal, lemongrass, kaffir_lime_leaf, pandan_leaf, shallot |
| Proteins | pork_ribs, dried_shrimp |
| Sauces | dark_soy_sauce, oyster_sauce |

### Phase 4: Robust Discovery Persistence

**File: `src/hooks/useCookingLoop.ts`**

Enhance the discovery system to properly persist to global inventory:

Current flow:
```text
alchemyResult.isDiscovery === true → addToInventory(newIngredient)
```

Enhanced flow:
```text
1. alchemyResult.isDiscovery === true
2. Check if ingredient ID already exists in global inventory (avoid duplicates)
3. If new: addToInventory(newIngredient)
4. Show toast notification: "New ingredient discovered: {name}"
5. Timeline event already exists (✨ NEW DISCOVERY)
```

**File: `src/context/KitchenContext.tsx`**

Update `addToInventory` to check for duplicates:

```text
addToInventory(ingredient):
  if (!inventory.some(i => i.id === ingredient.id)):
    setInventory([...inventory, ingredient])
```

---

## Technical Details

### Ingredient ID Normalizer (cooking-agent)

```text
function normalizeIngredientId(rawId: string, inventory: any[]): string {
  // 1. Clean garbage patterns
  let cleaned = rawId
    .replace(/Address|[0-9]+|[^a-zA-Z_\s]/g, '')
    .toLowerCase()
    .trim();
  
  // 2. Check direct match
  if (inventory.some(i => i.id === cleaned)) return cleaned;
  
  // 3. Convert spaces to underscores
  const snakeCase = cleaned.replace(/\s+/g, '_');
  if (inventory.some(i => i.id === snakeCase)) return snakeCase;
  
  // 4. Fuzzy match: find ingredient containing this word
  const fuzzyMatch = inventory.find(i => 
    i.id.includes(cleaned) || i.name.toLowerCase().includes(cleaned)
  );
  if (fuzzyMatch) return fuzzyMatch.id;
  
  // 5. Return original if no match (let the placeholder logic handle it)
  return rawId;
}
```

### Loop Detection Logic (useCookingLoop)

```text
interface ActionRecord {
  action: string;
  ingredients: string[];
}

// Track last 5 actions
const actionHistory: ActionRecord[] = [];

// In cooking loop, after getting cookingResponse:
const currentAction = { 
  action: actionName, 
  ingredients: ingredientIds.sort() 
};

const isRepeat = actionHistory.some(prev => 
  prev.action === currentAction.action && 
  JSON.stringify(prev.ingredients) === JSON.stringify(currentAction.ingredients)
);

if (isRepeat) {
  repeatCount++;
  if (repeatCount >= 3) {
    // Force serve
  } else {
    // Add context to conversation: "Don't repeat. Try different."
  }
} else {
  repeatCount = 0;
}

actionHistory.push(currentAction);
if (actionHistory.length > 5) actionHistory.shift();
```

---

## File Changes Summary

| File | Changes |
|------|---------|
| `supabase/functions/cooking-agent/index.ts` | Add ingredient ID normalization after parsing function call |
| `src/hooks/useCookingLoop.ts` | Add loop detection, duplicate action handling, discovery toast |
| `src/data/ingredients.ts` | Add 15 Southeast Asian ingredients |
| `src/context/KitchenContext.tsx` | Duplicate check in addToInventory |

---

## Expected Results After Implementation

### Before
```text
1. Chef calls crush(["garlicAddress", "black_pepper"])
2. "garlicAddress" not found → placeholder created
3. Alchemy only receives black_pepper
4. Result: "Ground Black Pepper"
5. Chef repeats crush(["garlicAddress", "black_pepper"]) again
6. Loop continues until max iterations
7. Auto-serve incorrect dish
```

### After
```text
1. Chef calls crush(["garlicAddress", "black_pepper"])
2. Normalizer: "garlicAddress" → "garlic"
3. Both garlic + black_pepper sent to Alchemy
4. Result: "Crushed Garlic Pepper Paste"
5. Chef proceeds to next step (simmer with pork_ribs)
6. Loop detection prevents repeating same action
7. Authentic Bak Kut Teh served with proper broth
```

### Bak Kut Teh Specific Improvements
- **star_anise**, **cloves**, **white_pepper**, **dang_gui** now available in inventory
- Cuisine detector already provides Malaysian hints
- Chef can build authentic herbal broth base
- Pork ribs available for slow simmering

