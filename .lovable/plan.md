
# Cleanup Legacy Emoji System & Expand Orders Plan

## Overview

This plan addresses two main objectives:
1. **Clean up legacy emoji + gradient code** - Remove fallback systems and ensure AI-generated illustrations are the primary visual approach across all UI elements
2. **Expand orders with more difficulty levels** - Add new difficulty tiers (beginner, expert, legendary) and significantly expand the dish catalog

---

## Part 1: Remove Legacy Emoji + Gradient Fallbacks

### Current State Analysis

The codebase currently maintains emoji data as fallback graphics in multiple places:

| Component | Current Behavior | AI Illustration Ready? |
|-----------|------------------|------------------------|
| DishIllustration | Uses emoji + gradient as fallback | Yes |
| ChefAvatar | Uses fallbackEmoji prop | Yes |
| IngredientIllustration | Uses fallbackEmoji prop | Yes |
| TechniqueIllustration | Uses fallbackEmoji prop | Yes |
| IngredientTile | Shows emoji directly | No - needs update |
| ToolTile | Shows emoji directly | No - needs update |
| DishesArchive | Shows dish.emoji directly | No - needs update |
| KitchenLog | Shows result.emoji in log | Needs consideration |

### Files to Modify

#### 1.1 Update DishIllustration.tsx
- Remove `emoji` prop from interface
- Remove gradient fallback import from `dishColors.ts`
- Replace fallback with a neutral placeholder (shimmer only, no emoji)
- The component will only show: loading shimmer OR AI image

#### 1.2 Update ChefAvatar.tsx
- Remove `fallbackEmoji` prop
- Replace emoji fallback with a neutral "loading" icon or initials

#### 1.3 Update IngredientIllustration.tsx
- Remove `fallbackEmoji` prop
- Show a neutral placeholder icon when no AI image is available

#### 1.4 Update TechniqueIllustration.tsx
- Remove `fallbackEmoji` prop
- Show a neutral placeholder icon when no AI image is available

#### 1.5 Update IngredientTile.tsx
- Replace emoji display with `IngredientIllustration` component
- This tile is used in some parts of the kitchen log

#### 1.6 Update ToolTile.tsx
- Replace emoji display with `TechniqueIllustration` component

#### 1.7 Update DishesArchive.tsx
- Replace `dish.emoji` display with a small `DishIllustration` component
- Add the illustration in a compact format for the archive view

#### 1.8 Clean Up Data Files
While we keep the emoji data in the data files (they may be used by AI agents or logs), we ensure the UI components don't display them:
- `src/data/ingredients.ts` - Keep emoji data for AI context
- `src/data/tools.ts` - Keep emoji data for AI context
- `src/data/orders.ts` - Keep emoji data for AI context

#### 1.9 Consider KitchenLog.tsx
The kitchen log shows `result.emoji` for alchemy results. Options:
- **Option A**: Keep emoji in text-based log (acceptable for terminal aesthetic)
- **Option B**: Remove and rely on result names only
- **Recommendation**: Keep emojis in the log - they enhance the terminal feel and are already used in the AI agent responses

#### 1.10 Remove/Mark dishColors.ts as deprecated
- The `getDishGradient` function is now only used as a loading state background
- We can simplify to a single neutral gradient or remove entirely

### Components That Call with Emoji Props - Updates Needed

| File | Props to Remove | Updates |
|------|-----------------|---------|
| OrderCard.tsx | `emoji` passed to DishIllustration | Remove prop |
| IngredientsPanel.tsx | `fallbackEmoji` passed to IngredientIllustration | Remove prop |
| TechniqueToggle.tsx | `fallbackEmoji` passed to TechniqueIllustration | Remove prop |
| ChefsSection.tsx | `fallbackEmoji` passed to ChefAvatar | Remove prop |

---

## Part 2: Expand Order Difficulty Levels and Dish Catalog

### 2.1 New Difficulty System

