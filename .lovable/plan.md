

# Fix Infinite Cooking Loop + Add Kitchen Sound Effects

## Overview

This plan addresses two issues:

1. **Critical Bug**: The cooking loop runs infinitely because conversation history is not being passed between iterations
2. **New Feature**: Add real-world sound effects for cooking actions and ambient kitchen background sounds

---

## Part 1: Fix the Infinite Cooking Loop

### Root Cause Analysis

In `src/hooks/useCookingLoop.ts`, the `conversationHistory` variable is:
- Created as an empty local array (line 42)
- Never updated within the loop - messages are added to React state via `addConversationMessage`, but the LOCAL array passed to `callCookingAgent` remains empty
- Result: Every AI call has no memory of previous steps, causing repetitive actions

### Solution

Update the local `conversationHistory` array in sync with the React state updates:

```text
Line 42:   const conversationHistory: ConversationMessage[] = [];
                    ↓
After each message:  conversationHistory.push({ role, content, name? })
```

**Changes to `useCookingLoop.ts`:**

1. After calling `addConversationMessage` for assistant (around line 83), also push to local array:
   ```typescript
   conversationHistory.push({
     role: 'assistant',
     content: cookingResponse.thinking || '',
   });
   ```

2. After calling `addConversationMessage` for function result (around line 195), also push to local array:
   ```typescript
   conversationHistory.push({
     role: 'function',
     name: actionName,
     content: `Result: ${alchemyResult.emoji} ${alchemyResult.resultName}...`,
   });
   ```

This ensures the AI remembers what it has already done and progresses toward completion.

---

## Part 2: Add Sound Effects System

### Architecture

Create a sound effects system using ElevenLabs SFX generation with caching:

```text
User clicks "Cook"
       ↓
Start background ambience (looped)
       ↓
For each cooking action:
  → Map action to sound category
  → Play appropriate sound effect
       ↓
On serve: Play success/bell sound
On judge verdict: Play stamp/chime sound
       ↓
Fade out background ambience
```

### New Files

#### 1. `supabase/functions/elevenlabs-sfx/index.ts`

Edge function to generate sound effects using ElevenLabs API:

```typescript
// Request: { prompt: "sizzling pan with oil", duration: 3 }
// Response: Binary audio/mpeg
```

#### 2. `src/hooks/useSoundEffects.ts`

React hook to manage sound playback:

```typescript
export function useSoundEffects() {
  // Background ambience (loops continuously while cooking)
  const startAmbience: () => void
  const stopAmbience: () => void
  
  // Action sounds (one-shot based on cooking action)
  const playActionSound: (action: string) => Promise<void>
  
  // UI sounds
  const playServeSound: () => void
  const playSuccessSound: () => void
  const playErrorSound: () => void
}
```

#### 3. `src/lib/sounds.ts`

Sound configuration mapping cooking actions to prompts:

```typescript
// Map cooking actions to ElevenLabs prompts
export const actionSounds: Record<string, string> = {
  // Heat actions
  grill: "sizzling meat on a hot grill with crackling fire",
  pan_fry: "sizzling frying pan with hot oil and food cooking",
  saute: "gentle sizzling in a pan with wooden spoon stirring",
  boil: "bubbling boiling water in a pot",
  simmer: "gentle simmering liquid with occasional bubbles",
  deep_fry: "intense bubbling oil deep frying food",
  
  // Cutting actions
  chop: "sharp knife chopping vegetables on cutting board",
  dice: "rhythmic knife dicing on wooden cutting board",
  slice: "knife slicing through food cleanly",
  
  // Mixing actions
  whisk: "wire whisk beating eggs in a metal bowl",
  stir: "wooden spoon stirring in a pot",
  blend: "electric blender whirring and mixing",
  
  // etc...
};

export const ambiencePrompt = "busy restaurant kitchen background ambience with distant cooking sounds and kitchen activity";
```

### Sound Categories

| Category | Actions | Sound Character |
|----------|---------|-----------------|
| Heat | grill, fry, saute, sear | Sizzling, crackling |
| Liquid | boil, simmer, poach | Bubbling, splashing |
| Cutting | chop, dice, slice, mince | Sharp, rhythmic |
| Mixing | whisk, stir, beat, blend | Whisking, clinking |
| Prep | crack, crush, pound | Impact, breaking |
| Finish | plate, garnish, serve | Gentle, chime |

### Integration Points

**In `useCookingLoop.ts`:**

1. Before loop starts: `startAmbience()`
2. After each action timeline event: `playActionSound(actionName)`  
3. On serve: `playServeSound()`
4. On judge success: `playSuccessSound()`
5. On judge failure: `playErrorSound()`
6. In finally block: `stopAmbience()`

### Caching Strategy

To avoid repeated API calls for the same sounds:
- Cache generated audio blobs in memory (Map<string, Blob>)
- Fallback sounds for common actions if API fails
- Use shorter durations (2-4 seconds) for quick feedback

---

## Part 3: Required Secret

The ElevenLabs API requires an API key:

**Secret Name:** `ELEVENLABS_API_KEY`

This will need to be added before the sound effects feature works.

---

## File Changes Summary

### Modified Files

| File | Changes |
|------|---------|
| `src/hooks/useCookingLoop.ts` | Fix conversation history bug + integrate sound effects |
| `supabase/config.toml` | Add elevenlabs-sfx function config |

### New Files

| File | Purpose |
|------|---------|
| `supabase/functions/elevenlabs-sfx/index.ts` | ElevenLabs SFX generation endpoint |
| `src/hooks/useSoundEffects.ts` | Sound playback management hook |
| `src/lib/sounds.ts` | Action-to-sound mapping configuration |

---

## Implementation Order

1. **Fix the bug first** - Update `useCookingLoop.ts` to properly track conversation history
2. **Add sound infrastructure** - Create the edge function and hooks
3. **Request API key** - Prompt user to add `ELEVENLABS_API_KEY`
4. **Integrate sounds** - Wire up the cooking loop with sound effects

---

## Technical Notes

- Sound effects use ElevenLabs' text-to-SFX API (up to 22 seconds)
- Background ambience loops using Web Audio API
- Sounds are loaded/played asynchronously to not block the cooking loop
- Volume controls can be added later for user preference
- All sounds respect browser autoplay policies (start after user interaction)

