import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightIfNeeded } from "../_shared/cors.ts";
import { errorResponse } from "../_shared/errors.ts";
import { validateSfxInput } from "../_shared/validation.ts";

serve(async (req) => {
  const preflightResponse = handleCorsPreflightIfNeeded(req);
  if (preflightResponse) return preflightResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      return errorResponse('ELEVENLABS_API_KEY not configured', 500, corsHeaders);
    }

    const body = await req.json();
    const { prompt, duration } = validateSfxInput(body);

    const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        duration_seconds: duration,
        prompt_influence: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('ElevenLabs API error:', response.status);
      return errorResponse(
        `ElevenLabs API error: ${response.status}`,
        response.status,
        corsHeaders,
      );
    }

    const audioBuffer = await response.arrayBuffer();

    if (audioBuffer.byteLength < 1000) {
      return errorResponse('Sound generation failed - audio too short', 500, corsHeaders);
    }

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (error) {
    console.error('SFX generation error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to generate sound effect',
      500,
      corsHeaders,
    );
  }
});
