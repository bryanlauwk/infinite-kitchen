

# Expand Southeast Asian Cuisine + Redesign Header Typography

## Overview

This plan addresses two tasks:
1. **Add 26 Southeast Asian dishes** (Thai, Vietnamese, Indonesian) to the catalog
2. **Redesign the header typography** to match the playful, illustrative aesthetic

---

## Part 1: Southeast Asian Cuisine Expansion

### New Dishes to Add (26 total)

| Country | Easy | Intermediate | Hard | Expert | Legendary |
|---------|------|--------------|------|--------|-----------|
| **Thai** | Thai Iced Tea, Som Tam | Green Curry, Massaman Curry | Khao Soi, Moo Ping | Boat Noodles | Royal Thai Feast |
| **Vietnamese** | Vietnamese Iced Coffee, Goi Cuon | Banh Mi, Bun Cha | Bun Bo Hue, Banh Xeo | Cha Ca La Vong | Vietnamese Wedding Feast |
| **Indonesian** | Es Teh Manis, Gado Gado | Nasi Goreng, Mie Goreng, Soto Ayam | Ayam Bakar, Gudeg | Rawon, Bebek Betutu | Rijsttafel |

### Updated Totals

| Difficulty | Current | After |
|------------|---------|-------|
| Beginner | 8 | 8 |
| Easy | 14 | 20 (+6) |
| Intermediate | 18 | 25 (+7) |
| Hard | 16 | 22 (+6) |
| Expert | 13 | 17 (+4) |
| Legendary | 10 | 13 (+3) |
| **Total** | **79** | **105** |

---

## Part 2: Header Typography Redesign

### Current Issues
- The title "INFINITE KITCHEN" uses standard bold text that feels generic
- The tagline uses plain muted-foreground styling
- The overall header feels disconnected from the warm, playful illustration style used elsewhere

### Design Direction
Following the "neal.fun-like" aesthetic and the established "Nunito + Space Mono" typography system:

1. **Title Treatment**: Larger, more expressive display typography using Nunito (the rounded display font)
2. **Tagline**: Observational, slightly ambiguous language (per the aesthetic philosophy)
3. **Visual Warmth**: Add subtle decorative elements or color accents
4. **Hierarchy**: Create clearer visual separation between title and tagline

### New Header Design

```text
+----------------------------------------------------------+
|                                                          |
|   INFINITE KITCHEN                          [Audio 🔊]   |
|   Where ingredients become possibilities                 |
|                                                          |
+----------------------------------------------------------+
```

**Typography Changes**:
- Title: `text-3xl md:text-4xl font-display font-black tracking-tighter` (uses Nunito)
- Tagline: Warmer, more poetic phrasing without explicit descriptions
- Add subtle gradient or accent color to title for visual interest

### New Copy Options (following neal.fun aesthetic - observational, no exclamation marks)
- "Where ingredients become possibilities"
- "Things happen here. Meals, mostly"
- "The kitchen knows what you need"
- "Ingredients have ideas"

---

## Implementation Details

### File 1: `src/data/orders.ts`

Add 26 new Southeast Asian dishes organized by difficulty level.

### File 2: `src/components/kitchen/Header.tsx`

Redesign the header component:
- Use `font-display` class for the title (triggers Nunito font)
- Increase title size to `text-3xl md:text-4xl`
- Add `tracking-tighter` for more compact, impactful title
- Update tagline with warmer, more observational copy
- Consider subtle color accent on title

### File 3: `src/components/kitchen/HeroBanner.tsx`

Update the hero banner copy to match the refined aesthetic (currently has slightly awkward phrasing).

---

## Technical Summary

| File | Changes |
|------|---------|
| `src/data/orders.ts` | Add 26 Southeast Asian dish templates |
| `src/components/kitchen/Header.tsx` | Redesign typography, update copy |
| `src/components/kitchen/HeroBanner.tsx` | Refine banner copy to match aesthetic |

---

## Notes

- All new dishes use authentic local names (e.g., "Goi Cuon" not "Spring Rolls")
- Typography uses established Nunito (display) + Space Mono (body) system
- Copy follows "observational, slightly ambiguous" language guidelines
- Filter dropdown will automatically update with new dish counts

