import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// All 102 cooking tools as Gemini function definitions
const cookingTools = [
  // Heat tools
  { name: "grill", description: "Apply direct high heat with char marks. Best for: meats, vegetables, bread." },
  { name: "pan_fry", description: "Cook in shallow oil over medium-high heat. Best for: eggs, fish, cutlets." },
  { name: "deep_fry", description: "Submerge in hot oil for crispy results. Best for: chicken, potatoes, dough." },
  { name: "saute", description: "Quick cook in small amount of fat with tossing. Best for: vegetables, shrimp." },
  { name: "stir_fry", description: "High heat quick cooking with constant motion. Best for: Asian dishes, vegetables." },
  { name: "sear", description: "High heat browning to create crust. Best for: steaks, scallops, tuna." },
  { name: "roast", description: "Dry heat in oven, uncovered. Best for: whole chicken, vegetables, nuts." },
  { name: "bake", description: "Dry heat in oven for even cooking. Best for: bread, pastries, casseroles." },
  { name: "broil", description: "Intense top-down heat. Best for: melting cheese, finishing dishes, fish." },
  { name: "smoke", description: "Low heat with wood smoke flavor. Best for: meats, fish, cheese." },
  { name: "flambe", description: "Ignite alcohol for caramelization. Best for: desserts, sauces." },
  { name: "torch", description: "Direct flame for browning. Best for: crème brûlée, meringue, peppers." },
  
  // Liquid heat tools
  { name: "boil", description: "Cook in rapidly bubbling water (212°F). Best for: pasta, eggs, vegetables." },
  { name: "simmer", description: "Gentle bubbling below boiling. Best for: soups, sauces, stews." },
  { name: "poach", description: "Cook gently in liquid below simmer. Best for: eggs, fish, fruit." },
  { name: "steam", description: "Cook with hot vapor. Best for: vegetables, dumplings, fish." },
  { name: "blanch", description: "Brief boil then ice bath. Best for: vegetables, tomato peeling." },
  { name: "braise", description: "Sear then slow cook in liquid. Best for: tough meats, root vegetables." },
  { name: "stew", description: "Slow cook submerged in liquid. Best for: meat chunks, beans." },
  { name: "reduce", description: "Simmer to concentrate flavors. Best for: sauces, stocks, glazes." },
  { name: "deglaze", description: "Add liquid to hot pan to lift fond. Best for: pan sauces." },
  
  // Cutting tools
  { name: "chop", description: "Cut into rough irregular pieces. Best for: onions, herbs, vegetables." },
  { name: "dice", description: "Cut into uniform cubes. Best for: vegetables, fruits, meats." },
  { name: "mince", description: "Cut into very fine pieces. Best for: garlic, ginger, herbs." },
  { name: "slice", description: "Cut into thin flat pieces. Best for: bread, tomatoes, meat." },
  { name: "julienne", description: "Cut into thin matchstick strips. Best for: carrots, peppers, ginger." },
  { name: "chiffonade", description: "Roll and slice into ribbons. Best for: basil, leafy greens." },
  { name: "brunoise", description: "Fine dice (1-2mm cubes). Best for: garnishes, mirepoix." },
  { name: "cube", description: "Cut into larger uniform cubes. Best for: bread, cheese, meat." },
  { name: "wedge", description: "Cut into triangular sections. Best for: potatoes, citrus, tomatoes." },
  { name: "segment", description: "Separate citrus between membranes. Best for: oranges, grapefruit." },
  { name: "butterfly", description: "Split and open flat. Best for: shrimp, chicken breast, steak." },
  { name: "score", description: "Make shallow cuts on surface. Best for: fish, bread dough, duck." },
  { name: "carve", description: "Cut cooked meat into serving pieces. Best for: roasts, poultry." },
  { name: "fillet", description: "Remove bones from fish or meat. Best for: fish, chicken breast." },
  { name: "debone", description: "Remove all bones. Best for: chicken, fish, game." },
  { name: "trim", description: "Remove unwanted fat or edges. Best for: meat, vegetables." },
  { name: "peel", description: "Remove outer skin or rind. Best for: fruits, vegetables, shrimp." },
  { name: "zest", description: "Remove colored outer citrus peel. Best for: lemons, limes, oranges." },
  { name: "grate", description: "Shred against grater holes. Best for: cheese, ginger, nutmeg." },
  { name: "shred", description: "Tear or cut into thin strips. Best for: cabbage, chicken, cheese." },
  { name: "spiralize", description: "Cut into spiral noodle shapes. Best for: zucchini, carrots, beets." },
  
  // Mixing tools
  { name: "mix", description: "Combine ingredients together. Best for: batters, doughs, salads." },
  { name: "stir", description: "Move ingredients in circular motion. Best for: soups, risotto, sauces." },
  { name: "whisk", description: "Beat rapidly to incorporate air. Best for: eggs, cream, sauces." },
  { name: "beat", description: "Vigorously mix to add air. Best for: eggs, batter, cream." },
  { name: "fold", description: "Gently combine with lifting motion. Best for: egg whites, mousse." },
  { name: "knead", description: "Work dough with hands. Best for: bread, pasta, pastry." },
  { name: "cream", description: "Beat fat and sugar until fluffy. Best for: cakes, cookies." },
  { name: "blend", description: "Process until smooth. Best for: smoothies, soups, sauces." },
  { name: "puree", description: "Process into smooth paste. Best for: vegetables, fruits, beans." },
  { name: "emulsify", description: "Combine oil and water-based liquids. Best for: mayonnaise, vinaigrettes." },
  { name: "whip", description: "Beat to incorporate maximum air. Best for: cream, egg whites." },
  
  // Preparation tools
  { name: "marinate", description: "Soak in flavored liquid. Best for: meats, tofu, vegetables." },
  { name: "brine", description: "Soak in salt water solution. Best for: poultry, pork, pickles." },
  { name: "cure", description: "Preserve with salt/sugar. Best for: bacon, salmon, egg yolks." },
  { name: "tenderize", description: "Break down tough fibers. Best for: tough meats." },
  { name: "season", description: "Add salt, pepper, and spices. Best for: everything." },
  { name: "coat", description: "Cover surface with dry or wet mixture. Best for: breading, batters." },
  { name: "bread", description: "Coat with flour, egg, crumbs. Best for: cutlets, vegetables." },
  { name: "dredge", description: "Coat lightly with flour. Best for: before frying, sautéing." },
  { name: "stuff", description: "Fill cavity with filling. Best for: poultry, peppers, pasta." },
  { name: "roll", description: "Shape by rolling motion. Best for: sushi, pasta, dough." },
  { name: "shape", description: "Form into specific shape. Best for: cookies, meatballs, dumplings." },
  { name: "press", description: "Apply pressure to flatten or extract. Best for: tofu, garlic, panini." },
  { name: "strain", description: "Separate solids from liquid. Best for: stocks, sauces, pasta." },
  { name: "sift", description: "Pass through fine mesh. Best for: flour, cocoa, powdered sugar." },
  { name: "drain", description: "Remove excess liquid. Best for: pasta, vegetables, fried foods." },
  { name: "rinse", description: "Wash with water. Best for: rice, vegetables, beans." },
  { name: "soak", description: "Submerge in liquid to soften. Best for: beans, dried fruits, bread." },
  { name: "rest", description: "Let sit to redistribute juices. Best for: meats, doughs." },
  { name: "temper", description: "Gradually adjust temperature. Best for: chocolate, eggs in sauce." },
  
  // Finishing tools
  { name: "garnish", description: "Add decorative finishing touch. Best for: all plated dishes." },
  { name: "plate", description: "Arrange food on serving dish. Best for: final presentation." },
  { name: "drizzle", description: "Pour in thin stream. Best for: sauces, oils, glazes." },
  { name: "sprinkle", description: "Scatter small amounts. Best for: herbs, spices, toppings." },
  { name: "dust", description: "Lightly coat with powder. Best for: powdered sugar, cocoa." },
  { name: "glaze", description: "Coat with shiny finish. Best for: pastries, hams, vegetables." },
  { name: "sauce", description: "Add finishing sauce. Best for: proteins, pasta, desserts." },
  { name: "top", description: "Add final layer on top. Best for: pizza, salads, desserts." },
  
  // Temperature tools
  { name: "chill", description: "Cool in refrigerator. Best for: desserts, salads, drinks." },
  { name: "freeze", description: "Solidify in freezer. Best for: ice cream, sorbet, frozen desserts." },
  { name: "thaw", description: "Bring frozen items to temp. Best for: frozen proteins, vegetables." },
  { name: "warm", description: "Gently heat without cooking further. Best for: plates, bread, sauces." },
  { name: "room_temp", description: "Bring to room temperature. Best for: butter, eggs, meat before cooking." },
  
  // Transformation tools
  { name: "caramelize", description: "Heat sugar until brown and nutty. Best for: onions, sugar, fruits." },
  { name: "melt", description: "Heat solid until liquid. Best for: butter, chocolate, cheese." },
  { name: "toast", description: "Brown with dry heat. Best for: bread, nuts, spices." },
  { name: "char", description: "Burn surface slightly. Best for: peppers, corn, citrus." },
  { name: "infuse", description: "Extract flavor into liquid. Best for: oils, creams, teas." },
  { name: "ferment", description: "Transform through bacterial action. Best for: pickles, kimchi, yogurt." },
  { name: "pickle", description: "Preserve in acidic solution. Best for: vegetables, eggs, fruits." },
  { name: "candy", description: "Cook in sugar syrup. Best for: nuts, fruits, citrus peel." },
  { name: "crystallize", description: "Form sugar crystals on surface. Best for: flowers, ginger, citrus." },
  { name: "dehydrate", description: "Remove moisture. Best for: fruits, jerky, herbs." },
  { name: "rehydrate", description: "Add moisture back. Best for: dried mushrooms, sun-dried tomatoes." },
  
  // Specialty tools
  { name: "crack", description: "Break open shell or casing. Best for: eggs, nuts, crab." },
  { name: "shell", description: "Remove outer shell. Best for: shrimp, eggs, nuts." },
  { name: "devein", description: "Remove digestive tract. Best for: shrimp." },
  { name: "core", description: "Remove center seeds/stem. Best for: apples, peppers, tomatoes." },
  { name: "seed", description: "Remove seeds. Best for: peppers, tomatoes, cucumbers." },
  { name: "pit", description: "Remove stone/pit. Best for: cherries, peaches, olives." },
  { name: "hull", description: "Remove leafy top. Best for: strawberries, tomatoes." },
  { name: "crush", description: "Break down with force. Best for: garlic, ice, crackers." },
  { name: "grind", description: "Reduce to powder. Best for: coffee, spices, meat." },
  { name: "pound", description: "Flatten with mallet. Best for: chicken breast, veal, garlic." },
  { name: "muddle", description: "Crush to release oils. Best for: herbs, citrus for cocktails." },
  
  // Final action
  { name: "serve", description: "Present the finished dish to fulfill the order. This is the final action." },
];

