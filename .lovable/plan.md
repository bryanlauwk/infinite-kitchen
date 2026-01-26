
# Ingredient Discovery Filter + Realistic Sound Effects

## Overview

This plan addresses two issues:
1. **Only add raw/base ingredient discoveries** to the kitchen inventory, not intermediate cooking results like "seared beef" or "mixed vegetables"
2. **Improve sound effect realism** by matching sounds to the actual cooking technique being used (e.g., fruit salad preparation should use peel/wash/toss sounds, not pan fry sounds)

---

## Part 1: Filter New Ingredient Discoveries

### Current Problem
Every alchemy result is added to the "Newly Discovered" inventory. This creates clutter with intermediate cooking states like:
- "Seared Salmon" (intermediate, not a base ingredient)
- "Whisked Eggs" (intermediate step)
- "Avocado Toast" (final dish, not discoverable ingredient)

### Solution
Modify the alchemy agent to classify results and only add truly **new raw/base ingredients** to the permanent discovery list.

### What Qualifies as a "Discoverable" Ingredient?
| Type | Example | Add to Inventory? |
|------|---------|-------------------|
| Raw sub-ingredient | Cracking egg reveals "Egg White" and "Egg Yolk" | Yes |
| Component extraction | Clarifying butter reveals "Ghee" | Yes |
| Intermediate cooking | "Seared Beef", "Whisked Eggs" | No (only track in timeline) |
| Final dish | "Avocado Toast", "Fruit Salad" | No |

### Implementation

#### 1. Update Alchemy Agent (`supabase/functions/alchemy-agent/index.ts`)

Add a new field `isDiscovery` to classify results:

```typescript
const systemPrompt = `You are an alchemy agent that determines what happens when cooking actions are performed on ingredients.

You must respond with a JSON object describing the result AND classify whether this result reveals a new base ingredient.

A result is a DISCOVERY (isDiscovery: true) only if it:
- Reveals a previously hidden component (egg → egg yolk, egg white)
- Extracts a new base ingredient (clarify butter → ghee)
- Separates into fundamental components (zest lemon → lemon zest)

A result is NOT a discovery (isDiscovery: false) if it:
- Is an intermediate cooking step (seared beef, whisked eggs)
- Is a prepared dish (scrambled eggs, avocado toast)
- Is a transformed combination (mixed vegetables, fruit salad)

Examples:
- crack([🥚 egg]) → {resultName: "Raw Egg", isDiscovery: false} - opening shell
- separate([🥚 raw egg]) → {resultName: "Egg Yolk", isDiscovery: true} - reveals component
- clarify([🧈 butter]) → {resultName: "Ghee", isDiscovery: true} - extracts new ingredient
- pan_fry([🍳 egg_mixture]) → {resultName: "Scrambled Eggs", isDiscovery: false} - cooking step`;
```

Add `isDiscovery` to the tool parameters:

```typescript
parameters: {
  type: "object",
  properties: {
    resultName: { type: "string", ... },
    resultId: { type: "string", ... },
    emoji: { type: "string", ... },
    description: { type: "string", ... },
    isDiscovery: {
      type: "boolean",
      description: "True only if this reveals a new base ingredient component (like separating egg into yolk/white, or clarifying butter into ghee). False for cooking steps and dishes."
    }
  },
  required: ["resultName", "resultId", "emoji", "description", "isDiscovery"]
}
```

#### 2. Update Cooking Loop (`src/hooks/useCookingLoop.ts`)

Only add to inventory if `isDiscovery` is true:

```typescript
// After getting alchemy result
const alchemyResult = await callAlchemyAgent(actionName, usedIngredients);

// Always track in local inventory for cooking continuation
const newIngredient: Ingredient = {
  id: alchemyResult.resultId,
  name: alchemyResult.resultName,
  emoji: alchemyResult.emoji,
  category: 'generated',
  isGenerated: true,
};

// Add to LOCAL cooking inventory (for this session only)
currentInventory = [...currentInventory, newIngredient];

// Only add to PERSISTENT inventory if it's a discovery
if (alchemyResult.isDiscovery) {
  addToInventory(newIngredient);
  
  addTimelineEvent({
    type: 'result',
    agent: 'sous',
    content: `✨ NEW DISCOVERY: ${alchemyResult.emoji} ${alchemyResult.resultName}`,
    result: { ... },
  });
} else {
  addTimelineEvent({
    type: 'result',
    agent: 'sous',
    content: alchemyResult.description,
    result: { ... },
  });
}
```

#### 3. Update API Types (`src/lib/api.ts`)

Update the alchemy result interface:

```typescript
interface AlchemyResult {
  resultName: string;
  resultId: string;
  emoji: string;
  description: string;
  isDiscovery: boolean;  // NEW
}
```

---

## Part 2: Realistic Technique-Aware Sound Effects

### Current Problem
The sound system has 100+ technique prompts, but:
- Fallback logic sometimes returns generic sounds
- The action-to-sound matching doesn't consider the dish context
- Fruit salad preparation might incorrectly trigger "pan fry" sounds

### Solution
Improve the sound matching to be context-aware based on the ACTUAL technique being called.

### Key Insight
The cooking agent already chooses the correct technique (e.g., `toss`, `peel`, `combine` for fruit salad). The issue is ensuring:
1. Every technique has an appropriate sound prompt
2. The fallback doesn't default to "sizzling" sounds for cold prep
3. Ingredient modifiers don't add heat sounds to cold dishes

### Implementation

#### 1. Add Cold/No-Heat Technique Sounds (`src/lib/sounds.ts`)

Add new techniques and improve existing ones for cold preparation:

```typescript
export const techniqueSounds: Record<string, string> = {
  // ... existing ...

  // ===== COLD PREPARATION (NEW) =====
  wash: "fresh vegetables rinsing under running water, water splashing gently in sink",
  clean: "hands rubbing vegetables clean, water droplets falling",
  dry: "kitchen towel patting food dry, soft fabric sounds",
  assemble: "gentle placement of ingredients, soft arranging sounds",
  arrange: "careful food arranging on plate, quiet composition",
  hull: "strawberry stems being removed with soft pop",
  pit: "stone fruit pit being removed, knife cutting around",
  segment: "citrus being separated into segments, membrane tearing",
  
  // Update toss to be salad-specific
  toss: "salad tongs tossing mixed greens in large bowl, leaves rustling gently",
  
  // Update combine for cold context
  combine: "ingredients being gently mixed together in bowl, soft stirring",
  
  // Add fruit-specific sounds
  peel_fruit: "fruit skin being peeled away, juice dripping lightly",
  scoop: "spoon scooping soft fruit flesh, gentle scraping",
};
```

#### 2. Improve Category Fallback Logic (`src/lib/sounds.ts`)

Update the `getCategorySound` function to detect cold vs. hot preparations:

```typescript
function getCategorySound(action: string): string {
  const normalized = action.toLowerCase();
  
  // Cold/no-heat preparations FIRST (priority)
  if (/wash|rinse|clean|dry/.test(normalized)) {
    return "running water and gentle cleaning sounds";
  }
  if (/toss|mix|combine|assemble|arrange/.test(normalized)) {
    return "gentle mixing and arranging sounds in bowl";
  }
  if (/peel|core|hull|pit|segment|scoop/.test(normalized)) {
    return "soft fruit preparation, gentle cutting and separating";
  }
  
  // Hot preparations
  if (/fry|sear|grill|saute|pan/.test(normalized)) {
    return "food sizzling in hot pan with oil bubbling";
  }
  if (/boil|simmer|steam|poach/.test(normalized)) {
    return "water bubbling gently in pot";
  }
  if (/chop|slice|dice|cut|mince/.test(normalized)) {
    return "sharp knife cutting on wooden board";
  }
  if (/whisk|stir|blend/.test(normalized)) {
    return "utensil mixing ingredients in bowl";
  }
  if (/bake|roast|oven/.test(normalized)) {
    return "oven with gentle heat and occasional sizzle";
  }
  
  // Final fallback - generic but neutral
  return "kitchen preparation sounds, utensils and ingredients";
}
```

