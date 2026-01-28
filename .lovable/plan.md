

# Compact Chefs Toggle and Improved Recipe Guidance

## Overview

Two improvements to enhance the user experience and cooking success rate:

1. **Compact Mode for Chefs Section**: Add a toggle to switch between full view (current) and compact view (avatars + status only), reducing vertical space when focus is on the Kitchen Log.

2. **Recipe Pattern Guidance for Chef de Cuisine**: Add explicit recipe patterns and step-by-step guidance in the system prompt to dramatically increase success rate for simple dishes like "Cheese Plate" that currently fail due to overthinking.

---

## Problem Analysis

### Cheese Plate Rejection Issue

The Chef de Cuisine currently fails on simple dishes because:
- It lacks explicit patterns for basic dishes
- It overthinks by trying complex techniques when a simple approach works
- "Cheese Plate" just needs: `slice(cheese)` then `plate([sliced_cheese])` then `serve([plated_cheese])`
- Without guidance, the AI might try elaborate transformations that change the dish name

### UI Space Optimization

The Chefs Section takes significant vertical space even when users just want to monitor activity. A compact mode would show:
- Horizontal row of avatars
- Activity indicator dots
- Current thinking text (truncated)

---

## Implementation Plan

### Part 1: Compact Mode Toggle for Chefs Section

**File: `src/components/kitchen/ChefsSection.tsx`**

| Change | Description |
|--------|-------------|
| Add state | `const [isCompact, setIsCompact] = useState(false)` |
| Toggle button | Small icon button in header to switch modes |
| Compact layout | Horizontal flex row with avatars and status dots |
| Full layout | Current vertical cards (unchanged) |

**Compact Mode Layout:**
```text
+-------------------------------------------------------+
| The Chefs of Reality              [Expand/Collapse]   |
+-------------------------------------------------------+
| [Avatar1]  [Avatar2]  [Avatar3]                       |
|  Chef       Sous      Expeditor                       |
|  (idle)    (active)    (idle)                         |
+-------------------------------------------------------+
```

**Full Mode Layout:** (Current behavior, unchanged)

### Part 2: Recipe Pattern Library for Simple Dishes

**File: `supabase/functions/cooking-agent/index.ts`**

Add a recipe patterns section to the system prompt that provides explicit step-by-step guidance for common dishes, especially simple ones.

**Recipe Pattern Structure:**

| Difficulty | Pattern Style |
|------------|---------------|
| Beginner | 1-2 direct actions with exact sequence |
| Easy | 3-4 step patterns with clear outcomes |
| Intermediate+ | General technique hints (current approach) |

**Example Patterns to Add:**

```text
RECIPE PATTERNS (follow these for known dishes):

Beginner dishes (1-2 steps):
- "Cheese Plate": slice(cheese) → plate([sliced_cheese]) → serve
- "Sliced Apple": slice(apple) → plate([sliced_apple]) → serve
- "Buttered Bread": slice(bread) → spread butter on sliced_bread → serve
- "Glass of Milk": pour/plate(milk) → serve
- "Fresh Orange Juice": juice(orange) OR crush(orange) → strain → serve
- "Mixed Nuts": mix([various nuts]) → plate → serve
- "Fruit Bowl": slice(fruits) → mix → plate → serve

Easy dishes (3-4 steps):
- "Fried Eggs": crack(egg) → pan_fry(egg) → season(salt, pepper) → serve
- "Scrambled Eggs": crack(egg) → whisk → pan_fry → season → serve
- "Grilled Cheese": slice(bread, cheese) → assemble → pan_fry → serve
- "Avocado Toast": toast(bread) → mash(avocado) → spread on toast → season → serve
```

**Integration into System Prompt:**

```text
// After ORDER TO FULFILL section, add:
RECIPE GUIDANCE:
${getRecipeGuidance(order.dishName, order.difficulty)}

IMPORTANT: For beginner/easy dishes, follow the pattern closely. 
Do not overcomplicate - the dish name should match what was ordered.
```

---

## Technical Details

### Compact Mode State Management

