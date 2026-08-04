import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { readJsonBody, requireString, guardResponse } from "../_shared/guard.ts";
import { enforceRateLimit, rateLimitResponse } from "../_shared/ratelimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body = await readJsonBody<Record<string, unknown>>(req, 4 * 1024);
    const prompt = requireString(body.prompt, "prompt", 300);
    const rawDuration = typeof body.duration === "number" ? body.duration : 3;
    const duration = Math.min(Math.max(rawDuration, 0.5), 10);

    await enforceRateLimit(req, "sfx", 100, 3600);


    console.log(`Generating SFX: "${prompt}" (${duration}s)`);

    const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        duration_seconds: Math.min(duration, 10), // Cap at 10 seconds
        prompt_influence: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    // Validate audio size (empty or too small = failed generation)
    if (audioBuffer.byteLength < 1000) {
      console.error('Audio response too small, likely failed generation:', audioBuffer.byteLength, 'bytes');
      return new Response(
        JSON.stringify({ error: 'Sound generation failed - audio too short' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });

  } catch (error) {
    const guarded = guardResponse(error, corsHeaders);
    if (guarded) return guarded;
    console.error('SFX generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate sound effect';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