#### 3. Context-Aware Ingredient Modifiers (`src/lib/sounds.ts`)

Don't add heat-related modifiers for cold preparations:

```typescript
// Add detection for cold techniques
const coldTechniques = new Set([
  'toss', 'mix', 'combine', 'wash', 'rinse', 'peel', 'core',
  'hull', 'pit', 'segment', 'scoop', 'assemble', 'arrange',
  'clean', 'dry', 'garnish', 'plate', 'drizzle', 'sprinkle'
]);

export function getSoundPrompt(action: string, ingredients?: string[]): string {
  const normalized = action.toLowerCase().replace(/[-\s]/g, '_');
  
  // Get base technique sound
  let basePrompt = techniqueSounds[normalized];
  
  // ... existing fallback logic ...
  
  // Only add ingredient modifiers for HOT techniques
  // Skip for cold preparations to avoid "sizzling" sounds
  if (ingredients && ingredients.length > 0 && !coldTechniques.has(normalized)) {
    const ingredientModifier = getIngredientModifier(ingredients);
    if (ingredientModifier) {
      return `${basePrompt}, ${ingredientModifier}`;
    }
  }
  
  return basePrompt;
}
```

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/alchemy-agent/index.ts` | Modify | Add `isDiscovery` classification |
| `src/hooks/useCookingLoop.ts` | Modify | Only persist discoveries, not intermediate steps |
| `src/lib/api.ts` | Modify | Add `isDiscovery` to AlchemyResult interface |
| `src/lib/sounds.ts` | Modify | Add cold prep sounds, improve fallback logic |

---

## Expected Behavior After Changes

### Ingredient Discovery
```text
Order: Avocado Toast

Step 1: crack(egg) → Raw Egg ❌ Not a discovery
Step 2: whisk(raw_egg) → Whisked Egg ❌ Not a discovery  
Step 3: mash(avocado) → Mashed Avocado ❌ Not a discovery
Step 4: toast(bread) → Toast ❌ Not a discovery
Step 5: serve(avocado_toast) → Complete

Newly Discovered: (empty - no new base ingredients revealed)

BUT if we did:
Step X: separate(raw_egg) → Egg Yolk ✅ DISCOVERY! Added to inventory
Step Y: clarify(butter) → Ghee ✅ DISCOVERY! Added to inventory
```

### Sound Effects
```text
Order: Fruit Salad

Action: peel([apple]) → "fruit skin being peeled away, juice dripping lightly"
Action: slice([apple, banana]) → "long smooth knife strokes slicing through food cleanly"
Action: toss([sliced_fruits]) → "salad tongs tossing mixed greens in large bowl, leaves rustling gently"
Action: drizzle([honey]) → "thin stream of honey pouring over dish"
Action: serve → "plate sliding onto pass, chef calling order up"

NO sizzling, frying, or heat sounds - all cold preparation appropriate!
```

---

## Technical Notes

### Why Separate Local vs. Persistent Inventory?
The cooking loop needs ALL results (including intermediate) to continue cooking properly. The AI must know that "whisked_eggs" exists to then `pan_fry` them.

- `currentInventory`: Local array for this cooking session - includes everything
- `addToInventory()`: Persistent React state - only true discoveries

### Sound Duration Considerations
Cold preparations should generally have shorter durations:

```typescript
function getActionDuration(action: string): number {
  const normalized = action.toLowerCase();
  
  // Cold/quick preparations
  if (/toss|combine|arrange|plate|drizzle|sprinkle/.test(normalized)) {
    return 2;
  }
  if (/peel|core|hull|segment|wash/.test(normalized)) {
    return 2;
  }
  
  // Existing heat-based durations...
}
```
