

# Sound Effects & Discovery System Fix

## Overview

This plan addresses two critical issues:
1. **ElevenLabs Sound Effects**: Ensure sounds are generated correctly and match realistic cooking scenarios (no generic sounds)
2. **Ingredient Discovery**: Verify that only true base ingredient discoveries are added to the permanent ingredient list

---

## Current State Analysis

### Sound Effect System
The ElevenLabs integration has the correct structure but has potential issues:
- The `ELEVENLABS_API_KEY` secret is configured (verified)
- The edge function is properly structured with correct API endpoint
- Sound prompts are well-defined with 100+ technique-specific descriptions
- Cold vs hot technique distinction exists in `coldTechniques` set

**Potential Issues Identified:**
1. No error handling for empty audio responses from ElevenLabs
2. The `fetchSound` silently fails without user feedback
3. Duration calculations in `getActionDuration` don't include all cold prep techniques
4. Missing some cold prep techniques in the duration calculation

### Discovery System
The alchemy agent has `isDiscovery` classification, but:
- The discovery logic in `useCookingLoop.ts` is correct (only adds to inventory if `isDiscovery: true`)
- The InventoryPanel correctly filters by `isGenerated` flag
- The timeline shows discoveries with special styling

---

## Part 1: Sound Effect System Improvements

### 1.1 Enhanced Error Handling in Edge Function

Update `supabase/functions/elevenlabs-sfx/index.ts` to provide better error feedback:

```typescript
// Add validation for response size (empty audio = failed generation)
const audioBuffer = await response.arrayBuffer();

if (audioBuffer.byteLength < 1000) {
  console.error('Audio response too small, likely failed generation');
  return new Response(
    JSON.stringify({ error: 'Sound generation failed - audio too short' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

### 1.2 Better Client-Side Error Feedback

Update `src/hooks/useSoundEffects.ts` to:
- Log more detailed errors for debugging
- Check response content-type before treating as audio
- Add graceful degradation when sounds fail

```typescript
const fetchSound = useCallback(async (prompt: string, duration: number = 3): Promise<Blob | null> => {
  // ... existing cache check ...

  try {
    const response = await fetch(/* ... */);

    if (!response.ok) {
      console.warn('SFX fetch failed:', response.status, await response.text());
      return null;
    }

    // Verify we got audio, not JSON error
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const error = await response.json();
      console.warn('SFX generation error:', error);
      return null;
    }

    const blob = await response.blob();
    
    // Validate audio size (sanity check)
    if (blob.size < 1000) {
      console.warn('SFX audio too small, likely failed');
      return null;
    }

    soundCache.set(cacheKey, blob);
    return blob;
  } catch (error) {
    console.warn('SFX fetch error:', error);
    return null;
  }
}, []);
```

### 1.3 Complete Cold Technique Duration Mapping

Update `getActionDuration` in `useSoundEffects.ts` to include ALL cold prep techniques:

```typescript
function getActionDuration(action: string): number {
  const normalized = action.toLowerCase();
  
  // Cold/quick preparations (2 seconds)
  if (/toss|combine|arrange|plate|drizzle|sprinkle|wash|clean|dry|assemble|layer/.test(normalized)) {
    return 2;
  }
  if (/peel|core|hull|segment|pit|scoop|zest|squeeze|muddle|rinse/.test(normalized)) {
    return 2;
  }
  if (/garnish|slice_fruit|mix_salad/.test(normalized)) {
    return 2;
  }
  
  // Quick actions (2 seconds)
  if (/crack|chop|dice|slice|score|flip|season|press/.test(normalized)) {
    return 2;
  }
  
  // Medium actions (3 seconds)
  if (/sear|saute|whisk|stir|fold|mix|blend|mash|scramble/.test(normalized)) {
    return 3;
  }
  
  // Longer continuous actions (4 seconds)
  if (/boil|simmer|roast|bake|braise|reduce|stew|fry|grill/.test(normalized)) {
    return 4;
  }
  
  // Default
  return 3;
}
```

### 1.4 Add Missing Cold Prep Sounds

Add any missing cold preparation techniques to `src/lib/sounds.ts`:

```typescript
// Add to techniqueSounds
cut: "knife cutting through food on cutting board",
prep: "general food preparation sounds, gentle kitchen work",
prepare: "quiet preparation, gathering ingredients",
portion: "dividing food into portions, careful cutting",
separate: "gently separating components, soft pulling apart",
extract: "extracting component from food, careful separation",
```

---

## Part 2: Discovery System Verification

### 2.1 Update Alchemy Agent Prompt (Clarify Discovery Rules)

The current alchemy agent prompt is good but can be strengthened. Update `supabase/functions/alchemy-agent/index.ts`:

```typescript
const systemPrompt = `You are an alchemy agent that determines what happens when cooking actions are performed on ingredients.

You must respond with a JSON object describing the result AND classify whether this result reveals a new BASE ingredient.

IMPORTANT: isDiscovery should be TRUE only in rare cases:
- Separating an egg reveals egg yolk and egg white (hidden components)
- Clarifying butter produces ghee (extracted pure ingredient)
- Zesting a lemon produces lemon zest (separated component)
- Cracking a coconut reveals coconut water and coconut meat

isDiscovery should be FALSE for:
- Any cooked result (scrambled eggs, grilled chicken, sautéed vegetables)
- Any mixed result (fruit salad, mixed greens, combined ingredients)
- Any transformed dish (toast, soup, sauce, puree)
- Any intermediate cooking step (whisked eggs, seared beef, chopped onions)

Most actions result in isDiscovery: false. Only true component extraction/separation = discovery.

Be creative but realistic. Consider:
- What would actually happen when you ${action} these ingredients?
- What is the resulting food item called?
- Pick an appropriate emoji that represents the result
- Give a brief poetic description (under 10 words)`;
```

### 2.2 Strengthen Discovery Classification in Tool Schema

Update the tool description to be more explicit:

```typescript
isDiscovery: {
  type: "boolean",
  description: "Almost always FALSE. Only TRUE when revealing hidden sub-components (like separating egg → yolk/white, or clarifying butter → ghee). FALSE for all cooking steps, dishes, and combinations."
}
```

---

## Part 3: PRD Microcopy Updates

Based on the provided PRD, update component text to match the desired tone.

### 3.1 Update InventoryPanel Headers

```typescript
// In InventoryPanel.tsx
<h2 className="font-bold uppercase text-sm tracking-wide">Ingredients Found</h2>
<p className="text-xs text-muted-foreground">
  Things the kitchen seems to know now.
