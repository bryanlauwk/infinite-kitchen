import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { getCorsHeaders, handleCorsPreflightIfNeeded } from "../_shared/cors.ts";
import { errorResponse, handleGatewayError } from "../_shared/errors.ts";
import { validateIllustrationInput } from "../_shared/validation.ts";
import { requireApiKey, callAIGateway } from "../_shared/api-client.ts";

const illustrationPrompts: Record<string, (name: string) => string> = {
  dish: (name) => `Create a playful, vector-stylized illustration of "${name}" food dish.

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
- The food should look fun and appetizing but stylized like a cartoon`,

  chef: (name) => `Create a playful cartoon robot chef character mascot.

CRITICAL STYLE REQUIREMENTS:
- Cute, friendly robot or creature design
- Vector art style with soft gradients
- Round, squishy shapes - NOT angular or mechanical looking
- Warm, inviting expression with simple features
- ${name} color scheme and personality
- Clean pastel gradient background
- NO text, NO labels
- Think indie game mascot or app icon character
- Should feel approachable and whimsical
- Simple geometric shapes combined creatively`,

  ingredient: (name) => `Create a cute, playful vector illustration of a single "${name}" ingredient.

CRITICAL STYLE REQUIREMENTS:
- Cartoon/vector art style, NOT realistic
- Soft gradients with rounded, squishy shapes
- Single ingredient centered, simple and iconic
- Clean light pastel gradient background
- NO text, NO labels, NO words
- Think cute food app icon or emoji replacement
- Exaggerated, friendly proportions
- Soft drop shadows for depth
- Small square format, centered composition`,

  technique: (name) => `Create a playful vector icon representing the cooking technique "${name}".

CRITICAL STYLE REQUIREMENTS:
- Abstract, iconic representation of the cooking action
- Vector art style with soft gradients
- Simple geometric shapes suggesting the technique
- Could include stylized cooking tools or effects
- Clean light pastel gradient background
- NO text, NO labels, NO words
- Think indie game UI icon
- Warm, inviting colors
- Small square format, centered composition`,
};

function buildPrompt(dishName: string, type: string): string {
  const builder = illustrationPrompts[type];
  if (builder) return builder(dishName);

  return `Create a playful, vector-stylized illustration of "${dishName}".

CRITICAL STYLE REQUIREMENTS:
- Cartoon/vector art style, NOT realistic
- Soft gradients with rounded shapes
- Clean pastel gradient background
- NO text, NO labels`;
}

serve(async (req) => {
  const preflightResponse = handleCorsPreflightIfNeeded(req);
  if (preflightResponse) return preflightResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    const body = await req.json();
    const { dishName, type, promptKey } = validateIllustrationInput(body);
    const apiKey = requireApiKey();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables are not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check cache first
    const { data: cached } = await supabase
      .from('generated_illustrations')
      .select('image_url')
      .eq('prompt_key', promptKey)
      .single();

    if (cached) {
      return new Response(JSON.stringify({ imageUrl: cached.image_url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = buildPrompt(dishName, type);

    // Retry logic for image generation
    const MAX_RETRIES = 2;
    let imageDataUrl: string | null = null;
    let lastError = "";

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} for illustration: ${dishName}`);
      }

      const response = await callAIGateway(apiKey, {
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt + "\n\nIMPORTANT: You MUST generate and return an image. Do not respond with text only." }],
        modalities: ["image", "text"],
      });

      if (!response.ok) {
        const gatewayErr = handleGatewayError(response, corsHeaders);
        if (gatewayErr) return gatewayErr;
        console.error("AI gateway error:", response.status);
        lastError = `AI gateway error: ${response.status}`;
        continue;
      }

      const data = await response.json();
      imageDataUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageDataUrl) break;
      lastError = "No image generated";
    }

    if (!imageDataUrl) {
      throw new Error(lastError || "No image generated");
    }

    const base64Match = imageDataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      throw new Error("Invalid image data URL format");
    }

    const imageFormat = base64Match[1];
    const base64Data = base64Match[2];
    const imageBytes = decode(base64Data);

    const fileName = `${promptKey}.${imageFormat}`;
    const { error: uploadError } = await supabase.storage
      .from('illustrations')
      .upload(fileName, imageBytes, {
        contentType: `image/${imageFormat}`,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('illustrations')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    const { error: insertError } = await supabase
      .from('generated_illustrations')
      .insert({
        prompt_key: promptKey,
        image_url: publicUrl,
        dish_name: dishName,
        illustration_type: type,
      });

    if (insertError) {
      console.error("Cache insert error:", insertError);
    }

    return new Response(JSON.stringify({ imageUrl: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("generate-illustration error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error",
      500,
      corsHeaders,
    );
  }
});
