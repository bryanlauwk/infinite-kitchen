

# Infinite Kitchen - Implementation Plan

## Overview

Transform the Function Call Kitchen into an **Infinite Kitchen** where:
1. Three AI agents (Cooking, Alchemy, Judge) power the real cooking loop
2. Users can type any dish they want - the AI figures out the recipe
3. New ingredients discovered during cooking get added to the global inventory
4. The kitchen grows infinitely as more dishes are cooked

---

## Architecture

```text
USER INPUT                    EDGE FUNCTIONS                     STATE
-----------                   --------------                     -----
"Pad Thai"     ──────►  [cooking-agent]  ◄──────►  Inventory[]
                              │                         │
                              │ function call           │ new items
                              ▼                         ▼
                        [alchemy-agent]  ──────►  Generated[]
                              │
                              │ serve()
                              ▼
                        [judge-agent]   ──────►  Order Status
```

---

## Part 1: Edge Functions

### 1.1 Cooking Agent (`supabase/functions/cooking-agent/index.ts`)

The orchestrator that plans and executes recipes using function calling.

**Request:**
```json
{
  "inventory": [{ "id": "egg", "name": "egg", "emoji": "🥚", ... }],
  "order": { "dishName": "Scrambled Eggs", ... },
  "conversationHistory": [{ "role": "system", "content": "..." }]
}
```

**Behavior:**
- Receives full inventory of available ingredients
- Uses Gemini 3 Flash with 102 tool definitions (all cooking functions)
- Returns either a function call or the final `serve()` action
- Includes thinking/reasoning in the response for the timeline

**Response:**
```json
{
  "thinking": "I'll start by cracking the eggs into a bowl...",
  "functionCall": {
    "name": "crack",
    "ingredients": ["egg", "egg"]
  },
  "isComplete": false
}
```

Or when serving:
```json
{
  "thinking": "The dish is ready to serve!",
  "functionCall": {
    "name": "serve",
    "ingredients": ["seasoned_scrambled_eggs"]
  },
  "isComplete": true
}
```

### 1.2 Alchemy Agent (`supabase/functions/alchemy-agent/index.ts`)

The state transformer that determines what happens when Action(Ingredients) is executed.

**Request:**
```json
{
  "action": "crack",
  "ingredients": [
    { "id": "egg", "name": "egg", "emoji": "🥚" }
  ]
}
```

**Behavior:**
- Stateless - no knowledge of orders
- Uses JSON mode with strict responseSchema
- Creatively determines the result of combining ingredients with an action
- Returns a new ingredient that can be used in future steps

**Response:**
```json
{
  "resultName": "Raw Egg Mixture",
  "resultId": "raw_egg_mixture",
  "emoji": "🥚",
  "description": "Fresh eggs cracked and ready for cooking"
}
```

### 1.3 Judge Agent (`supabase/functions/judge-agent/index.ts`)

The semantic validator that compares served dish to order.

**Request:**
```json
{
  "servedDish": "Seasoned Scrambled Eggs",
  "orderName": "Scrambled Eggs"
}
```

**Behavior:**
- Uses semantic similarity rather than exact string matching
- "Sunny Side Up" should match "Fried Eggs"
- Returns confidence score and reasoning

**Response:**
```json
{
  "match": true,
  "confidence": 95,
  "reasoning": "Seasoned Scrambled Eggs is a valid preparation of Scrambled Eggs with added seasoning."
}
```

---

## Part 2: Custom Order Input (Infinite Kitchen Core)

### 2.1 New Component: `AddOrderInput`

A text input in the Orders section that lets users type any dish name.

```text
+----------------------------------------------------------+
|  ORDERS                                                   |
|  Customer orders to fulfill with function calling         |
|                                                           |
|  +--------------------------------------------------+    |
|  | 🍳 What would you like to cook?                   |    |
|  | [Type any dish name...              ] [+ Add]    |    |
|  +--------------------------------------------------+    |
|                                                           |
|  [Fried Eggs] [Avocado Toast] [Beef Stir-fry] ...       |
+----------------------------------------------------------+
```

**Features:**
- Placeholder examples cycle through suggestions
- When order is added, system assigns an emoji and difficulty
- Can add any dish - AI will figure out how to cook it
- Works with base ingredients OR discovers new ones

### 2.2 Difficulty Estimation

When a custom order is added, we can optionally call a lightweight AI check to estimate difficulty based on:
- Number of likely steps
- Complexity of techniques
- Whether it requires generated ingredients

Or simply default to "intermediate" for all custom orders (simpler approach).

---

## Part 3: The Cooking Loop (Frontend Orchestration)

### 3.1 New Hook: `useCookingLoop`

Central orchestration logic that manages the cooking process:

```text
Flow:
1. User clicks "Cook" on an order
2. Lock UI (isCooking = true)
3. Call cooking-agent with inventory + order
4. Receive thinking + function call
5. Add timeline event (thinking)
6. Add timeline event (action)
7. Call alchemy-agent with action + ingredients
8. Receive result
9. Add result to inventory as new generated ingredient
10. Add timeline event (result)
11. Update conversation history
12. If not serve(): goto step 3
13. If serve(): call judge-agent
14. Add timeline event (judge verdict)
15. Update order status (verified/rejected)
16. Unlock UI
```