</p>

// Techniques section
<h2 className="font-bold uppercase text-sm tracking-wide">Techniques</h2>
<p className="text-xs text-muted-foreground">
  Ways the kitchen behaves.
</p>
```

### 3.2 Update Discovery Labels

Change from "NEW" badge to something more subtle per PRD (no gamification):

```typescript
// In IngredientTile.tsx - Remove "NEW" badge for subtler indication
// Just use the styling without explicit "NEW" text
{isNew && (
  <span className="w-1.5 h-1.5 rounded-full bg-gemini animate-pulse" />
)}
```

---

## File Changes Summary

| File | Changes | Purpose |
|------|---------|---------|
| `supabase/functions/elevenlabs-sfx/index.ts` | Add audio size validation | Catch failed generations |
| `src/hooks/useSoundEffects.ts` | Add content-type check, fix duration mapping | Better error handling, complete cold prep support |
| `src/lib/sounds.ts` | Add missing cold prep techniques | Complete technique coverage |
| `supabase/functions/alchemy-agent/index.ts` | Strengthen discovery prompt | Reduce false discovery classifications |
| `src/components/kitchen/InventoryPanel.tsx` | Update microcopy | Match PRD tone |
| `src/components/tiles/IngredientTile.tsx` | Subtle discovery indicator | Remove gamification language |

---

## Testing Plan

After implementation:

1. **Sound Effects Test**
   - Order "Fruit Salad" and verify sounds are: washing, peeling, slicing, tossing (no sizzling)
   - Order "Scrambled Eggs" and verify sounds include: cracking, whisking, sizzling
   - Check console for any SFX errors

2. **Discovery Test**
   - Cook multiple dishes and verify "Newly Discovered" section remains empty for normal cooking
   - If the AI ever uses "separate" or "clarify" actions, those should add discoveries
   - Intermediate results like "whisked eggs" should NOT appear in permanent inventory

3. **Microcopy Test**
   - Verify all panel headers match PRD language
   - Confirm no "success/failure" language appears

