// Shared input validation for Supabase Edge Functions

/** Maximum length for a dish name to prevent abuse. */
const MAX_DISH_NAME_LENGTH = 200;

/** Maximum number of ingredients in a single request. */
const MAX_INGREDIENTS = 200;

/** Maximum conversation history messages per request. */
const MAX_CONVERSATION_MESSAGES = 100;

/** Maximum length for a single string field (prompts, feedback, etc.). */
const MAX_STRING_LENGTH = 2000;

/**
 * Strips HTML tags and trims whitespace from a string.
 */
export function sanitizeString(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Validates and sanitizes cooking-agent request body.
 * Throws on invalid input.
 */
export function validateCookingAgentInput(body: unknown): {
  inventory: Array<{ id: string; name: string; emoji: string; category?: string; isGenerated?: boolean }>;
  order: {
    dishName: string;
    emoji: string;
    difficulty?: string;
    previousAttempts?: Array<{ servedDish: string; reasoning: string; customerFeedback?: string }>;
    customerFeedback?: string;
  };
  conversationHistory: Array<{ role: string; content: string; name?: string }>;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  const { inventory, order, conversationHistory } = body as Record<string, unknown>;

  if (!Array.isArray(inventory)) {
    throw new Error("inventory must be an array");
  }
  if (inventory.length > MAX_INGREDIENTS) {
    throw new Error(`inventory exceeds maximum of ${MAX_INGREDIENTS} items`);
  }

  if (!order || typeof order !== "object") {
    throw new Error("order must be an object");
  }
  const orderObj = order as Record<string, unknown>;
  if (typeof orderObj.dishName !== "string" || !orderObj.dishName) {
    throw new Error("order.dishName is required");
  }
  if (orderObj.dishName.length > MAX_DISH_NAME_LENGTH) {
    throw new Error(`order.dishName exceeds maximum length of ${MAX_DISH_NAME_LENGTH}`);
  }
  orderObj.dishName = sanitizeString(orderObj.dishName);

  if (orderObj.customerFeedback && typeof orderObj.customerFeedback === "string") {
    if (orderObj.customerFeedback.length > MAX_STRING_LENGTH) {
      throw new Error(`customerFeedback exceeds maximum length of ${MAX_STRING_LENGTH}`);
    }
    orderObj.customerFeedback = sanitizeString(orderObj.customerFeedback);
  }

  const history = Array.isArray(conversationHistory) ? conversationHistory : [];
  if (history.length > MAX_CONVERSATION_MESSAGES) {
    throw new Error(`conversationHistory exceeds maximum of ${MAX_CONVERSATION_MESSAGES} messages`);
  }

  return {
    inventory: inventory as ReturnType<typeof validateCookingAgentInput>["inventory"],
    order: orderObj as ReturnType<typeof validateCookingAgentInput>["order"],
    conversationHistory: history as ReturnType<typeof validateCookingAgentInput>["conversationHistory"],
  };
}

/**
 * Validates and sanitizes alchemy-agent request body.
 */
export function validateAlchemyAgentInput(body: unknown): {
  action: string;
  ingredients: Array<{ emoji: string; name: string }>;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  const { action, ingredients } = body as Record<string, unknown>;

  if (typeof action !== "string" || !action) {
    throw new Error("action is required");
  }
  if (action.length > 100) {
    throw new Error("action exceeds maximum length");
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error("ingredients must be a non-empty array");
  }
  if (ingredients.length > MAX_INGREDIENTS) {
    throw new Error(`ingredients exceeds maximum of ${MAX_INGREDIENTS}`);
  }

  return {
    action: sanitizeString(action),
    ingredients: ingredients as ReturnType<typeof validateAlchemyAgentInput>["ingredients"],
  };
}

/**
 * Validates and sanitizes judge-agent request body.
 */
export function validateJudgeAgentInput(body: unknown): {
  servedDish: string;
  orderName: string;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  const { servedDish, orderName } = body as Record<string, unknown>;

  if (typeof servedDish !== "string" || !servedDish) {
    throw new Error("servedDish is required");
  }
  if (typeof orderName !== "string" || !orderName) {
    throw new Error("orderName is required");
  }
  if (servedDish.length > MAX_DISH_NAME_LENGTH || orderName.length > MAX_DISH_NAME_LENGTH) {
    throw new Error("Dish name exceeds maximum length");
  }

  return {
    servedDish: sanitizeString(servedDish),
    orderName: sanitizeString(orderName),
  };
}

/**
 * Validates and sanitizes generate-illustration request body.
 */
export function validateIllustrationInput(body: unknown): {
  dishName: string;
  type: string;
  promptKey: string;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  const { dishName, type, promptKey } = body as Record<string, unknown>;

  if (typeof dishName !== "string" || !dishName) {
    throw new Error("dishName is required");
  }
  if (typeof type !== "string" || !type) {
    throw new Error("type is required");
  }
  if (typeof promptKey !== "string" || !promptKey) {
    throw new Error("promptKey is required");
  }

  const allowedTypes = ["dish", "chef", "ingredient", "technique"];
  if (!allowedTypes.includes(type)) {
    throw new Error(`type must be one of: ${allowedTypes.join(", ")}`);
  }

  if (dishName.length > MAX_DISH_NAME_LENGTH) {
    throw new Error("dishName exceeds maximum length");
  }
  if (promptKey.length > 500) {
    throw new Error("promptKey exceeds maximum length");
  }

  return {
    dishName: sanitizeString(dishName),
    type,
    promptKey: sanitizeString(promptKey),
  };
}

/**
 * Validates and sanitizes elevenlabs-sfx request body.
 */
export function validateSfxInput(body: unknown): {
  prompt: string;
  duration: number;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  const { prompt, duration = 3 } = body as Record<string, unknown>;

  if (typeof prompt !== "string" || !prompt) {
    throw new Error("prompt is required");
  }
  if (prompt.length > MAX_STRING_LENGTH) {
    throw new Error(`prompt exceeds maximum length of ${MAX_STRING_LENGTH}`);
  }

  const durationNum = typeof duration === "number" ? duration : 3;

  return {
    prompt: sanitizeString(prompt),
    duration: Math.min(Math.max(durationNum, 1), 10),
  };
}