### 3.2 State Updates for Infinite Kitchen

**Inventory Growth:**
- When alchemy-agent returns a result, add it to inventory with `isGenerated: true`
- Generated ingredients appear in a special "Generated" category
- These persist across cooking sessions (for the infinite concept)
- Visual distinction: generated items have a subtle glow or badge

**Timeline Events:**
- Real-time updates as each step completes
- Typing indicator while waiting for AI response
- Function calls displayed in code-block style
- Results show the new ingredient with emoji

---

## Part 4: UI Enhancements

### 4.1 Inventory Panel Updates

Add visual distinction for generated ingredients:

```text
INGREDIENTS                                 count: 115
Select ingredients to use as function arguments

[Base Ingredients]
🥚 egg  🍗 chicken  🥩 beef  🐟 fish ...

[Generated ✨]
🍳 Fried Egg  🥚 Raw Egg Mixture  🧀 Grilled Cheese ...
```

### 4.2 Order Input Enhancement

Add the custom order input field with:
- Auto-suggest based on common dishes
- Real-time validation (non-empty)
- Loading state when adding

### 4.3 Timeline Enhancements

Add more event types for the infinite kitchen:
- `discovery` - when a new ingredient is created
- `thinking` - agent reasoning (italicized)
- `action` - function call (code block)
- `result` - new ingredient (with emoji)

---

## Part 5: API Service Layer

### 5.1 New File: `src/lib/api.ts`

Centralized API calls to edge functions:

```typescript
// Call the cooking agent
async function callCookingAgent(payload: CookingAgentPayload): Promise<CookingAgentResponse>

// Call the alchemy agent  
async function callAlchemyAgent(payload: AlchemyAgentPayload): Promise<AlchemyResult>

// Call the judge agent
async function callJudgeAgent(payload: JudgeAgentPayload): Promise<JudgeResult>
```

All functions use the Supabase client to invoke edge functions with proper headers and error handling.

---

## File Changes Summary

### New Files:
```text
supabase/functions/cooking-agent/index.ts    - Orchestrator agent
supabase/functions/alchemy-agent/index.ts    - State transformer
supabase/functions/judge-agent/index.ts      - Semantic validator
src/lib/api.ts                               - API service layer
src/hooks/useCookingLoop.ts                  - Cooking orchestration
src/components/kitchen/AddOrderInput.tsx     - Custom order input
```

### Modified Files:
```text
src/context/KitchenContext.tsx  - Add generated ingredients category
src/pages/Index.tsx             - Wire up real cooking loop
src/components/kitchen/OrderQueue.tsx      - Add order input
src/components/kitchen/InventoryPanel.tsx  - Show generated section
src/components/kitchen/TimelineLog.tsx     - Add new event types
src/lib/types.ts                - Add API response types
```

---

## Technical Details

### Edge Function Configuration

Each function needs in `supabase/config.toml`:
```toml
[functions.cooking-agent]
verify_jwt = false

[functions.alchemy-agent]
verify_jwt = false

[functions.judge-agent]
verify_jwt = false
```

### Lovable AI Gateway Usage

All edge functions call the AI Gateway with:
```typescript
const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-3-flash-preview',
    messages: [...],
    // For cooking-agent: add tools
    // For alchemy-agent: add response_format for JSON mode
  }),
});
```

### Error Handling

- Network errors: Show error in timeline, allow retry
- AI errors: Display "Chef is confused" message
- Rate limits: Queue with backoff

---

## Implementation Order

1. **Edge Functions** - Create all three agents
2. **API Layer** - Build the service functions
3. **Cooking Loop Hook** - Implement orchestration
4. **Order Input** - Add custom dish input
5. **Wire Everything** - Connect to Index.tsx
6. **Visual Polish** - Generated ingredients styling

---

## Sample Infinite Kitchen Flow

```text
User types: "Eggs Benedict"
System adds order with emoji 🍳 and difficulty "hard"
User clicks "Cook"

Timeline:
👨‍🍳 "Eggs Benedict requires poached eggs, English muffin, and hollandaise.
     Let me start by preparing the hollandaise sauce..."
→ melt([butter])
👨‍🔬 "Butter liquefied"
   Result: Melted Butter 🧈 ← NEW INGREDIENT ADDED!

👨‍🍳 "Now I'll whisk egg yolks with lemon..."
→ whisk([egg, lemon, melted_butter])
👨‍🔬 "Rich emulsion formed"
   Result: Hollandaise Sauce 🍯 ← NEW INGREDIENT ADDED!

👨‍🍳 "Poaching the eggs gently..."
→ poach([egg])
👨‍🔬 "Perfectly runny yolk"
   Result: Poached Egg 🥚 ← NEW INGREDIENT ADDED!

... (more steps)

→ serve([assembled_eggs_benedict])

👨‍⚖️ "Comparing 'Eggs Benedict with Hollandaise' to 'Eggs Benedict'"
   Verdict: ✅ MATCH (98% confidence)

NEW INGREDIENTS DISCOVERED: 3
- Melted Butter 🧈
- Hollandaise Sauce 🍯
- Poached Egg 🥚

These are now available for future recipes!
```

