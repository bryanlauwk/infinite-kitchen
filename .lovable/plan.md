

# Function Call Kitchen - Implementation Plan

## Project Summary

A Multi-Agent Orchestration System simulating a professional kitchen environment where three specialized AI agents collaborate to fulfill cooking orders. The app showcases "reasoning-action-result" loops using Gemini 3 Flash via the Lovable AI Gateway.

---

## Architecture Overview

```text
+------------------+     +-------------------+     +----------------+
|   USER INTERFACE |     |   COOKING AGENT   |     | ALCHEMY AGENT  |
|                  |     |   (Orchestrator)  |     | (Transformer)  |
|  - Order Queue   |<--->|                   |<--->|                |
|  - Inventory     |     |  Plans recipes    |     | Resolves what  |
|  - Kitchen Log   |     |  Calls functions  |     | happens when   |
|  - Agent Cards   |     |  Manages workflow |     | Action(Item[]) |
+------------------+     +-------------------+     +----------------+
                                  |
                                  v
                         +----------------+
                         |  JUDGE AGENT   |
                         |  (Verifier)    |
                         |                |
                         | Validates if   |
                         | dish matches   |
                         | the order      |
                         +----------------+
```

---

## Phase 1: Foundation and Design System

### 1.1 Custom Theme - "Chef-Terminal Chic"

Update the design system with the specified color palette and typography:

- **Primary Colors**: High-contrast black/white canvas
- **Status Colors**: Gemini Blue (intelligence), Gold (processing), Green (success), Red (failure)
- **Typography**: Space Mono / monospace fonts throughout
- **Checkered Pattern**: CSS pattern for vertical borders

### 1.2 Core Layout Components

Create the main layout structure:

- **KitchenLayout**: Main container with checkered side borders
- **Header**: App title with chef emoji branding
- **Footer**: Status bar showing active agent

---

## Phase 2: Data Layer and State Management

### 2.1 Type Definitions

```text
Types to create:
- Ingredient: { id, name, emoji, category }
- Tool: { id, name, emoji, description, parameters }
- Order: { id, dishName, status, timestamp }
- TimelineEvent: { id, type, content, agent, timestamp }
- AgentState: { name, status, currentAction, thinking }
```

### 2.2 Predefined Data

Create comprehensive data files:

- **ingredients.ts**: 100+ base ingredients organized by category
  - Proteins (eggs, chicken, beef, fish, tofu...)
  - Vegetables (onion, garlic, tomato, carrot...)
  - Dairy (butter, milk, cheese, cream...)
  - Grains (rice, flour, pasta, bread...)
  - Spices (salt, pepper, cumin, oregano...)
  - Liquids (oil, vinegar, wine, stock...)

- **tools.ts**: 102 cooking functions mapped to Gemini tools
  - Heat methods (fry, boil, steam, sous_vide, roast...)
  - Cutting methods (chop, dice, julienne, mince...)
  - Mixing methods (stir, whisk, fold, knead...)
  - Preparation (sift, strain, marinate, season...)

### 2.3 State Management

Using React Context and hooks:

- **KitchenContext**: Global state for inventory, orders, timeline
- **AgentContext**: State for all three agents
- **useInventory**: Hook for managing ingredient state
- **useOrders**: Hook for order queue management
- **useTimeline**: Hook for event logging

---

## Phase 3: Backend - Edge Functions

### 3.1 Cooking Agent Edge Function

**Path**: `supabase/functions/cooking-agent/index.ts`

- Receives current inventory and active order
- Uses function calling with 102 tool definitions
- Returns next action or serve() call
- Streams thinking process to UI

### 3.2 Alchemy Agent Edge Function

**Path**: `supabase/functions/alchemy-agent/index.ts`

- Receives action name and ingredient parameters
- Uses JSON mode with strict schema
- Returns: `{ result_name, emoji, description }`
- Stateless - no memory of orders

### 3.3 Judge Agent Edge Function

**Path**: `supabase/functions/judge-agent/index.ts`

- Receives served dish name and original order
- Performs semantic similarity matching
- Returns: `{ match: boolean, confidence: number, reasoning: string }`

---

## Phase 4: UI Components

### 4.1 Tile System

- **IngredientTile**: Displays ingredient with emoji and name
- **ResultTile**: Shows newly created items with slide-in animation
- **ActionTile**: Displays function calls in code-block style

### 4.2 Main Sections

#### Inventory Panel
- Grid of ingredient tiles
- Visual feedback for items being used
- "Glow" effect on AI-selected items (Gemini Blue)

#### Order Queue
- Stack of pending orders
- Active order highlighted (Gold)
- Completed orders (Green) / Failed orders (Red)
- "Add Order" input field

#### Kitchen Log (Timeline)
- Horizontal scrolling event stream
- Event types: Thinking, Action, Result, Serve
- Real-time updates with typing indicators
- Agent emoji attribution

