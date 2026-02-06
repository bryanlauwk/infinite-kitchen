import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders, handleCorsPreflightIfNeeded } from "../_shared/cors.ts";
import { errorResponse, handleGatewayError } from "../_shared/errors.ts";
import { validateJudgeAgentInput } from "../_shared/validation.ts";
import { requireApiKey, callAIGateway } from "../_shared/api-client.ts";

serve(async (req) => {
  const preflightResponse = handleCorsPreflightIfNeeded(req);
  if (preflightResponse) return preflightResponse;

  const corsHeaders = getCorsHeaders(req);

  try {
    const body = await req.json();
    const { servedDish, orderName } = validateJudgeAgentInput(body);
    const apiKey = requireApiKey();

    const systemPrompt = `You are a fair but strict food judge. Your job is to determine if a served dish matches the customer's order.

You should use SEMANTIC SIMILARITY, not exact string matching:
- "Sunny Side Up Eggs" matches "Fried Eggs" ✓
- "Scrambled Eggs with Herbs" matches "Scrambled Eggs" ✓
- "Grilled Cheese Sandwich" matches "Grilled Cheese" ✓
- "Beef Stir-fry with Vegetables" matches "Beef Stir-fry" ✓
- "Spaghetti Carbonara" does NOT match "Spaghetti Bolognese" ✗

Be generous with variations and additions, but strict about fundamentally different dishes.`;

    const response = await callAIGateway(apiKey, {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `ORDER: "${orderName}"\nSERVED: "${servedDish}"\n\nDoes the served dish fulfill the order?` },
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
                match: { type: "boolean", description: "Whether the served dish fulfills the order" },
                confidence: { type: "number", description: "Confidence score from 0-100" },
                reasoning: { type: "string", description: "Brief explanation of the judgment (under 30 words)" },
              },
              required: ["match", "confidence", "reasoning"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "judge_dish" } },
    });

    if (!response.ok) {
      const gatewayErr = handleGatewayError(response, corsHeaders);
      if (gatewayErr) return gatewayErr;
      console.error("AI Gateway error:", response.status);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCalls = data.choices?.[0]?.message?.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      try {
        const result = JSON.parse(toolCalls[0].function.arguments);
        return new Response(JSON.stringify({
          match: result.match,
          confidence: result.confidence,
          reasoning: result.reasoning,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (parseError) {
        console.error("Failed to parse tool call arguments:", parseError);
      }
    }

    // Fallback: heuristic from message content
    const content = data.choices?.[0]?.message?.content || "";
    const lowerContent = content.toLowerCase();
    const isMatch =
      lowerContent.includes('yes') ||
      lowerContent.includes('match') ||
      lowerContent.includes('fulfills') ||
      lowerContent.includes('correct') ||
      (lowerContent.includes('similar') && !lowerContent.includes('not similar'));
    const isReject =
      lowerContent.includes('no') ||
      lowerContent.includes('does not match') ||
      lowerContent.includes('different') ||
      lowerContent.includes('reject');
    const match = isMatch && !isReject;

    return new Response(JSON.stringify({
      match,
      confidence: 70,
      reasoning: content.slice(0, 100) || (match ? "Dish appears to match the order" : "Dish does not match the order"),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Judge agent error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unknown error",
      500,
      corsHeaders,
    );
  }
});
