
# Infinite Kitchen UI Transformation Plan

## Overview

This plan addresses four major changes:
1. **UI Transformation** - Match the reference image's playful, neal.fun-like aesthetic
2. **Sound Effect System** - Fix ElevenLabs integration and allow API key re-entry
3. **Agent Function Calling** - Improve reliability to prevent cooking flow failures
4. **Recook Feature** - Add ability to retry rejected dishes

---

## Part 1: UI Transformation (Reference Image Match)

The reference image shows a distinct visual style:
- **Warm cream/off-white background** instead of pure white
- **Rounded pastel card backgrounds** for orders (with dish illustrations)
- **Difficulty badges** (EASY) in colored corner labels
- **"Summon" buttons** instead of "Cook"
- **Three-column layout**: Ingredients (left), Orders (center), Techniques (right)
- **"The Chefs of Reality"** section with agent avatars
- **Audio toggle** button in header
- **Hero banner** with whimsical welcome message

### 1.1 Layout Restructure

Reorganize from vertical stacking to the three-panel + agents layout:

```text
+------------------------------------------------------------------+
|  INFINITE KITCHEN                                    [Audio]      |
|  A culinary sandbox powered by impossible & endless possibilities.|
+------------------------------------------------------------------+
|  [=================== HERO BANNER ====================]          |
|  Welcome, flavor czars! Your function: beyond of dream. meal     |
+------------------------------------------------------------------+
|  INGREDIENTS  |  THE ORDERS OF THE UNIVERSE         |  TECHNIQUES |
|  ☐ Flour      |  [Card] [Card] [Card] [Card]        |  🍳 fry()   |
|  ☐ Egg        |  [Card] [Card] [Card] [Card]        |  🔪 chop()  |
|  ...          |                                      |  ...        |
+--------------+--------------------------------------+--------------+
|              THE CHEFS OF REALITY                                 |
|  [Alchemist]      [Skies Conf]       [Noodle Weaver]             |
+------------------------------------------------------------------+
|  KITCHEN LOG                                       count: ????    |
|  > log entries...                                                 |
+------------------------------------------------------------------+
```

### 1.2 Color Palette Updates (index.css)

```css
:root {
  /* Warm cream background */
  --background: 45 30% 96%;
  
  /* Softer off-white cards */
  --card: 45 40% 99%;
  
  /* Hero banner - warm yellow */
  --hero: 45 80% 92%;
  
  /* Difficulty badges */
  --easy: 142 71% 45%;
  --intermediate: 45 93% 47%;
  --hard: 0 84% 60%;
  
  /* Summon button - coral/salmon */
  --summon: 16 85% 60%;
}
```

### 1.3 Order Cards with Visual Style

Update `OrderCard.tsx` to match reference:
- Rounded corners with subtle shadow
- Difficulty badge in top-left corner
- Larger dish emoji display area with background
- "Summon" button with coral/salmon color
- Status text ("Not started")

### 1.4 Header with Audio Toggle

Add audio toggle button to header that controls the sound system:

```tsx
// Header.tsx
<header className="flex justify-between items-start px-6 py-4">
  <div>
    <h1 className="text-2xl font-bold">INFINITE KITCHEN</h1>
    <p>A culinary sandbox powered by impossible & endless possibilities.</p>
  </div>
  <Button variant="outline" onClick={toggleSounds}>
    {isEnabled ? <Volume2 /> : <VolumeX />}
    Audio
  </Button>
</header>
```

### 1.5 Three-Column Layout

Update `Index.tsx` to use CSS grid for the three-panel layout:
- Left column: Ingredients (checkbox list style)
- Center column: Orders grid (2x4 cards)
- Right column: Techniques (function-style list)

### 1.6 Hero Banner Update

More whimsical, procedural message:

```tsx
<section className="bg-hero rounded-xl mx-6 my-4 px-6 py-4 text-center">
  <p className="text-lg">
    Welcome, flavor czars! Your function: beyond of dream. 🧑‍🍳 meal 👨‍🍳
  </p>
</section>
```