// Convert to Gemini tool format
const tools = cookingTools.map(tool => ({
  type: "function" as const,
  function: {
    name: tool.name,
    description: tool.description,
    parameters: {
      type: "object",
      properties: {
        ingredients: {
          type: "array",
          items: { type: "string" },
          description: "Array of ingredient IDs to use with this action"
        }
      },
      required: ["ingredients"]
    }
  }
}));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inventory, order, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build system prompt with inventory context
    const inventoryList = inventory.map((i: { emoji: string; name: string; id: string }) => 
      `${i.emoji} ${i.name} (id: ${i.id})`
    ).join(", ");

    const systemPrompt = `You are a master chef AI that cooks dishes by calling cooking functions.

CURRENT INVENTORY:
${inventoryList}

ORDER TO FULFILL: ${order.emoji} ${order.dishName}

RULES:
1. You can ONLY use ingredients from the inventory above
2. Each function call transforms ingredients into a new ingredient
3. Chain multiple function calls to build complex dishes
4. When the dish is complete, call serve() with the final result
5. Be creative but logical - the alchemy agent will determine what each action produces
6. Think step by step and explain your reasoning briefly

IMPORTANT: Always use ingredient IDs (not names) in function calls.
When you're done cooking, call serve() with the final dish ingredient.`;

    // Build messages - only add user prompt on first call
    const hasHistory = conversationHistory && conversationHistory.length > 0;
    const messages = [
      { role: "system", content: systemPrompt },
      ...(hasHistory ? conversationHistory.map((m: { role: string; content: string; name?: string }) => ({
        role: m.role,
        content: m.content,
        ...(m.name && { name: m.name })
      })) : []),
      // Only add user prompt if this is the first call or to continue
      { 
        role: "user", 
        content: hasHistory 
          ? "Continue cooking. What's your next step based on the results so far?" 
          : `Please cook: ${order.dishName}. Plan and execute step by step.`
      }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools,
        tool_choice: "auto",
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
    const choice = data.choices?.[0];
    
    if (!choice) {
      throw new Error("No response from AI");
    }

    const message = choice.message;
    const thinking = message.content || "";
    const toolCalls = message.tool_calls;

    // Check if there's a function call
    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      
      return new Response(JSON.stringify({
        thinking,
        functionCall: {
          name: functionName,
          ingredients: args.ingredients || []
        },
        isComplete: functionName === "serve"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No function call - might be thinking or done
    return new Response(JSON.stringify({
      thinking,
      functionCall: null,
      isComplete: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Cooking agent error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
