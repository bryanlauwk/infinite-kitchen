import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { servedDish, orderName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a fair but strict food judge. Your job is to determine if a served dish matches the customer's order.

You should use SEMANTIC SIMILARITY, not exact string matching:
- "Sunny Side Up Eggs" matches "Fried Eggs" ✓
- "Scrambled Eggs with Herbs" matches "Scrambled Eggs" ✓
- "Grilled Cheese Sandwich" matches "Grilled Cheese" ✓
- "Beef Stir-fry with Vegetables" matches "Beef Stir-fry" ✓
- "Spaghetti Carbonara" does NOT match "Spaghetti Bolognese" ✗

Be generous with variations and additions, but strict about fundamentally different dishes.`;

    const userPrompt = `ORDER: "${orderName}"
SERVED: "${servedDish}"

Does the served dish fulfill the order?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "judge_dish",
              description: "Provide judgment on whether the served dish matches the order",
              parameters: {
                type: "object",
                properties: {
                  match: {
                    type: "boolean",
                    description: "Whether the served dish fulfills the order"
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence score from 0-100"
                  },
                  reasoning: {
                    type: "string",
                    description: "Brief explanation of the judgment (under 30 words)"
                  }
                },
                required: ["match", "confidence", "reasoning"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "judge_dish" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "API credits exhausted. Please add credits to continue." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    
    if (!toolCalls || toolCalls.length === 0) {
      throw new Error("No tool call response from AI");
    }

    const result = JSON.parse(toolCalls[0].function.arguments);

    return new Response(JSON.stringify({
      match: result.match,
      confidence: result.confidence,
      reasoning: result.reasoning
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Judge agent error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
