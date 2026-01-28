

# Enhanced Recook & Feedback Loop with Cuisine-Aware Recipe Search

## Overview

Improve the recook system to be smarter about cuisine context and allow customer feedback to guide subsequent cooking attempts. When confidence is below 95%, automatically offer recooking with customer input.

---

## Key Features

### 1. Cuisine Detection & Context

Detect cuisine type from dish names and provide cuisine-specific cooking guidance on recook attempts.

**Cuisine Categories (from existing dish catalog):**
- **Malaysian**: Nasi Lemak, Laksa, Char Kway Teow, Rendang, etc.
- **Thai**: Pad Thai, Tom Yum, Green Curry, Khao Soi, etc.
- **Vietnamese**: Pho, Banh Mi, Goi Cuon, Bun Bo Hue, etc.
- **Indonesian**: Nasi Goreng, Soto Ayam, Gudeg, Rijsttafel, etc.
- **Generic**: French, Italian, Japanese, etc.

### 2. Customer Feedback Input

Allow customers to add feedback when requesting a recook. This feedback gets incorporated into the Chef de Cuisine's context for the next attempt.

### 3. Auto-Recook Prompt for Low Confidence

When the Expeditor returns a match with confidence below 95%, automatically show a "Request Recook" option with feedback input, even for technically "matched" dishes.

---

## Implementation Plan

### File Changes Summary

| File | Purpose |
|------|---------|
| `src/lib/cuisineDetector.ts` | New utility to detect cuisine from dish name |
| `src/lib/types.ts` | Add `customerFeedback` field to Order and PreviousAttempt |
| `src/context/KitchenContext.tsx` | Update `recookOrder` to accept optional feedback |
| `src/components/kitchen/DishesArchive.tsx` | Add feedback input dialog for recook |
| `src/components/kitchen/RecookDialog.tsx` | New component for recook feedback form |
| `supabase/functions/cooking-agent/index.ts` | Add cuisine context + customer feedback to prompt |
| `src/hooks/useCookingLoop.ts` | Auto-offer recook for < 95% confidence matches |

---

## Technical Details

### 1. Cuisine Detector Utility

**New File: `src/lib/cuisineDetector.ts`**

```text
Function: detectCuisine(dishName: string) => CuisineInfo

Returns:
- type: 'malaysian' | 'thai' | 'vietnamese' | 'indonesian' | 'japanese' | 'french' | 'italian' | 'generic'
- region: 'southeast_asian' | 'east_asian' | 'european' | 'american' | 'other'
- cookingHints: string[] (cuisine-specific techniques and flavor profiles)

Example:
detectCuisine("Nasi Lemak Ayam")
=> {
  type: 'malaysian',
  region: 'southeast_asian',
  cookingHints: [
    "Use coconut milk for rice",
    "Include sambal, fried anchovies, peanuts",
    "Aromatic with pandan leaves"
  ]
}
```

### 2. Type Updates

**File: `src/lib/types.ts`**

Add new fields:

```text
interface PreviousAttempt {
  servedDish: string;
  reasoning: string;
  timestamp: number;
  customerFeedback?: string;  // NEW: What the customer wanted changed
}

interface Order {
  ...existing fields...
  customerFeedback?: string;  // NEW: Feedback for next attempt
}
```

### 3. Enhanced Recook Context

**File: `src/context/KitchenContext.tsx`**

Update `recookOrder` function:

```text
recookOrder(orderId: string, feedback?: string)
- Store feedback in order.customerFeedback
- Add feedback to previousAttempts array entry
```

### 4. Recook Dialog Component

**New File: `src/components/kitchen/RecookDialog.tsx`**

A dialog that appears when user clicks "Try Again":
- Shows what was served vs. what was ordered
- Shows the Expeditor's reasoning for rejection
- Text input for customer feedback (optional)
- "Just Retry" button (no feedback)
- "Retry with Notes" button (with feedback)

### 5. DishesArchive Updates

**File: `src/components/kitchen/DishesArchive.tsx`**

Changes:
- Replace direct `recookOrder` call with dialog trigger
- Show RecookDialog when "Try Again" is clicked
- For low-confidence matches (< 95%), add subtle "Request Improvement" option

### 6. Cooking Agent Cuisine-Aware Prompt

**File: `supabase/functions/cooking-agent/index.ts`**

Enhanced system prompt when recooking:

```text
ORDER TO FULFILL: 🍚 Nasi Lemak Ayam

CUISINE CONTEXT: Malaysian (Southeast Asian)
- Cook rice with coconut milk and pandan
- Traditional components: sambal, anchovies, peanuts, cucumber, egg
- Balance of spicy, savory, and aromatic flavors

PREVIOUS ATTEMPTS (FAILED):
- Attempt 1: Served "Coconut Rice with Chicken" - Rejected because: Missing key Malaysian components like sambal

CUSTOMER FEEDBACK:
"Please include proper sambal and don't forget the fried anchovies"

IMPORTANT: Consider the cuisine-specific techniques and customer feedback. Try a more authentic approach this time.
```

### 7. Auto-Prompt for Low Confidence

**File: `src/hooks/useCookingLoop.ts`**

After judge evaluation:
- If `match: true` but `confidence < 95`:
  - Mark as `verified` but show subtle improvement prompt
  - Add timeline event: "Dish accepted, but could be improved"
  - Store a flag on the order: `improvable: true`

**File: `src/components/kitchen/DishesArchive.tsx`**

- For dishes with `improvable: true`, show "Request Improvement" option
- Opens same RecookDialog but with gentler messaging

---

## User Flow Examples

### Flow 1: Standard Rejection with Feedback

1. User orders "Beef Rendang"
2. Chef serves "Beef Curry" (wrong dish)
3. Expeditor rejects: "Missing dry-fried texture characteristic of rendang"
4. Dish appears in archive with "Try Again" button
5. User clicks "Try Again"
6. Dialog opens showing rejection reason
7. User adds: "Please cook it longer until dry"
8. User clicks "Retry with Notes"
9. Dish returns to queue with feedback attached
10. Chef receives cuisine context (Indonesian) + feedback in prompt
11. Chef tries different approach with extended cooking time

### Flow 2: Low Confidence Match with Improvement

1. User orders "Pad Thai"
2. Chef serves "Thai Stir-fried Noodles"
3. Expeditor approves at 82% confidence: "Similar but lacks traditional tamarind tanginess"
4. Dish appears verified but with subtle "Could be better" indicator
5. User can optionally request improvement
6. If requested, same recook flow with feedback input

---

## Expected Improvements

| Scenario | Before | After |
|----------|--------|-------|
| Malaysian dish recook | Generic retry | Cuisine-aware hints (coconut milk, sambal, pandan) |
| Customer complaint | No way to specify | Feedback input dialog |
| 85% confidence match | Treated as success | Option to request improvement |
| 3rd attempt on same dish | Same approach | Accumulated context from all failures + feedback |