```text
// ChefsSection.tsx
const [isCompact, setIsCompact] = useState(false);

// Compact view component
const CompactChefRow = ({ agent, profile, isActive }) => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <ChefAvatar agentType={type} isActive={isActive} className="w-10 h-10" />
      {isActive && <span className="absolute bottom-0 right-0 w-2 h-2 bg-processing rounded-full animate-pulse" />}
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-xs font-medium">{profile.title}</span>
      {isActive && agent.currentThinking && (
        <p className="text-[10px] text-processing truncate">{agent.currentThinking}</p>
      )}
    </div>
  </div>
);
```

### Recipe Guidance Function

```text
// cooking-agent/index.ts
function getRecipeGuidance(dishName: string, difficulty: string): string {
  const normalizedName = dishName.toLowerCase();
  
  // Beginner patterns
  const beginnerPatterns: Record<string, string> = {
    'cheese plate': 'slice(cheese) → plate([sliced_cheese]) → serve([plated_cheese])',
    'sliced apple': 'slice(apple) → plate([sliced_apple]) → serve([plated_apple])',
    'buttered bread': 'slice(bread) → spread(butter, [sliced_bread]) → serve',
    'glass of milk': 'plate(milk) → serve([plated_milk])',
    'fresh orange juice': 'crush(orange) → strain → serve',
    'mixed nuts': 'mix([various nuts from inventory]) → plate → serve',
    'fruit bowl': 'slice(fruits) → mix → plate → serve',
    'toast with jam': 'toast(bread) → spread(jam) → serve',
  };
  
  // Easy patterns
  const easyPatterns: Record<string, string> = {
    'fried eggs': 'crack(egg) → pan_fry → season(salt, pepper) → plate → serve',
    'scrambled eggs': 'crack(egg) → whisk → pan_fry(with stirring) → season → serve',
    'grilled cheese': 'slice(bread, cheese) → assemble sandwich → pan_fry → serve',
    'avocado toast': 'toast(bread) → mash(avocado) → spread on toast → season → serve',
    'caprese salad': 'slice(tomato, mozzarella) → arrange with basil → drizzle(olive_oil) → serve',
    'boiled rice': 'rinse(rice) → boil(rice, water) → drain → serve',
    'mashed potatoes': 'peel(potato) → boil → mash → mix(butter, cream) → season → serve',
    'guacamole': 'mash(avocado) → mix(with lime, salt, cilantro) → serve',
  };
  
  // Check for pattern match
  for (const [dish, pattern] of Object.entries(beginnerPatterns)) {
    if (normalizedName.includes(dish)) {
      return `RECOMMENDED PATTERN: ${pattern}\nFollow this pattern closely for best results.`;
    }
  }
  
  for (const [dish, pattern] of Object.entries(easyPatterns)) {
    if (normalizedName.includes(dish)) {
      return `SUGGESTED APPROACH: ${pattern}\nUse this as a guide but adapt as needed.`;
    }
  }
  
  // No specific pattern - return general guidance
  if (difficulty === 'beginner') {
    return 'This is a simple dish. Keep it simple: 1-2 cooking actions, then plate and serve.';
  } else if (difficulty === 'easy') {
    return 'This is an easy dish. Focus on 3-4 essential steps. Avoid overcomplicating.';
  }
  
  return ''; // No special guidance for harder dishes
}
```

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/components/kitchen/ChefsSection.tsx` | Add compact/full toggle, compact layout component |
| `supabase/functions/cooking-agent/index.ts` | Add recipe guidance function, inject patterns into prompt |

---

## Expected Results

### Compact Mode

| View | Space Used | Information Shown |
|------|------------|-------------------|
| Full (default) | ~400px height | Full cards with descriptions, activity, avatars |
| Compact | ~60px height | Horizontal avatar row, status dots, truncated activity |

### Recipe Success Rate

| Before | After |
|--------|-------|
| "Cheese Plate" → Rejected (overcomplicated transformation) | "Cheese Plate" → Verified (follows slice → plate → serve pattern) |
| Simple dishes fail due to name mismatch | Simple dishes succeed with guided patterns |
| AI guesses cooking steps | AI follows proven recipe patterns |

---

## UI Toggle Behavior

The toggle in the Chefs Section header:
- **Icon**: Chevron up/down or maximize/minimize icon
- **Default state**: Full view (compact = false)
- **Click**: Toggle between modes
- **Persistence**: Session only (no localStorage needed)