**Current Levels:**
- easy (3-5 steps)
- intermediate (5-8 steps)  
- hard (8+ steps)

**Expanded Levels:**
- **beginner** (1-2 steps) - Very simple dishes for quick wins
- **easy** (3-4 steps) - Simple dishes
- **intermediate** (5-7 steps) - Moderate complexity
- **hard** (8-10 steps) - Complex dishes
- **expert** (11-15 steps) - Multi-technique masterpieces
- **legendary** (16+ steps) - Epic culinary feats

### 2.2 Update Type Definitions

```typescript
// src/lib/types.ts
export type OrderDifficulty = 
  | 'beginner' 
  | 'easy' 
  | 'intermediate' 
  | 'hard' 
  | 'expert' 
  | 'legendary';
```

### 2.3 Update OrderCard.tsx Difficulty Config

Add styling for new difficulty levels:

```typescript
const difficultyConfig = {
  beginner: { label: 'BEGINNER', className: 'bg-beginner text-beginner-foreground' },
  easy: { label: 'EASY', className: 'bg-easy text-easy-foreground' },
  intermediate: { label: 'MED', className: 'bg-intermediate text-intermediate-foreground' },
  hard: { label: 'HARD', className: 'bg-hard text-hard-foreground' },
  expert: { label: 'EXPERT', className: 'bg-expert text-expert-foreground' },
  legendary: { label: 'LEGEND', className: 'bg-legendary text-legendary-foreground' },
};
```

### 2.4 Add CSS Variables for New Difficulty Colors

In `src/index.css`, add new color variables:

```css
:root {
  --beginner: 180 60% 45%;        /* Teal/cyan */
  --beginner-foreground: 0 0% 100%;
  --expert: 280 60% 55%;           /* Purple */
  --expert-foreground: 0 0% 100%;
  --legendary: 45 100% 50%;        /* Gold */
  --legendary-foreground: 0 0% 10%;
}
```

### 2.5 Expanded Order Templates

Significantly expand the dish catalog from 20 to 60+ dishes:

**Beginner (1-2 steps) - 8 dishes:**
- Sliced Apple
- Buttered Bread
- Glass of Milk
- Fresh Orange Juice
- Cheese Plate
- Mixed Nuts
- Fruit Bowl
- Toast with Jam

**Easy (3-4 steps) - 12 dishes:**
(Keep existing 6, add 6 more)
- Caprese Salad
- Boiled Rice
- Mashed Potatoes
- Guacamole
- Hummus
- Overnight Oats

**Intermediate (5-7 steps) - 14 dishes:**
(Keep existing 8, add 6 more)
- Pad Thai
- Shakshuka
- Eggs Benedict
- Risotto
- Pho
- Tom Yum Soup

**Hard (8-10 steps) - 12 dishes:**
(Keep existing 6, add 6 more)
- Croissants
- Dim Sum
- Tiramisu
- Soufflé
- Bouillabaisse
- Ratatouille

**Expert (11-15 steps) - 10 dishes:**
- Beef Bourguignon
- Cassoulet
- Paella
- Bibimbap
- Mole Poblano
- Xiaolongbao (Soup Dumplings)
- Baked Alaska
- Croquembouche
- Turducken
- Peking Duck (upgraded from hard)

**Legendary (16+ steps) - 8 dishes:**
- French Onion Soup Gratinée (from scratch)
- Homemade Ramen (48-hour broth)
- Seven-Layer Dip Supreme
- Wedding Cake
- Full English Breakfast
- Thanksgiving Feast
- Kaiseki Multi-Course
- Molecular Gastronomy Tasting Menu

### 2.6 Update Initial Orders Display

In `KitchenContext.tsx`, update the initial orders to show a varied selection:

```typescript
// Show 2 from each difficulty level initially
const initialOrders = [
  ...orderTemplates.filter(t => t.difficulty === 'beginner').slice(0, 1),
  ...orderTemplates.filter(t => t.difficulty === 'easy').slice(0, 2),
  ...orderTemplates.filter(t => t.difficulty === 'intermediate').slice(0, 2),
  ...orderTemplates.filter(t => t.difficulty === 'hard').slice(0, 1),
  ...orderTemplates.filter(t => t.difficulty === 'expert').slice(0, 1),
  ...orderTemplates.filter(t => t.difficulty === 'legendary').slice(0, 1),
].map(template => createOrder(template));
```

---

## Part 3: Update Pre-generation Hook

Update `usePreGenerateIllustrations.ts` to pre-generate illustrations for the new expanded dish set:

- Prioritize visible dishes (initial 8-10)
- Add staggered generation for remaining dishes
- Ensure new difficulty levels are covered

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/lib/types.ts` | Modify | Add new difficulty types |
| `src/data/orders.ts` | Modify | Expand to 60+ dishes with 6 difficulty levels |
| `src/components/kitchen/OrderCard.tsx` | Modify | Add difficulty config, remove emoji prop usage |
| `src/components/kitchen/DishIllustration.tsx` | Modify | Remove emoji prop, simplify fallback |
| `src/components/kitchen/ChefAvatar.tsx` | Modify | Remove fallbackEmoji prop |
| `src/components/kitchen/IngredientIllustration.tsx` | Modify | Remove fallbackEmoji prop |
| `src/components/kitchen/TechniqueIllustration.tsx` | Modify | Remove fallbackEmoji prop |
| `src/components/kitchen/IngredientsPanel.tsx` | Modify | Remove emoji prop from IngredientIllustration |
| `src/components/kitchen/TechniqueToggle.tsx` | Modify | Remove emoji prop from TechniqueIllustration |
| `src/components/kitchen/ChefsSection.tsx` | Modify | Remove fallbackEmoji prop from ChefAvatar |
| `src/components/kitchen/DishesArchive.tsx` | Modify | Replace emoji with DishIllustration |
| `src/components/tiles/IngredientTile.tsx` | Modify | Use IngredientIllustration component |
| `src/components/tiles/ToolTile.tsx` | Modify | Use TechniqueIllustration component |
| `src/context/KitchenContext.tsx` | Modify | Update initial orders selection |
| `src/hooks/usePreGenerateIllustrations.ts` | Modify | Update for expanded dishes |
| `src/index.css` | Modify | Add new difficulty level color variables |
| `src/lib/dishColors.ts` | Mark deprecated | Optional cleanup, simplify to loading gradient |

---

## Technical Notes

### Preserving Backward Compatibility

1. **Emoji data in source files**: The emoji field stays in `Ingredient`, `Tool`, `Order` types because:
   - AI agents may reference them in responses
   - Kitchen log may display them for results
   - They serve as semantic hints for the system

2. **Component interfaces**: Props are removed from UI components, but the underlying data structures remain unchanged

3. **Kitchen Log**: Emojis in the terminal log enhance the text-based aesthetic and come from AI responses, so they're preserved

### CSS Color Scheme for Difficulties

```text
Beginner: Teal/Cyan (fresh, approachable)
Easy: Green (existing)
Intermediate: Yellow/Amber (existing)
Hard: Orange/Red (existing)
Expert: Purple (prestigious)
Legendary: Gold (ultimate achievement)
```

---

## Testing Checklist

After implementation, verify:
- [ ] All illustration components show shimmer during loading
- [ ] AI-generated images display correctly when available
- [ ] No emoji/gradient fallbacks visible in UI (except kitchen log)
- [ ] All 6 difficulty levels display with correct styling
- [ ] New dishes appear in order queue
- [ ] Difficulty badges show correct labels and colors
- [ ] Pre-generation covers priority dishes from all levels
- [ ] DishesArchive shows dish illustrations instead of emojis
- [ ] No breaking changes to cooking loop or agent functionality
