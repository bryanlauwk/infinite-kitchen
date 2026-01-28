
# Optimize Lazy Loading for Orders, Dishes, and Icons

## Current State Analysis

The illustration system already has several optimizations in place:
- Database caching (332 illustrations already cached)
- Request queue limiting (max 3 concurrent)
- Native `loading="lazy"` on images
- Background pre-generation of priority items

However, there are significant opportunities for further optimization, especially for initial load performance and viewport-aware loading.

---

## Solution Overview

Implement three layers of optimization:

1. **Bulk Cache Preloading** - Load all cached URLs on app init (single DB query)
2. **Intersection Observer Pattern** - Only request illustrations for visible items
3. **Optimized Image Loading** - Better placeholders, responsive sizes, and fade-in effects

---

## Implementation Details

### 1. Bulk Cache Preloading

**File: `src/context/IllustrationContext.tsx`**

Add a new initialization function that fetches ALL cached illustration URLs in a single database query when the app loads.

Changes:
- Add `initializeFromCache()` function that runs once on mount
- Query: `SELECT prompt_key, image_url FROM generated_illustrations`
- Populate the illustrations state map immediately
- This eliminates hundreds of individual cache-check queries

Benefits:
- Single DB query vs 50+ individual queries on page load
- Instant display for all previously generated illustrations
- Significantly faster initial render

### 2. Intersection Observer for Lazy Requests

**New File: `src/hooks/useVisibilityRequest.ts`**

Create a custom hook that only triggers illustration requests when an element enters the viewport.

Logic:
- Use IntersectionObserver with `rootMargin: '100px'` (prefetch slightly before visible)
- Track if component has been visible with a ref
- Only call `requestIllustration()` when first visible

**Updated Files:**
- `src/components/kitchen/DishIllustration.tsx`
- `src/components/kitchen/IngredientIllustration.tsx`
- `src/components/kitchen/TechniqueIllustration.tsx`

Replace the `useEffect` that immediately requests illustrations with the new visibility-aware hook.

### 3. Optimized Order Card Rendering

**File: `src/components/kitchen/OrderCard.tsx`**

Add intersection observer to only render full illustration when card is near viewport.

**File: `src/components/kitchen/OrderQueue.tsx`**

Optimize the scroll area:
- Add `contain: layout style` CSS for better scroll performance
- Consider chunked rendering for very large lists

### 4. Enhanced Image Loading UX

**All Illustration Components:**

- Add `decoding="async"` for non-blocking image decode
- Add smooth fade-in transition when images load
- Add `fetchpriority` attribute (high for visible, low for offscreen)
- Implement progressive loading with CSS blur placeholder

---

## Technical Summary

| File | Changes |
|------|---------|
| `src/context/IllustrationContext.tsx` | Add `initializeFromCache()` for bulk preloading on mount |
| `src/hooks/useVisibilityRequest.ts` | New hook with IntersectionObserver for viewport-aware requests |
| `src/components/kitchen/DishIllustration.tsx` | Use visibility hook, add fade-in, async decoding |
| `src/components/kitchen/IngredientIllustration.tsx` | Use visibility hook, add fade-in, async decoding |
| `src/components/kitchen/TechniqueIllustration.tsx` | Use visibility hook, add fade-in, async decoding |
| `src/components/kitchen/OrderCard.tsx` | Add viewport awareness for heavy illustration |
| `src/components/kitchen/OrderQueue.tsx` | Add CSS containment for scroll performance |

---

## Expected Performance Improvements

| Metric | Before | After |
|--------|--------|-------|
| Initial DB queries | 50+ individual | 1 bulk query |
| Time to first paint | Blocked by multiple requests | Immediate cached display |
| API calls for offscreen items | All triggered immediately | Only when scrolled into view |
| Memory usage | All images loaded | Only visible images in memory |
| Scroll performance | Re-renders on every scroll | CSS containment optimized |

---

## Additional Considerations

**Image Optimization (Optional Future Enhancement):**
- The Supabase Storage already provides image serving
- Could add image transformation query params for responsive sizes
- Example: `?width=200&quality=80` for thumbnails

**Virtualization (If List Grows Beyond 100+ Items):**
- Consider adding `@tanstack/react-virtual` for true virtualization
- Only render DOM elements for visible cards
- Would be recommended if order list exceeds 150-200 items regularly
