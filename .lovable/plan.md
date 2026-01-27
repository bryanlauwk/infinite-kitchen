

# Expand Southeast Asian Cuisine Catalog

## Overview

Adding authentic Thai, Vietnamese, and Indonesian dishes across all difficulty levels to create a comprehensive Southeast Asian food representation alongside the existing Malaysian dishes.

---

## Current Southeast Asian Dishes in Catalog

| Country | Dishes Already Present |
|---------|------------------------|
| Thailand | Pad Thai, Tom Yum Soup |
| Vietnam | Pho |
| Malaysia | Teh Tarik, Roti Canai, Nasi Lemak Ayam, Mee Goreng, Char Kway Teow, Laksa, Bak Kut Teh, Hainanese Chicken Rice, Satay, Curry Laksa, Nasi Kandar, Ayam Percik, Murtabak, Nasi Kerabu, Malaysian Steamboat, Beef Rendang |
| Indonesia | None |

---

## New Dishes to Add

### Thai Cuisine (8 dishes)

| Difficulty | Dish | Description |
|------------|------|-------------|
| Easy | **Thai Iced Tea** | Sweet creamy orange tea |
| Easy | **Som Tam** | Green papaya salad |
| Intermediate | **Green Curry** | Coconut-based curry with Thai basil |
| Intermediate | **Massaman Curry** | Rich peanut curry with potatoes |
| Hard | **Khao Soi** | Northern Thai coconut curry noodles |
| Hard | **Moo Ping** | Grilled pork skewers with sticky rice |
| Expert | **Boat Noodles** | Complex broth noodle soup with many toppings |
| Legendary | **Royal Thai Feast** | Multi-dish traditional Thai banquet |

### Vietnamese Cuisine (8 dishes)

| Difficulty | Dish | Description |
|------------|------|-------------|
| Easy | **Vietnamese Iced Coffee** | Strong coffee with condensed milk |
| Easy | **Goi Cuon** | Fresh spring rolls |
| Intermediate | **Banh Mi** | Vietnamese baguette sandwich |
| Intermediate | **Bun Cha** | Grilled pork with noodles |
| Hard | **Bun Bo Hue** | Spicy beef noodle soup |
| Hard | **Banh Xeo** | Crispy savory crepes |
| Expert | **Cha Ca La Vong** | Hanoi-style turmeric fish |
| Legendary | **Vietnamese Wedding Feast** | Multi-course celebration meal |

### Indonesian Cuisine (10 dishes)

| Difficulty | Dish | Description |
|------------|------|-------------|
| Easy | **Es Teh Manis** | Sweet iced tea |
| Easy | **Gado Gado** | Vegetable salad with peanut sauce |
| Intermediate | **Nasi Goreng** | Indonesian fried rice |
| Intermediate | **Mie Goreng** | Indonesian fried noodles |
| Intermediate | **Soto Ayam** | Turmeric chicken soup |
| Hard | **Ayam Bakar** | Grilled spiced chicken |
| Hard | **Gudeg** | Jackfruit stew from Yogyakarta |
| Expert | **Rawon** | Black beef soup with keluak nuts |
| Expert | **Bebek Betutu** | Balinese slow-cooked duck |
| Legendary | **Rijsttafel** | Dutch-Indonesian rice table feast |

---

## Implementation

### File: `src/data/orders.ts`

Add 26 new Southeast Asian dishes:

```typescript
// Easy - Thai
{ id: 'thai_iced_tea', dishName: 'Thai Iced Tea', emoji: '🧋', difficulty: 'easy' },
{ id: 'som_tam', dishName: 'Som Tam', emoji: '🥗', difficulty: 'easy' },

// Easy - Vietnamese  
{ id: 'vietnamese_iced_coffee', dishName: 'Vietnamese Iced Coffee', emoji: '☕', difficulty: 'easy' },
{ id: 'goi_cuon', dishName: 'Goi Cuon', emoji: '🥬', difficulty: 'easy' },

// Easy - Indonesian
{ id: 'es_teh_manis', dishName: 'Es Teh Manis', emoji: '🧊', difficulty: 'easy' },
{ id: 'gado_gado', dishName: 'Gado Gado', emoji: '🥗', difficulty: 'easy' },

// Intermediate - Thai
{ id: 'green_curry', dishName: 'Green Curry', emoji: '🍛', difficulty: 'intermediate' },
{ id: 'massaman_curry', dishName: 'Massaman Curry', emoji: '🍛', difficulty: 'intermediate' },

// Intermediate - Vietnamese
{ id: 'banh_mi', dishName: 'Banh Mi', emoji: '🥖', difficulty: 'intermediate' },
{ id: 'bun_cha', dishName: 'Bun Cha', emoji: '🍜', difficulty: 'intermediate' },

// Intermediate - Indonesian
{ id: 'nasi_goreng', dishName: 'Nasi Goreng', emoji: '🍚', difficulty: 'intermediate' },
{ id: 'mie_goreng_indo', dishName: 'Mie Goreng', emoji: '🍜', difficulty: 'intermediate' },
{ id: 'soto_ayam', dishName: 'Soto Ayam', emoji: '🍲', difficulty: 'intermediate' },

// Hard - Thai
{ id: 'khao_soi', dishName: 'Khao Soi', emoji: '🍜', difficulty: 'hard' },
{ id: 'moo_ping', dishName: 'Moo Ping', emoji: '🍢', difficulty: 'hard' },

// Hard - Vietnamese
{ id: 'bun_bo_hue', dishName: 'Bun Bo Hue', emoji: '🍜', difficulty: 'hard' },
{ id: 'banh_xeo', dishName: 'Banh Xeo', emoji: '🥞', difficulty: 'hard' },

// Hard - Indonesian
{ id: 'ayam_bakar', dishName: 'Ayam Bakar', emoji: '🍗', difficulty: 'hard' },
{ id: 'gudeg', dishName: 'Gudeg', emoji: '🍲', difficulty: 'hard' },

// Expert - Thai
{ id: 'boat_noodles', dishName: 'Boat Noodles', emoji: '🍜', difficulty: 'expert' },

// Expert - Vietnamese
{ id: 'cha_ca_la_vong', dishName: 'Cha Ca La Vong', emoji: '🐟', difficulty: 'expert' },

// Expert - Indonesian
{ id: 'rawon', dishName: 'Rawon', emoji: '🍲', difficulty: 'expert' },
{ id: 'bebek_betutu', dishName: 'Bebek Betutu', emoji: '🦆', difficulty: 'expert' },

// Legendary - Thai
{ id: 'royal_thai_feast', dishName: 'Royal Thai Feast', emoji: '👑', difficulty: 'legendary' },

// Legendary - Vietnamese
{ id: 'vietnamese_wedding_feast', dishName: 'Vietnamese Wedding Feast', emoji: '💒', difficulty: 'legendary' },

// Legendary - Indonesian
{ id: 'rijsttafel', dishName: 'Rijsttafel', emoji: '🍽️', difficulty: 'legendary' },
```

---

## Updated Dish Count

| Difficulty | Before | After |
|------------|--------|-------|
| Beginner | 8 | 8 |
| Easy | 14 | 20 (+6) |
| Intermediate | 18 | 25 (+7) |
| Hard | 16 | 22 (+6) |
| Expert | 13 | 17 (+4) |
| Legendary | 10 | 13 (+3) |
| **Total** | **79** | **105** (+26) |

---

## Southeast Asian Representation Summary

| Country | Total Dishes |
|---------|--------------|
| Thailand | 10 (Pad Thai, Tom Yum + 8 new) |
| Vietnam | 9 (Pho + 8 new) |
| Indonesia | 10 (all new) |
| Malaysia | 16 (existing) |
| **Total SE Asian** | **45 dishes** |

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/data/orders.ts` | Add 26 Southeast Asian dish templates across all difficulty levels |

---

## Notes

- Dishes are categorized by actual cooking complexity
- Each country has representation across multiple difficulty levels
- Names use authentic local terminology (e.g., "Goi Cuon" not "Spring Rolls")
- The filter dropdown will automatically update counts
- AI illustration generation will create unique surrealist visuals for each dish