### 1.7 Agent Section ("The Chefs of Reality")

Redesign the Kitchen Staff section:
- Horizontal card layout with avatar images (emoji-based)
- Quirky descriptions
- "Observe" / "Open" / "Upgrade" buttons

---

## Part 2: Sound Effect System Fix

### 2.1 Allow ElevenLabs API Key Re-entry

Add a settings mechanism to update the API key:

```tsx
// Create AudioSettings component with key management
const AudioSettings = () => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Volume2 /> Audio
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={toggleSounds}>
          {isEnabled ? 'Mute' : 'Unmute'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowKeyInput(true)}>
          Update API Key
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

Use the `add_secret` tool to prompt for ELEVENLABS_API_KEY update.

### 2.2 Improve Sound System Reliability

**Edge Function (`elevenlabs-sfx/index.ts`):**
- Already has validation for audio size
- Add retry logic with exponential backoff
- Add more specific error messages

**Client Hook (`useSoundEffects.ts`):**
- Add timeout handling (10 second max wait)
- Add queue system to prevent sound overlap
- Better error logging for debugging

---

## Part 3: Agent Function Calling Improvements

The cooking flow can fail when:
1. **Cooking Agent** returns no function call (just text)
2. **Alchemy Agent** fails to parse tool call response
3. **Judge Agent** has no fallback for missing tool calls

### 3.1 Cooking Agent Improvements

Update `supabase/functions/cooking-agent/index.ts`:

```typescript
// Force function calling with tool_choice
body: JSON.stringify({
  model: "google/gemini-3-flash-preview",
  messages,
  tools,
  tool_choice: "required",  // Force a tool call every time
  temperature: 0.7,
}),