#### Agent Cards
- Three cards showing agent status
- Simplified thinking display (plain English)
- Visual status indicators (idle/active/complete)

### 4.3 Control Panel

- **Start Cooking**: Initiates the cooking loop
- **Add Order**: Input for custom dish requests
- **Reset Kitchen**: Clears inventory to base ingredients

---

## Phase 5: The Cooking Loop

### 5.1 Orchestration Flow

```text
1. User clicks "Start Cooking" with an active order
2. UI locks to "Cooking" state
3. Cooking Agent receives:
   - Current inventory
   - Target dish (order)
4. Cooking Agent responds with function call
5. UI displays thinking + action in timeline
6. Alchemy Agent processes the action:
   - Input: fry([egg])
   - Output: { result_name: "Fried Egg", emoji: "🍳" }
7. New item added to inventory
8. Result fed back to Cooking Agent
9. Loop continues until serve() is called
10. Judge Agent validates the result
11. Order marked complete or failed
```

### 5.2 State Transitions

```text
Order States:
  pending -> active -> cooking -> served -> (verified | rejected)

Agent States:
  idle -> thinking -> acting -> idle
```

---

## Phase 6: Visual Polish

### 6.1 Animations

- **SlideIn**: New ingredients appearing
- **Pulse**: Active ingredient selection
- **Fade**: Completed timeline events
- **Shake**: Failed order indication

### 6.2 Loading States

- Typing indicator for agent thinking
- Skeleton tiles during inference
- Progress bar for multi-step recipes

### 6.3 Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements for state changes
- High contrast ratios maintained

---

## File Structure

```text
src/
├── components/
│   ├── kitchen/
│   │   ├── KitchenLayout.tsx
│   │   ├── Header.tsx
│   │   ├── InventoryPanel.tsx
│   │   ├── OrderQueue.tsx
│   │   ├── TimelineLog.tsx
│   │   ├── AgentCards.tsx
│   │   └── ControlPanel.tsx
│   ├── tiles/
│   │   ├── IngredientTile.tsx
│   │   ├── ActionTile.tsx
│   │   └── ResultTile.tsx
│   └── agents/
│       ├── AgentCard.tsx
│       └── ThinkingDisplay.tsx
├── context/
│   ├── KitchenContext.tsx
│   └── AgentContext.tsx
├── data/
│   ├── ingredients.ts
│   └── tools.ts
├── hooks/
│   ├── useInventory.ts
│   ├── useOrders.ts
│   ├── useTimeline.ts
│   └── useCookingLoop.ts
├── lib/
│   ├── api.ts
│   └── types.ts
├── pages/
│   └── Index.tsx
└── index.css (updated theme)

supabase/
└── functions/
    ├── cooking-agent/
    │   └── index.ts
    ├── alchemy-agent/
    │   └── index.ts
    └── judge-agent/
        └── index.ts
```

---

## Technical Considerations

### API Integration

- All AI calls routed through Lovable AI Gateway
- LOVABLE_API_KEY already configured
- Using `google/gemini-3-flash-preview` for all agents
- Streaming enabled for real-time thinking display

### Performance

- Debounced state updates during cooking loop
- Memoized tile components
- Virtual scrolling for timeline if needed

### Error Handling

- Graceful degradation on API failures
- Retry logic for transient errors
- User-friendly error messages in timeline

---

## Implementation Order

1. **Foundation**: Theme, types, layout structure
2. **Data**: Ingredients and tools definitions
3. **State**: Context providers and hooks
4. **Backend**: Edge functions for all three agents
5. **UI Components**: Build from inside out (tiles -> panels -> layout)
6. **Orchestration**: The cooking loop logic
7. **Polish**: Animations, loading states, accessibility

---

## Sample Interaction

```text
User: Adds order "Scrambled Eggs"
User: Clicks "Start Cooking"

Timeline:
🧑‍🍳 "I'll prepare scrambled eggs. First, I need to crack some eggs."
→ crack([egg, egg])
🧑‍🔬 "Raw eggs ready for cooking"
   Result: Raw Egg Mixture 🥚

🧑‍🍳 "Now I'll add butter and scramble over low heat."
→ scramble([raw_egg_mixture, butter])
🧑‍🔬 "Eggs transformed with gentle heat"
   Result: Scrambled Eggs 🍳

🧑‍🍳 "Adding a pinch of seasoning for flavor."
→ season([scrambled_eggs, salt, pepper])
🧑‍🔬 "Seasoned to perfection"
   Result: Seasoned Scrambled Eggs 🧂🍳

🧑‍🍳 "Dish complete! Serving now."
→ serve([seasoned_scrambled_eggs])

🧑‍⚖️ "Comparing 'Seasoned Scrambled Eggs' to order 'Scrambled Eggs'"
   Verdict: ✅ MATCH (95% confidence)
   "The dish satisfies the order requirements."

Order Status: COMPLETED ✅
```

