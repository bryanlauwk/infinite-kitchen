
# Improve Cold vs Hot Cooking Sound Effect Separation

## Problem Analysis

The current sound system sometimes produces unrealistic audio by mixing heat-related sounds with cold preparation techniques. For example:
- Making a fruit salad might produce sizzling sounds
- Whisking a salad dressing could sound like pan-frying
- Cold preparations like "toss" with proteins might add "sizzling" modifiers

## Root Causes

1. **Incomplete cold technique list** - Many cold prep actions are not in the `coldTechniques` set
2. **Heat-contaminated ingredient modifiers** - Words like "sizzling", "crisping" appear in ingredient modifiers
3. **Missing cold-specific ingredient modifiers** - No dedicated sounds for cold ingredient contexts
4. **No ingredient temperature awareness** - The system doesn't consider if ingredients are being used in cold vs hot contexts

---

## Solution Overview

Enhance the sound system with a clear separation between "thermal zones":
- **Hot Zone**: Heat-based techniques (fry, grill, sauté, etc.)
- **Cold Zone**: Cold preparations (wash, toss, arrange, etc.)
- **Neutral Zone**: Techniques that could be either (whisk, mix, blend)

For neutral techniques, use ingredient context to determine which zone applies.

---

## Implementation Details

### File: `src/lib/sounds.ts`

**1. Expand the `coldTechniques` set**

Add missing cold preparation techniques:
- `chop`, `dice`, `slice`, `mince`, `julienne`, `cube` (cutting is typically cold)
- `shred`, `grate`, `fillet`, `debone`, `trim`
- `marinate`, `brine`, `pickle`, `soak`
- `stuff`, `roll`, `shape`
- `strain`, `drain`, `sift`
- `chill`, `freeze`, `thaw`, `room_temp`, `ice_bath`, `cool`

**2. Create a `hotTechniques` set**

Explicitly define heat-based techniques:
- `fry`, `saute`, `sear`, `grill`, `roast`, `bake`, `broil`, `braise`
- `boil`, `simmer`, `steam`, `poach`, `blanch`, `stew`
- `deep_fry`, `pan_fry`, `stir_fry`, `flash_fry`, `tempura`
- `flambe`, `smoke`, `char`, `toast`, `brown`, `crisp`, `render`
- `reduce`, `caramelize`, `deglaze`, `melt`

**3. Split ingredient modifiers by temperature context**

Create two separate modifier maps:
- `hotIngredientModifiers`: Heat-specific descriptions ("sizzling", "crisping", "browning")
- `coldIngredientModifiers`: Cold-specific descriptions ("crisp", "fresh", "chilled")

**4. Update `getSoundPrompt()` function**

Logic flow:
1. Check if technique is in `hotTechniques` → use hot modifiers only
2. Check if technique is in `coldTechniques` → use cold modifiers only  
3. For neutral techniques → analyze ingredients to determine context
4. Never mix hot modifiers with cold techniques

**5. Add ingredient temperature inference**

Create helper function to detect if ingredients suggest cold preparation:
- Fruits (strawberry, mango, etc.) → likely cold
- Raw salad vegetables (lettuce, cucumber) → likely cold
- Proteins + heat technique → likely hot

---

### File: `src/hooks/useSoundEffects.ts`

**Update `getActionDuration()` function**

Refine duration logic to consider cold vs hot:
- Cold preparations are generally quicker and quieter (2 seconds)
- Hot techniques need longer for realistic sizzle/bubble sounds (3-4 seconds)
- Neutral techniques get medium duration (2-3 seconds)

---

## Technical Summary

| File | Changes |
|------|---------|
| `src/lib/sounds.ts` | Add `hotTechniques` set, expand `coldTechniques`, split ingredient modifiers, update `getSoundPrompt()` with temperature-aware logic |
| `src/hooks/useSoundEffects.ts` | Refine duration calculation for cold/hot/neutral techniques |

---

## Expected Outcome

After implementation:
- Fruit salads will have soft, crisp cutting and gentle tossing sounds
- Grilled steaks will have proper sizzling and charring sounds
- Whisking will sound different for cold dressings vs hot sauces
- No more jarring "sizzling onion" sounds when making a cold salad