// Better handling when no tool call returned
if (!toolCalls || toolCalls.length === 0) {
  // Extract action from text content as fallback
  const content = message.content || "";
  const actionMatch = content.match(/(\w+)\s*\(\s*\[(.*?)\]\s*\)/);
  
  if (actionMatch) {
    return {
      thinking: content,
      functionCall: {
        name: actionMatch[1],
        ingredients: actionMatch[2].split(',').map(s => s.trim().replace(/['"]/g, ''))
      },
      isComplete: actionMatch[1] === 'serve'
    };
  }
  
  // Last resort: auto-serve with available ingredients
  return {
    thinking: content + "\n\n[Auto-completing due to missing function call]",
    functionCall: {
      name: 'serve',
      ingredients: [inventory[inventory.length - 1]?.id || 'dish']
    },
    isComplete: true
  };
}
```

### 3.2 Alchemy Agent Improvements

The alchemy agent already has good fallback logic. Strengthen it:

```typescript
// Existing fallback is good, but add clearer logging
if (!result) {
  console.log("Generating fallback result for:", action, ingredients);
  result = {
    resultName: `${action.charAt(0).toUpperCase() + action.slice(1)}ed ${ingredientNames}`,
    resultId: `${action}_result_${Date.now()}`,
    emoji: ingredients[0]?.emoji || '🍳',
    description: `The result of ${action}`,
    isDiscovery: false
  };
}
```

### 3.3 Judge Agent Improvements

Add fallback logic similar to alchemy agent:

```typescript
if (!toolCalls || toolCalls.length === 0) {
  // Try to parse from text content
  const content = data.choices?.[0]?.message?.content || "";
  const matchLower = content.toLowerCase();
  
  const match = matchLower.includes('yes') || 
                matchLower.includes('match') || 
                matchLower.includes('fulfill');
  
  return new Response(JSON.stringify({
    match: match,
    confidence: 70,
    reasoning: content.slice(0, 100) || "Evaluated based on dish similarity"
  }), { ... });
}
```

### 3.4 Cooking Loop Error Recovery

Update `useCookingLoop.ts` to handle failures more gracefully:

```typescript
// Add retry logic for agent calls
const callWithRetry = async (fn: () => Promise<any>, maxRetries = 2) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};

// Use in loop
const cookingResponse = await callWithRetry(() => 
  callCookingAgent(currentInventory, order, conversationHistory)
);
```

Also add: if no function call after 3 consecutive iterations, auto-serve with the last created ingredient.

---

## Part 4: Recook Feature for Rejected Dishes

### 4.1 Update Types

Add `recookCount` to Order type:

```typescript
interface Order {
  // ... existing
  recookCount?: number;
  previousAttempts?: Array<{
    servedDish: string;
    reasoning: string;
    timestamp: number;
  }>;
}
```

### 4.2 Add Recook to KitchenContext

```typescript
const recookOrder = useCallback((orderId: string) => {
  setOrders(prev => prev.map(order => 
    order.id === orderId 
      ? { 
          ...order, 
          status: 'not_started' as const,
          recookCount: (order.recookCount || 0) + 1,
          previousAttempts: [
            ...(order.previousAttempts || []),
            {
              servedDish: order.servedDish || '',
              reasoning: order.judgeResult?.reasoning || '',
              timestamp: Date.now()
            }
          ],
          // Keep the original dish name
          judgeResult: undefined,
          servedDish: undefined,
          review: undefined,
        }
      : order
  ));
}, []);
```

### 4.3 Update DishesArchive with Recook Button

For rejected dishes, show a "Recook" button:

```tsx
{dish.status === 'rejected' && (
  <div className="ml-9 mt-3 flex items-center gap-3">
    <span className="text-xs text-muted-foreground">
      Something felt off.
    </span>
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => recookOrder(dish.id)}
    >
      Recook
    </Button>
  </div>
)}
```

### 4.4 Update OrderCard for Recook State

Show recook indicator if order has been attempted before:

```tsx
{order.recookCount && order.recookCount > 0 && (
  <div className="text-xs text-muted-foreground text-center">
    Attempt {order.recookCount + 1}
  </div>
)}
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/index.css` | Modify | Update color palette for warm cream theme |
| `src/pages/Index.tsx` | Modify | Restructure to three-column layout |
| `src/components/kitchen/Header.tsx` | Modify | Add audio toggle, update styling |
| `src/components/kitchen/HeroBanner.tsx` | Modify | Whimsical procedural message |
| `src/components/kitchen/OrderQueue.tsx` | Modify | Grid layout for order cards |
| `src/components/kitchen/OrderCard.tsx` | Modify | Visual redesign with difficulty badges |
| `src/components/kitchen/InventoryPanel.tsx` | Modify | Split into sidebar layout with checkboxes |
| `src/components/kitchen/KitchenStaff.tsx` | Modify | Horizontal "Chefs of Reality" section |
| `src/components/kitchen/DishesArchive.tsx` | Modify | Add Recook button for rejected dishes |
| `src/context/KitchenContext.tsx` | Modify | Add recookOrder function |
| `src/lib/types.ts` | Modify | Add recookCount to Order |
| `supabase/functions/cooking-agent/index.ts` | Modify | Force tool calls, add fallbacks |
| `supabase/functions/judge-agent/index.ts` | Modify | Add fallback parsing |
| `src/hooks/useCookingLoop.ts` | Modify | Add retry logic, auto-serve fallback |
| `src/hooks/useSoundEffects.ts` | Modify | Add timeout, queue management |
| `src/components/kitchen/AudioSettings.tsx` | Create | Audio toggle dropdown with key management |

---

## Expected Results

After implementation:

1. **UI** matches the playful, warm aesthetic of the reference image with rounded cards, coral buttons, and three-column layout
2. **Sound effects** work reliably with ability to update API key from the UI
3. **Cooking flow** completes every time with intelligent fallbacks when agents don't return expected responses
4. **Recook** button appears for rejected dishes, preserving attempt history

---

## Technical Notes

### Force Tool Calling
Using `tool_choice: "required"` ensures the model always attempts a function call rather than returning plain text.

### Fallback Chain
1. Try to parse tool call from response
2. Try to extract action from text content using regex
3. Auto-serve with last created ingredient
4. Never leave cooking loop in broken state

### Sound System Queue
Prevent multiple sounds from overlapping by maintaining a play queue with 500ms minimum gap between sounds.
