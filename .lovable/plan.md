

# Rebrand: Function Calling Kitchen → Infinite Kitchen

## Overview

Update all user-facing copy to remove "function calling" terminology and rebrand the application as **Infinite Kitchen** - emphasizing the creative, infinite possibilities of AI-powered cooking rather than the technical implementation details.

---

## Copy Changes by File

### 1. `index.html` - Page Metadata

**Current:**
```html
<title>Lovable App</title>
<meta name="description" content="Lovable Generated Project" />
<meta property="og:title" content="Lovable App" />
<meta property="og:description" content="Lovable Generated Project" />
```

**New:**
```html
<title>Infinite Kitchen</title>
<meta name="description" content="An AI-powered kitchen where every dish is possible. Cook anything, discover new ingredients, and watch AI chefs collaborate." />
<meta property="og:title" content="Infinite Kitchen" />
<meta property="og:description" content="An AI-powered kitchen where every dish is possible" />
```

---

### 2. `src/components/kitchen/Header.tsx` - Main Title

**Current:**
```tsx
<h1>Function Calling Kitchen</h1>
<p>Challenge Gemini 3 Flash's function calling capabilities:</p>
```

**New:**
```tsx
<h1>Infinite Kitchen</h1>
<p>Where AI chefs turn any recipe into reality</p>
```

---

### 3. `src/components/kitchen/HeroBanner.tsx` - Hero Section

**Current:**
```tsx
<h2>Ultimate Function Calling Challenge!</h2>
<p>Sequence tasks from 100 tools and 100 ingredients to prepare a meal</p>
```

**New:**
```tsx
<h2>Cook Anything. Discover Everything.</h2>
<p>Order any dish and watch AI chefs collaborate using 100+ tools and ingredients</p>
```

---

### 4. `src/components/kitchen/OrderQueue.tsx` - Orders Section

**Current:**
```tsx
<p>Customer orders to fulfill with function calling</p>
```

**New:**
```tsx
<p>Order any dish - the kitchen figures out the rest</p>
```

---

### 5. `src/components/kitchen/KitchenStaff.tsx` - Staff Section

**Current:**
```tsx
<p>Three specialized Gemini 3 Flash agents</p>
```

**New:**
```tsx
<p>Three AI chefs working together to cook your order</p>
```

---

### 6. `src/components/kitchen/InventoryPanel.tsx` - Panels

**Ingredients Panel - Current:**
```tsx
<p>Select ingredients to use as function arguments</p>
```

**Ingredients Panel - New:**
```tsx
<p>Base ingredients and items discovered while cooking</p>
```

**Tools Panel - Current:**
```tsx
<p>Use function calls to combine ingredients</p>
```

**Tools Panel - New:**
```tsx
<p>Kitchen techniques the AI can use</p>
```

---

### 7. `src/components/kitchen/TimelineLog.tsx` - Empty State

**Current:**
```tsx
Select ingredients and click an action to start cooking
```

**New:**
```tsx
Add an order and click Cook to see the magic happen
```

---

### 8. `src/context/AgentContext.tsx` - Agent Descriptions

**Chef - Current:**
```tsx
description: 'Orchestrates the kitchen using 100 tools and ingredients to plan the meal.'
```

**Chef - New:**
```tsx
description: 'Plans recipes and coordinates the kitchen to prepare your dish.'
```

**Sous - Current:**
```tsx
description: 'Masters the alchemy of flavor to determine the result of cooking actions.'
```

**Sous - New:**
```tsx
description: 'Transforms ingredients through cooking techniques to create new items.'
```

**Expeditor - Current:**
```tsx
description: 'Verifies that served dishes match customer orders before delivery.'
```

**Expeditor - New:**
```tsx
description: 'Quality control - ensures the final dish matches what you ordered.'
```

---

## Summary of Changes

| File | What Changes |
|------|--------------|
| `index.html` | Title, meta description, OG tags |
| `Header.tsx` | Main title + subtitle |
| `HeroBanner.tsx` | Hero headline + description |
| `OrderQueue.tsx` | Section description |
| `KitchenStaff.tsx` | Section description |
| `InventoryPanel.tsx` | Both panel descriptions |
| `TimelineLog.tsx` | Empty state message |
| `AgentContext.tsx` | All 3 agent descriptions |

---

## Brand Voice Guidelines

The new copy emphasizes:
- **Creativity**: "Cook anything", "discover", "infinite possibilities"
- **Collaboration**: "AI chefs working together"
- **Magic**: "Watch the magic happen", "figures out the rest"
- **Accessibility**: Removes technical jargon, speaks to any user

All functionality, layout, and component structure remains identical - only user-facing text strings change.

