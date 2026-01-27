

# AI-Generated "Vector-Stylized Surrealism" Illustrations Plan

## Overview

Replace the current emoji + gradient system with AI-generated playful vector-style illustrations for all food/dish graphics and chef avatars. The illustrations will use the **Nano banana model** (`google/gemini-2.5-flash-image`) to generate stylized, whimsical food art matching the reference image aesthetic.

---

## Design Approach: "Vector-Stylized Surrealism"

Based on the reference image, the illustration style features:
- **Soft gradients with rounded shapes** (not realistic photos)
- **Playful, cartoon-like food** with exaggerated features
- **Surreal elements** (octopus soup, cosmic pasta swirls)
- **Pastel color backgrounds** matching dish categories
- **Consistent art style** across all illustrations

---

## Part 1: Image Generation Edge Function

### 1.1 Create `generate-illustration` Edge Function

A new edge function that generates illustrations on-demand:

```typescript
// supabase/functions/generate-illustration/index.ts

// Uses Nano banana model (google/gemini-2.5-flash-image)
// Generates vector-style food illustrations based on dish name

const prompt = `Create a playful, vector-stylized illustration of ${dishName}.

Style requirements:
- Cartoon/vector art style, NOT realistic
- Soft gradients and rounded shapes
- Playful and whimsical, slightly surreal
- Clean white or light pastel background
- Single centered food item
- No text, no labels
- Reminiscent of neal.fun or indie web game aesthetic
- Think "squishy", "juicy" icons from early 2010s app design`;
```

### 1.2 Prompt Engineering for Consistency

Different prompts for different illustration types:

**Dish Illustrations:**
```text
"A cute vector illustration of [dish name] on a light [color] gradient background. 
Playful cartoon style with soft shadows. No text. Single centered dish. 
Think whimsical food app icon."
```

**Chef Avatars:**
```text
"A playful cartoon robot chef character. Cute vector art style with soft gradients. 
[Specific traits: orange for Alchemist, blue for Transmuter, purple for Oracle].
Friendly face, simple geometric shapes. Think indie game mascot."
```

---

## Part 2: Illustration Storage & Caching

### 2.1 Database Table for Illustration Cache

Create a table to cache generated illustrations (avoid regenerating):

```sql
CREATE TABLE generated_illustrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_key TEXT UNIQUE NOT NULL,  -- Hash of dish name + type
  image_url TEXT NOT NULL,           -- Stored image URL or base64
  dish_name TEXT,
  illustration_type TEXT,            -- 'dish' or 'chef'
  created_at TIMESTAMP DEFAULT now()
);
```

### 2.2 Storage Bucket for Images

Create a public storage bucket `illustrations` to store generated images permanently (instead of passing base64 around).

---

## Part 3: Updated Components

### 3.1 New `DishIllustration.tsx`

Replace the current gradient + emoji approach with AI-generated images:

```tsx
interface DishIllustrationProps {
  dishName: string;
  orderId?: string;
  className?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({ 
  dishName,
  orderId,
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchIllustration() {
      // 1. Check cache first
      // 2. If not cached, call generate-illustration edge function
      // 3. Store result in cache and display
    }
    fetchIllustration();
  }, [dishName]);
  
  return (
    <div className={`relative w-full h-20 rounded-xl overflow-hidden ${className}`}>
      {isLoading ? (
        // Gradient placeholder while loading
        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
      ) : (
        <img 
          src={imageUrl} 
          alt={dishName}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};
```

### 3.2 Chef Avatar Illustrations

Update `ChefsSection.tsx` to use generated chef avatars:

```tsx
const chefProfiles: Record<AgentType, { 
  title: string; 
  quirk: string; 
  illustrationPrompt: string;
  fallbackEmoji: string;
}> = {
  chef: {
    title: 'The Alchemist Unit',
    quirk: 'Crafts transformation stages across arguments.',
    illustrationPrompt: 'cute robot chef with orange and coral colors',
    fallbackEmoji: '🤖',
  },
  sous: {
    title: 'The Skiers Conf',  // Per reference image
    quirk: 'Erstfts t uodifir ante tnqutrks.',  // Gibberish per reference
    illustrationPrompt: 'friendly egg-shaped chef creature in warm tones',
    fallbackEmoji: '🥚',
  },
  expeditor: {
    title: 'Nexus Noodle Weaver',  // Per reference image
    quirk: 'Vostfrs lrus Newle abrore actians.',
    illustrationPrompt: 'glowing sun-like chef orb in yellow and orange',
    fallbackEmoji: '☀️',
  },
};
```

