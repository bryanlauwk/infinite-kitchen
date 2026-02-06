import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightIfNeeded } from "../_shared/cors.ts";
import { errorResponse, handleGatewayError } from "../_shared/errors.ts";
import { validateAlchemyAgentInput } from "../_shared/validation.ts";
import { requireApiKey, callAIGateway } from "../_shared/api-client.ts";

serve(async (req) => {
  const preflightResponse = handleCorsPreflightIfNeeded(req);
  if (preflightResponse) return preflightResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    const body = await req.json();
    const { action, ingredients } = validateAlchemyAgentInput(body);
    const apiKey = requireApiKey();

    const ingredientDesc = ingredients.map((i) =>
      `${i.emoji} ${i.name}`
    ).join(" + ");

    const systemPrompt = `You are an alchemy agent that determines what happens when cooking actions are performed on ingredients.

You must respond with a JSON object describing the result AND classify whether this result reveals a new BASE ingredient.

IMPORTANT: isDiscovery should be TRUE only in RARE cases:
- Separating an egg reveals egg yolk and egg white (hidden components)
- Clarifying butter produces ghee (extracted pure ingredient)
- Zesting a lemon produces lemon zest (separated component)
- Cracking a coconut reveals coconut water and coconut meat
- Rendering fat from bacon produces rendered bacon fat

isDiscovery should be FALSE for (almost everything):
- Any cooked result (scrambled eggs, grilled chicken, sautéed vegetables)
- Any mixed result (fruit salad, mixed greens, combined ingredients)
- Any transformed dish (toast, soup, sauce, puree, salad)
- Any intermediate cooking step (whisked eggs, seared beef, chopped onions)
- Opening/cracking items (cracked egg is still egg, not a discovery)

Most actions result in isDiscovery: false. Only true component extraction/separation = discovery.

Be creative but realistic. Consider:
- What would actually happen when you ${action} these ingredients?
- What is the resulting food item called?
- Pick an appropriate emoji that represents the result
- Give a brief poetic description (under 10 words)

Examples:
- crack([🥚 egg]) → {resultName: "Raw Egg", isDiscovery: false}
- separate([🥚 raw egg]) → {resultName: "Egg Yolk", isDiscovery: true}
- clarify([🧈 butter]) → {resultName: "Ghee", isDiscovery: true}
- whisk([🥚 raw egg]) → {resultName: "Whisked Egg", isDiscovery: false}
- pan_fry([🍳 whisked egg]) → {resultName: "Scrambled Eggs", isDiscovery: false}
- toss([🍎 fruit]) → {resultName: "Fruit Salad", isDiscovery: false}`;

    const response = await callAIGateway(apiKey, {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Action: ${action}\nIngredients: ${ingredientDesc}\n\nWhat is the result?` },
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
                resultName: { type: "string", description: "Human readable name for the result" },
                resultId: { type: "string", description: "Snake_case ID for the result" },
                emoji: { type: "string", description: "Single emoji representing the result" },
                description: { type: "string", description: "Brief poetic description (under 10 words)" },
                isDiscovery: { type: "boolean", description: "Almost always FALSE. Only TRUE for component extraction." },
              },
              required: ["resultName", "resultId", "emoji", "description", "isDiscovery"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "create_result" } },
    });

    if (!response.ok) {
      const gatewayErr = handleGatewayError(response, corsHeaders);
      if (gatewayErr) return gatewayErr;
      console.error("AI Gateway error:", response.status);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    let result;

    if (toolCalls && toolCalls.length > 0) {
      try {
        result = JSON.parse(toolCalls[0].function.arguments);
      } catch (parseError) {
        console.error("Failed to parse tool call arguments:", parseError);
      }
    }

    if (!result) {
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch {
            // Fall through to default
          }
        }
      }
    }

    if (!result) {
      const actionVerb = action.replace(/_/g, ' ');
      const ingredientNames = ingredients.map((i) => i.name).join(' and ');
      result = {
        resultName: `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)}ed ${ingredientNames}`,
        resultId: `${action}_${ingredients.map((i) => i.name.toLowerCase().replace(/\s+/g, '_')).join('_')}`,
        emoji: ingredients[0]?.emoji || '🍳',
        description: `${ingredientNames} after ${actionVerb}ing`,
        isDiscovery: false,
      };
    }

    if (result.isDiscovery === undefined) {
      result.isDiscovery = false;
    }

    return new Response(JSON.stringify({
      resultName: result.resultName,
      resultId: result.resultId,
      emoji: result.emoji,
      description: result.description,
      isDiscovery: result.isDiscovery,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Alchemy agent error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error",
      500,
      corsHeaders,
    );
  }
});
