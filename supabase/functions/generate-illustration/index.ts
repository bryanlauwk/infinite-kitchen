import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { readJsonBody, requireString, requirePromptKey, guardResponse, GuardError } from "../_shared/guard.ts";
import { enforceRateLimit, rateLimitResponse } from "../_shared/ratelimit.ts";

const ALLOWED_TYPES = ["dish", "chef", "ingredient", "technique"];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await readJsonBody<Record<string, unknown>>(req, 8 * 1024);
    const dishName = requireString(body.dishName, "dishName", 600);
    const type = requireString(body.type, "type", 20);
    if (!ALLOWED_TYPES.includes(type)) {
      throw new GuardError("type must be one of: dish, chef, ingredient, technique");
    }
    const promptKey = requirePromptKey(body.promptKey);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check cache first
    const { data: cached } = await supabase
      .from('generated_illustrations')
      .select('image_url')
      .eq('prompt_key', promptKey)
      .single();

    if (cached) {
      console.log(`Cache hit for: ${promptKey}`);
      return new Response(JSON.stringify({ imageUrl: cached.image_url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Only paid generations count against the cap; cache hits stay free.
    await enforceRateLimit(req, "illustration", 60, 3600);

    console.log(`Generating illustration for: ${dishName} (type: ${type})`);

    // Build the prompt based on type
    let prompt: string;
    
    if (type === 'dish') {
      prompt = `Create a playful, vector-stylized illustration of "${dishName}" food dish.

CRITICAL STYLE REQUIREMENTS:
- Cartoon/vector art style, absolutely NOT realistic or photographic
- Soft gradients with rounded, squishy shapes
- Playful and whimsical, slightly surreal and fantastical
- Clean light pastel gradient background (soft pink, peach, lavender, or mint)
- Single centered food item, large and prominent
- NO text, NO labels, NO words anywhere
- Reminiscent of neal.fun or indie web game aesthetic
- Think "squishy", "juicy" app icons from early 2010s design
- Exaggerated, cute proportions
- Soft drop shadows for depth
- The food should look fun and appetizing but stylized like a cartoon`;
    } else if (type === 'chef') {
      // Chef avatar
      prompt = `Create a playful cartoon robot chef character mascot.

CRITICAL STYLE REQUIREMENTS:
- Cute, friendly robot or creature design
- Vector art style with soft gradients
- Round, squishy shapes - NOT angular or mechanical looking
- Warm, inviting expression with simple features
- ${dishName} color scheme and personality
- Clean pastel gradient background
- NO text, NO labels
- Think indie game mascot or app icon character
- Should feel approachable and whimsical
- Simple geometric shapes combined creatively`;
    } else if (type === 'ingredient') {
      // Ingredient icon
      prompt = `Create a cute, playful vector illustration of a single "${dishName}" ingredient.

CRITICAL STYLE REQUIREMENTS:
- Cartoon/vector art style, NOT realistic
- Soft gradients with rounded, squishy shapes  
- Single ingredient centered, simple and iconic
- Clean light pastel gradient background
- NO text, NO labels, NO words
- Think cute food app icon or emoji replacement
- Exaggerated, friendly proportions
- Soft drop shadows for depth
- Small square format, centered composition`;
    } else if (type === 'technique') {
      // Cooking technique icon
      prompt = `Create a playful vector icon representing the cooking technique "${dishName}".

CRITICAL STYLE REQUIREMENTS:
- Abstract, iconic representation of the cooking action
- Vector art style with soft gradients
- Simple geometric shapes suggesting the technique
- Could include stylized cooking tools or effects
- Clean light pastel gradient background
- NO text, NO labels, NO words
- Think indie game UI icon
- Warm, inviting colors
- Small square format, centered composition`;
    } else {
      prompt = `Create a playful, vector-stylized illustration of "${dishName}".
      
CRITICAL STYLE REQUIREMENTS:
- Cartoon/vector art style, NOT realistic
- Soft gradients with rounded shapes
- Clean pastel gradient background
- NO text, NO labels`;
    }

    // Retry logic for image generation
    const MAX_RETRIES = 2;
    let imageDataUrl: string | null = null;
    let lastError: string = "";

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} for: ${dishName}`);
      }

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{ role: "user", content: prompt + "\n\nIMPORTANT: You MUST generate and return an image. Do not respond with text only." }],
          modalities: ["image", "text"]
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later" }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "Payment required" }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        lastError = `AI gateway error: ${response.status}`;
        continue; // Retry on server errors
      }

      const data = await response.json();
      imageDataUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageDataUrl) {
        break; // Success, exit retry loop
      }

      console.log(`No image in response (attempt ${attempt + 1}):`, data.choices?.[0]?.message?.content?.slice(0, 100));
      lastError = "No image generated";
    }

    if (!imageDataUrl) {
      console.error(`Failed to generate image after ${MAX_RETRIES + 1} attempts for: ${dishName}`);
      throw new Error(lastError || "No image generated");
    }

    // Extract base64 data from data URL
    const base64Match = imageDataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      throw new Error("Invalid image data URL format");
    }

    const imageFormat = base64Match[1];
    const base64Data = base64Match[2];
    const imageBytes = decode(base64Data);

    // Upload to storage bucket
    const fileName = `${promptKey}.${imageFormat}`;
    const { error: uploadError } = await supabase.storage
      .from('illustrations')
      .upload(fileName, imageBytes, {
        contentType: `image/${imageFormat}`,
        upsert: true
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('illustrations')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Cache in database
    const { error: insertError } = await supabase
      .from('generated_illustrations')
      .insert({
        prompt_key: promptKey,
        image_url: publicUrl,
        dish_name: dishName,
        illustration_type: type
      });

    if (insertError) {
      console.error("Cache insert error:", insertError);
      // Don't fail the request, just log
    }

    console.log(`Generated and cached: ${publicUrl}`);

    return new Response(JSON.stringify({ imageUrl: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const limited = rateLimitResponse(error, corsHeaders);
    if (limited) return limited;
    const guarded = guardResponse(error, corsHeaders);
    if (guarded) return guarded;
    console.error("generate-illustration error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
