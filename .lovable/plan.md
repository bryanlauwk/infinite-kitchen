

# Add Malaysian Cuisine to the Dish Catalog

## Overview

Adding authentic Malaysian dishes across all difficulty levels to provide better culinary variation and local representation. These dishes reflect Malaysia's rich multicultural food heritage.

---

## Malaysian Dishes to Add

### Easy (3-4 steps)
| Dish | Description |
|------|-------------|
| **Teh Tarik** | Pulled milk tea - simple but requires technique |
| **Roti Canai** | Flatbread with curry dip (simplified version) |

### Intermediate (5-7 steps)
| Dish | Description |
|------|-------------|
| **Nasi Lemak Ayam** | Coconut rice with fried chicken, sambal, egg, anchovies |
| **Mee Goreng** | Spicy stir-fried noodles with vegetables and protein |
| **Char Kway Teow** | Stir-fried flat rice noodles with prawns and Chinese sausage |
| **Laksa** | Spicy coconut curry noodle soup |

### Hard (8-10 steps)
| Dish | Description |
|------|-------------|
| **Bak Kut Teh** | Pork rib tea soup with complex herbal broth |
| **Hainanese Chicken Rice** | Poached chicken with aromatic rice and three sauces |
| **Satay** | Grilled meat skewers with peanut sauce and accompaniments |
| **Curry Laksa** | Rich curry noodle soup with multiple toppings |

### Expert (11-15 steps)
| Dish | Description |
|------|-------------|
| **Nasi Kandar** | Rice with multiple curries and side dishes |
| **Ayam Percik** | Grilled chicken with spiced coconut gravy |
| **Murtabak** | Stuffed pan-fried flatbread with meat filling |

### Legendary (16+ steps)
| Dish | Description |
|------|-------------|
| **Nasi Kerabu** | Blue rice with herbs, vegetables, and multiple components |
| **Malaysian Steamboat** | Full hot pot feast with multiple broths and ingredients |

---

## Implementation

### File: `src/data/orders.ts`

Add 15 Malaysian dishes distributed across difficulty levels:

```typescript
// Easy - Add after existing easy dishes
{ id: 'teh_tarik', dishName: 'Teh Tarik', emoji: '🍵', difficulty: 'easy' },
{ id: 'roti_canai', dishName: 'Roti Canai', emoji: '🫓', difficulty: 'easy' },

// Intermediate - Add after existing intermediate dishes
{ id: 'nasi_lemak_ayam', dishName: 'Nasi Lemak Ayam', emoji: '🍚', difficulty: 'intermediate' },
{ id: 'mee_goreng', dishName: 'Mee Goreng', emoji: '🍜', difficulty: 'intermediate' },
{ id: 'char_kway_teow', dishName: 'Char Kway Teow', emoji: '🍜', difficulty: 'intermediate' },
{ id: 'laksa', dishName: 'Laksa', emoji: '🍜', difficulty: 'intermediate' },

// Hard - Add after existing hard dishes
{ id: 'bak_kut_teh', dishName: 'Bak Kut Teh', emoji: '🍲', difficulty: 'hard' },
{ id: 'hainanese_chicken_rice', dishName: 'Hainanese Chicken Rice', emoji: '🍗', difficulty: 'hard' },
{ id: 'satay', dishName: 'Satay', emoji: '🍢', difficulty: 'hard' },
{ id: 'curry_laksa', dishName: 'Curry Laksa', emoji: '🍜', difficulty: 'hard' },

// Expert - Add after existing expert dishes (Beef Rendang already exists!)
{ id: 'nasi_kandar', dishName: 'Nasi Kandar', emoji: '🍛', difficulty: 'expert' },
{ id: 'ayam_percik', dishName: 'Ayam Percik', emoji: '🍗', difficulty: 'expert' },
{ id: 'murtabak', dishName: 'Murtabak', emoji: '🫓', difficulty: 'expert' },

// Legendary - Add after existing legendary dishes
{ id: 'nasi_kerabu', dishName: 'Nasi Kerabu', emoji: '🍚', difficulty: 'legendary' },
{ id: 'malaysian_steamboat', dishName: 'Malaysian Steamboat', emoji: '🫕', difficulty: 'legendary' },
```

---

## Updated Dish Count

| Difficulty | Before | After |
|------------|--------|-------|
| Beginner | 8 | 8 |
| Easy | 12 | 14 (+2) |
| Intermediate | 14 | 18 (+4) |
| Hard | 12 | 16 (+4) |
| Expert | 10 | 13 (+3) |
| Legendary | 8 | 10 (+2) |
| **Total** | **64** | **79** (+15) |

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/data/orders.ts` | Add 15 Malaysian dish templates across 5 difficulty levels |

---

## Notes

- **Beef Rendang** is already included in the Expert category
- Dishes are categorized by actual cooking complexity (e.g., Bak Kut Teh requires slow simmering of herbal broth = Hard)
- The filter dropdown will automatically update counts to reflect new dishes
- AI illustration generation will create unique surrealist visuals for each Malaysian dish

