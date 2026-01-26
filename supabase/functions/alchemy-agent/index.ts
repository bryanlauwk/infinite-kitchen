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
    const { action, ingredients } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build ingredient description
    const ingredientDesc = ingredients.map((i: { emoji: string; name: string }) => 
      `${i.emoji} ${i.name}`
    ).join(" + ");

    const systemPrompt = `You are an alchemy agent that determines what happens when cooking actions are performed on ingredients.

You must respond with a JSON object describing the result AND classify whether this result reveals a new base ingredient.

A result is a DISCOVERY (isDiscovery: true) only if it:
- Reveals a previously hidden component (egg → egg yolk, egg white)
- Extracts a new base ingredient (clarify butter → ghee)
- Separates into fundamental components (zest lemon → lemon zest)

A result is NOT a discovery (isDiscovery: false) if it:
- Is an intermediate cooking step (seared beef, whisked eggs)
- Is a prepared dish (scrambled eggs, avocado toast, fruit salad)
- Is a transformed combination (mixed vegetables, salad)

Be creative but realistic. Consider:
- What would actually happen when you ${action} these ingredients?
- What is the resulting food item called?
- Pick an appropriate emoji that represents the result
- Give a brief poetic description

Examples:
- crack([🥚 egg]) → {resultName: "Raw Egg", isDiscovery: false} - opening shell
- separate([🥚 raw egg]) → {resultName: "Egg Yolk", isDiscovery: true} - reveals component
- clarify([🧈 butter]) → {resultName: "Ghee", isDiscovery: true} - extracts new ingredient
- pan_fry([🍳 egg_mixture]) → {resultName: "Scrambled Eggs", isDiscovery: false} - cooking step
- toss([🍎 fruit]) → {resultName: "Fruit Salad", isDiscovery: false} - combined dish`;

    const userPrompt = `Action: ${action}
Ingredients: ${ingredientDesc}

What is the result?`;

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
              name: "create_result",
              description: "Create the result of the alchemy action",
              parameters: {
                type: "object",
                properties: {
                  resultName: {
                    type: "string",
                    description: "Human readable name for the result (e.g., 'Scrambled Eggs', 'Melted Butter')"
                  },
                  resultId: {
                    type: "string",
                    description: "Snake_case ID for the result (e.g., 'scrambled_eggs', 'melted_butter')"
                  },
                  emoji: {
                    type: "string",
                    description: "Single emoji representing the result"
                  },
                  description: {
                    type: "string",
                    description: "Brief poetic description of the result (under 10 words)"
                  },
                  isDiscovery: {
                    type: "boolean",
                    description: "True only if this reveals a new base ingredient component (like separating egg into yolk/white, or clarifying butter into ghee). False for cooking steps, intermediate results, and dishes."
                  }
                },
                required: ["resultName", "resultId", "emoji", "description", "isDiscovery"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_result" } }
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
    console.log("AI Response:", JSON.stringify(data, null, 2));
    
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    let result;
    
    if (toolCalls && toolCalls.length > 0) {
      // Parse from tool call
      result = JSON.parse(toolCalls[0].function.arguments);
    } else {
      // Fallback: try to parse from text content
      const content = data.choices?.[0]?.message?.content;
      console.log("No tool call, trying to parse content:", content);
      
      if (content) {
        // Try to extract JSON from content
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (e) {
            console.error("Failed to parse JSON from content:", e);
          }
        }
      }
      
      // If still no result, generate a sensible default
      if (!result) {
        const actionVerb = action.replace(/_/g, ' ');
        const ingredientNames = ingredients.map((i: { name: string }) => i.name).join(' and ');
        result = {
          resultName: `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)}ed ${ingredientNames}`,
          resultId: `${action}_${ingredients.map((i: { name: string }) => i.name.toLowerCase().replace(/\s+/g, '_')).join('_')}`,
          emoji: ingredients[0]?.emoji || '🍳',
          description: `${ingredientNames} after ${actionVerb}ing`,
          isDiscovery: false
        };
        console.log("Using fallback result:", result);
      }
    }

    // Ensure isDiscovery has a default value if missing
    if (result.isDiscovery === undefined) {
      result.isDiscovery = false;
    }

    return new Response(JSON.stringify({
      resultName: result.resultName,
      resultId: result.resultId,
      emoji: result.emoji,
      description: result.description,
      isDiscovery: result.isDiscovery
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Alchemy agent error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
