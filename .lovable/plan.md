

# Add Recook Function & Verify Agent Pipeline

## Current State Analysis

### Recook Function
The backend logic for recooking already exists in `KitchenContext.tsx`:
- `recookOrder(orderId)` resets a dish to `not_started` status
- Tracks `recookCount` for attempt numbering
- Preserves `previousAttempts` array with failed dish details

**Missing**: The UI for rejected dishes doesn't expose the recook button. Rejected dishes go to `DishesArchive` but there's no way to retry them.

### Agent System Status

| Agent | Edge Function | Status |
|-------|---------------|--------|
| Chef de Cuisine (cooking-agent) | 384 lines, 102 cooking tools | Working - uses Gemini 3 Flash, function calling |
| Sous Chef (alchemy-agent) | 203 lines | Working - determines transformation results with tool calling |
| Expeditor (judge-agent) | 160 lines | Working - semantic validation with tool calling |

All three agents are properly implemented with:
- Lovable AI Gateway integration
- Tool calling (function calling) for structured output
- Fallback parsing if tool calls fail
- Rate limit handling (429/402)

---

## Implementation Plan

### 1. Add Recook Button for Rejected Dishes

**File: `src/components/kitchen/DishesArchive.tsx`**

Add a "Recook" button that appears only for rejected dishes. When clicked:
- Calls `recookOrder(orderId)` from KitchenContext
- The dish moves back to the OrderQueue with `status: 'not_started'`
- User can then click "Summon" to retry

The button should:
- Only appear for `status === 'rejected'`
- Be styled subtly (secondary variant)
- Show attempt count if recooking

### 2. Enhance Cooking Agent with Previous Attempt Context

**File: `supabase/functions/cooking-agent/index.ts`**

When recooking, the agent should know why the previous attempt failed. Update the system prompt to include:
- Previous attempt information from the order object
- The reasoning from the judge that rejected it
- A hint to try a different approach

This helps the Chef de Cuisine avoid making the same mistake twice.

### 3. Add Visual Feedback for Recook Attempts

**File: `src/components/kitchen/OrderCard.tsx`**

The attempt indicator (`#{order.recookCount + 1}`) already exists but only shows when `recookCount > 0`. Verify this displays correctly when a dish returns to the queue after recooking.

---

## Technical Details

### DishesArchive Updates

```text
For each rejected dish:
├── Current: Shows "Something felt off." text
└── New: Add "Try Again" button that:
    ├── Calls recookOrder(dish.id)
    ├── Shows toast: "Dish returned to orders"
    └── Triggers re-render as dish moves to OrderQueue
```

### Cooking Agent Context Enhancement

Update the system prompt construction to check for previousAttempts:

```text
Current prompt:
"ORDER TO FULFILL: {emoji} {dishName}"

Enhanced prompt (when recooking):
"ORDER TO FULFILL: {emoji} {dishName}
PREVIOUS ATTEMPTS:
- Attempt 1: Served '{servedDish}' - Rejected because: {reasoning}
Please try a different approach this time."
```

### Agent Names Consistency

Update the ChefsSection labels to match the specification:
- "The Alchemist Unit" → "Chef de Cuisine"
- "The Transmuter Core" → "Sous Chef"  
- "The Oracle Module" → "Expeditor"

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/components/kitchen/DishesArchive.tsx` | Add recook button for rejected dishes |
| `supabase/functions/cooking-agent/index.ts` | Include previous attempts in system prompt when recooking |
| `src/components/kitchen/ChefsSection.tsx` | Update agent display names to match specification |

---

## Expected Behavior After Implementation

1. User cooks a dish → rejected by Expeditor
2. Dish appears in "Dishes Served" with "Try Again" button
3. User clicks "Try Again"
4. Dish moves back to OrderQueue with attempt #2 indicator
5. User clicks "Summon" to retry
6. Chef de Cuisine sees the previous failure and tries a different approach
7. If successful, Expeditor approves and customer review is generated

