import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightIfNeeded } from "../_shared/cors.ts";
import { errorResponse, handleGatewayError } from "../_shared/errors.ts";
import { validateCookingAgentInput } from "../_shared/validation.ts";
import { requireApiKey, callAIGateway } from "../_shared/api-client.ts";
import { cookingToolNames, geminiTools } from "../_shared/cooking-tools.ts";
import { getRecipeGuidance } from "../_shared/recipe-patterns.ts";
import { detectCuisine } from "../_shared/cuisine-patterns.ts";
import { normalizeIngredientId } from "../_shared/ingredient-normalizer.ts";

// Extract action from text content as fallback when AI doesn't return tool calls
function extractActionFromText(
  content: string,
  inventory: Array<{ id: string; name: string }>,
): { name: string; ingredients: string[] } | null {
  const patterns = [
    /(\w+)\s*\(\s*\[(.*?)\]\s*\)/,
    /(\w+)\s*\(\s*(.*?)\s*\)/,
    /I'll\s+(\w+)\s+(?:the\s+)?(.+?)(?:\.|,|$)/i,
    /Let me\s+(\w+)\s+(?:the\s+)?(.+?)(?:\.|,|$)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const actionName = match[1].toLowerCase();
      if (!cookingToolNames.has(actionName)) continue;

      const ingredientStr = match[2] || '';
      let ingredients: string[] = [];

      if (ingredientStr.includes('[') || ingredientStr.includes('"')) {
        try {
          ingredients = JSON.parse(`[${ingredientStr.replace(/'/g, '"')}]`);
        } catch {
          ingredients = ingredientStr.split(',').map(s => s.trim().replace(/['"]/g, ''));
        }
      } else {
        ingredients = ingredientStr.split(/,|\s+and\s+/).map(s => {
          const trimmed = s.trim().toLowerCase().replace(/^the\s+/, '');
          const found = inventory.find(i =>
            i.name.toLowerCase().includes(trimmed) ||
            i.id.toLowerCase().includes(trimmed.replace(/\s+/g, '_'))
          );
          return found?.id || trimmed.replace(/\s+/g, '_');
        }).filter(Boolean);
      }

      if (ingredients.length > 0) {
        return { name: actionName, ingredients };
      }
    }
  }

  return null;
}

serve(async (req) => {
  const preflightResponse = handleCorsPreflightIfNeeded(req);
  if (preflightResponse) return preflightResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    const body = await req.json();
    const { inventory, order, conversationHistory } = validateCookingAgentInput(body);
    const apiKey = requireApiKey();

    const inventoryList = inventory.map((i) =>
      `${i.emoji} ${i.name} (id: ${i.id})`
    ).join(", ");

    const cuisineContext = detectCuisine(order.dishName);

    let previousAttemptsContext = "";
    if (order.previousAttempts && order.previousAttempts.length > 0) {
      previousAttemptsContext = `\n\nPREVIOUS ATTEMPTS (FAILED):
${order.previousAttempts.map((attempt, i) => {
  let attemptText = `- Attempt ${i + 1}: Served "${attempt.servedDish}" - Rejected because: ${attempt.reasoning}`;
  if (attempt.customerFeedback) {
    attemptText += `\n  Customer feedback: "${attempt.customerFeedback}"`;
  }
  return attemptText;
}).join("\n")}

IMPORTANT: The previous attempt(s) were rejected. Try a DIFFERENT approach this time.
Consider using different techniques, ingredient combinations, or cooking methods.`;
    }

    let customerFeedbackContext = "";
    if (order.customerFeedback) {
      customerFeedbackContext = `\n\nCUSTOMER FEEDBACK FOR THIS ATTEMPT:
"${order.customerFeedback}"

Consider this feedback carefully when planning your cooking approach.`;
    }

    let cuisineGuidance = "";
    if (cuisineContext.type !== 'generic') {
      const regionLabel = cuisineContext.region.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      cuisineGuidance = `\n\nCUISINE CONTEXT: ${cuisineContext.type.charAt(0).toUpperCase() + cuisineContext.type.slice(1)} (${regionLabel})
${cuisineContext.hints.map((hint: string) => `- ${hint}`).join('\n')}`;
    }

    const recipeGuidance = getRecipeGuidance(order.dishName, order.difficulty || 'intermediate');

    const systemPrompt = `You are a master chef AI that cooks dishes by calling cooking functions.

CURRENT INVENTORY:
${inventoryList}

ORDER TO FULFILL: ${order.emoji} ${order.dishName}${cuisineGuidance}${recipeGuidance}${previousAttemptsContext}${customerFeedbackContext}

RULES:
1. You can ONLY use ingredients from the inventory above
2. Each function call transforms ingredients into a new ingredient
3. Chain multiple function calls to build complex dishes
4. When the dish is complete, call serve() with the final result
5. Be creative but logical - the alchemy agent will determine what each action produces
6. Think step by step and explain your reasoning briefly
7. ALWAYS call a cooking function - never respond with just text
8. For beginner/easy dishes: FOLLOW THE RECIPE GUIDANCE CLOSELY - do not overcomplicate
${cuisineContext.type !== 'generic' ? `9. Apply authentic ${cuisineContext.type} cooking techniques for best results` : ''}

IMPORTANT: Always use ingredient IDs (not names) in function calls.
When you're done cooking, call serve() with the final dish ingredient.
For simple dishes, the served dish name MUST match or closely resemble the ordered dish.`;

    const hasHistory = conversationHistory && conversationHistory.length > 0;
    const messages = [
      { role: "system", content: systemPrompt },
      ...(hasHistory ? conversationHistory.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.name && { name: m.name }),
      })) : []),
      {
        role: "user",
        content: hasHistory
          ? "Continue cooking. What's your next step based on the results so far? You MUST call a cooking function."
          : `Please cook: ${order.dishName}. Plan and execute step by step. Call a cooking function now.`,
      },
    ];

    const response = await callAIGateway(apiKey, {
      model: "google/gemini-3-flash-preview",
      messages,
      tools: geminiTools,
      tool_choice: "auto",
    });

    if (!response.ok) {
      const gatewayErr = handleGatewayError(response, corsHeaders);
      if (gatewayErr) return gatewayErr;
      console.error("AI Gateway error:", response.status);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice) {
      throw new Error("No response from AI");
    }

    const message = choice.message;
    const thinking = message.content || "";
    const toolCalls = message.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const functionName = toolCall.function.name;
      let args: { ingredients: string[] };

      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {
        args = { ingredients: [] };
      }

      const normalizedIngredients = (args.ingredients || []).map((rawId: string) =>
        normalizeIngredientId(rawId, inventory)
      );

      return new Response(JSON.stringify({
        thinking,
        functionCall: { name: functionName, ingredients: normalizedIngredients },
        isComplete: functionName === "serve",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: extract action from text
    const extractedAction = extractActionFromText(thinking, inventory);
    if (extractedAction) {
      return new Response(JSON.stringify({
        thinking,
        functionCall: extractedAction,
        isComplete: extractedAction.name === "serve",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Last resort: auto-serve if we have created ingredients
    const generatedIngredients = inventory.filter((i) => i.isGenerated);
    if (generatedIngredients.length > 0) {
      return new Response(JSON.stringify({
        thinking: thinking + "\n\n[Auto-completing order]",
        functionCall: {
          name: 'serve',
          ingredients: [generatedIngredients[generatedIngredients.length - 1].id],
        },
        isComplete: true,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      thinking,
      functionCall: null,
      isComplete: false,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Cooking agent error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error",
      500,
      corsHeaders,
    );
  }
});