### 3.3 Illustration Provider Context

Create a context to manage illustration loading/caching state across the app:

```tsx
// src/context/IllustrationContext.tsx

interface IllustrationContextType {
  getIllustration: (key: string, type: 'dish' | 'chef') => string | null;
  requestIllustration: (key: string, type: 'dish' | 'chef', prompt: string) => Promise<string>;
  isLoading: (key: string) => boolean;
}
```

---

## Part 4: Pre-generation Strategy

### 4.1 Pre-generate Default Order Illustrations

When the app initializes, pre-generate illustrations for the default order templates:

```typescript
// In KitchenContext initialization
const defaultDishes = orderTemplates.map(t => t.dishName);
// Batch request illustrations for all default dishes
```

### 4.2 Lazy Generation for Custom Orders

When a user adds a custom order, generate the illustration in the background:
1. Show gradient placeholder immediately
2. Start generation request
3. Fade in the generated illustration when ready

---

## Part 5: Fallback Strategy

### 5.1 Progressive Enhancement

If illustration generation fails:
1. **First fallback**: Use the current gradient + emoji system
2. **Visual indicator**: Subtle shimmer effect to show "illustration pending"

### 5.2 Rate Limiting Handling

- Queue illustration requests
- Maximum 3 concurrent generations
- Exponential backoff on 429 errors

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/generate-illustration/index.ts` | Create | Edge function for AI image generation |
| `src/lib/api.ts` | Modify | Add `generateIllustration()` function |
| `src/lib/types.ts` | Modify | Add `illustrationUrl?: string` to Order type |
| `src/context/IllustrationContext.tsx` | Create | Manage illustration state/cache |
| `src/components/kitchen/DishIllustration.tsx` | Modify | Use AI-generated images |
| `src/components/kitchen/ChefAvatar.tsx` | Create | Dedicated chef illustration component |
| `src/components/kitchen/ChefsSection.tsx` | Modify | Use ChefAvatar component |
| `src/data/orders.ts` | Modify | Add illustration prompts to order templates |

---

## Database Changes

Create a caching table for generated illustrations:

```sql
CREATE TABLE generated_illustrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_key TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  dish_name TEXT,
  illustration_type TEXT CHECK (illustration_type IN ('dish', 'chef')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (public read, restricted write via service role)
ALTER TABLE generated_illustrations ENABLE ROW LEVEL SECURITY;

-- Anyone can read illustrations
CREATE POLICY "Public read access" ON generated_illustrations
  FOR SELECT USING (true);

-- Only service role can insert (edge function)
CREATE POLICY "Service role insert" ON generated_illustrations
  FOR INSERT WITH CHECK (true);
```

---

## Edge Function Implementation

### generate-illustration/index.ts

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { dishName, type, promptKey } = await req.json();
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  // Check cache first
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  
  const { data: cached } = await supabase
    .from('generated_illustrations')
    .select('image_url')
    .eq('prompt_key', promptKey)
    .single();
    
  if (cached) {
    return new Response(JSON.stringify({ imageUrl: cached.image_url }));
  }
  
  // Generate new illustration
  const prompt = type === 'dish' 
    ? `A playful vector illustration of ${dishName}. Cute cartoon style with soft gradients...`
    : `A whimsical robot chef character...`;
    
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"]
    }),
  });
  
  const data = await response.json();
  const imageBase64 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  
  // Upload to storage bucket
  const fileName = `${promptKey}.png`;
  // ... upload logic ...
  
  // Cache in database
  await supabase.from('generated_illustrations').insert({
    prompt_key: promptKey,
    image_url: publicUrl,
    dish_name: dishName,
    illustration_type: type
  });
  
  return new Response(JSON.stringify({ imageUrl: publicUrl }));
});
```

---

## Expected Results

After implementation:

1. **Order Cards** display AI-generated vector-style food illustrations matching the reference image aesthetic
2. **Chef Avatars** are playful robot/creature characters instead of emoji
3. **Illustrations are cached** in the database to avoid regeneration costs
4. **Graceful fallbacks** ensure the app works even if generation fails
5. **Consistent art style** across all generated images through careful prompt engineering

---

## Technical Considerations

### Image Size Management
- Generated images can be large (base64)
- Upload to storage bucket immediately
- Store only public URLs in the database
- This prevents passing large payloads to the frontend

### Generation Time
- AI image generation takes 3-10 seconds
- Show loading placeholder with gradient animation
- Pre-generate common dishes on first load

### Cost Efficiency
- Cache all generated images
- Hash dish names to create unique prompt keys
- Avoid regenerating for identical prompts

