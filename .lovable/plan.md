

# Fix Dish Display and Add Difficulty Filter

## Problem Identified

The code correctly loads all 64 dishes from `orderTemplates` in `KitchenContext.tsx`. However, there may be visibility issues:

1. The ScrollArea has a fixed `maxHeight: 600px` which might make it unclear that more dishes are available below
2. No quick way to filter/navigate 64 dishes across 6 difficulty levels
3. Grid layout `grid-cols-2 sm:grid-cols-3 md:grid-cols-4` may make it hard to see all dishes at once

## Solution

### 1. Add Difficulty Filter Dropdown

Add a filter dropdown in the OrderQueue header that allows users to:
- View "All Dishes" (default) - shows all 64 dishes grouped by difficulty
- Filter to a specific difficulty level (Beginner, Easy, Intermediate, Hard, Expert, Legendary)
- Show count of dishes in each filter option

### 2. Improve Visibility Indicators

- Add a visual indicator showing total dishes available vs. currently visible
- Ensure the scroll area properly displays all content

---

## Implementation Details

### File: `src/components/kitchen/OrderQueue.tsx`

**Changes:**

1. Add state for selected difficulty filter:
```typescript
const [selectedDifficulty, setSelectedDifficulty] = useState<OrderDifficulty | 'all'>('all');
```

2. Add filter logic:
```typescript
const filteredOrders = selectedDifficulty === 'all' 
  ? pendingOrders 
  : pendingOrders.filter(o => o.difficulty === selectedDifficulty);
```

3. Add Select dropdown in header area with options:
   - "All Dishes (64)"
   - "Beginner (8)"
   - "Easy (12)"
   - "Intermediate (14)"
   - "Hard (12)"
   - "Expert (10)"
   - "Legendary (8)"

4. Update the subtitle to show dynamic count:
```typescript
<p className="text-xs text-muted-foreground">
  Showing {filteredOrders.length} of {pendingOrders.length} dishes
</p>
```

5. Conditionally render difficulty sections based on filter:
   - When "All" is selected: Show grouped by difficulty (current behavior)
   - When specific difficulty is selected: Show flat grid without group headers

---

## UI Layout

```text
+------------------------------------------+
| THE ORDERS OF THE UNIVERSE    [Filter v] |
| Showing 64 of 64 dishes        [Audio]   |
+------------------------------------------+
| [Add custom dish input]                  |
+------------------------------------------+
| BEGINNER (8)                             |
| [Card][Card][Card][Card]                 |
| [Card][Card][Card][Card]                 |
|------------------------------------------|
| EASY (12)                                |
| [Card][Card][Card][Card]                 |
| ...                                      |
+------------------------------------------+
```

When filtered to "Expert":

```text
+------------------------------------------+
| THE ORDERS OF THE UNIVERSE    [Expert v] |
| Showing 10 of 64 dishes        [Audio]   |
+------------------------------------------+
| [Card][Card][Card][Card]                 |
| [Card][Card][Card][Card]                 |
| [Card][Card]                             |
+------------------------------------------+
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/kitchen/OrderQueue.tsx` | Add difficulty filter state, Select dropdown, filter logic, dynamic counts |

---

## Technical Notes

- Uses existing `Select` component from `@/components/ui/select`
- Filter options include dish counts calculated from `pendingOrders`
- Maintains backward compatibility with existing order grouping
- "All" filter preserves the grouped-by-difficulty view
- Single difficulty filter shows a flat grid for cleaner view

