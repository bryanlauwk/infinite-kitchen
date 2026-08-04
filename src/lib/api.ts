// API Service Layer for Infinite Kitchen

import { supabase } from '@/integrations/supabase/client';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { 
  Ingredient, 
  Order, 
  ConversationMessage, 
  AlchemyResult, 
  JudgeResult 
} from '@/lib/types';

// Response types
export interface CookingAgentResponse {
  thinking: string;
  functionCall: {
    name: string;
    ingredients: string[];
  } | null;
  isComplete: boolean;
  error?: string;
}

export interface AlchemyAgentResponse extends AlchemyResult {
  error?: string;
}

export interface JudgeAgentResponse extends JudgeResult {
  error?: string;
}

// Thrown when the backend rejects a call for exceeding the per-visitor cap.
// Retrying immediately will not help, so the cooking loop must not back off on it.
export class RateLimitError extends Error {
  name = 'RateLimitError';
}

// Shared invoke helper: unwraps the real error body behind the generic
// "non-2xx status code" message so rate limits surface properly.
async function invokeFunction<T>(
  name: string,
  body: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const status = error.context?.status;
      let message = error.message;
      try {
        const payload = await error.context.json();
        if (payload?.error) message = payload.error;
      } catch {
        // body was not JSON; keep the default message
      }
      if (status === 429) {
        throw new RateLimitError(message);
      }
      console.error(`${name} error:`, status, message);
      throw new Error(message);
    }
    console.error(`${name} error:`, error);
    throw new Error(error.message || `Failed to call ${name}`);
  }

  if ((data as { error?: string })?.error) {
    throw new Error((data as { error: string }).error);
  }

  return data as T;
}

// Cooking Agent - Orchestrator
export async function callCookingAgent(
  inventory: Ingredient[],
  order: Order,
  conversationHistory: ConversationMessage[]
): Promise<CookingAgentResponse> {
  return invokeFunction<CookingAgentResponse>('cooking-agent', {
    inventory,
    order,
    conversationHistory
  });
}

// Alchemy Agent - State Transformer
export async function callAlchemyAgent(
  action: string,
  ingredients: Ingredient[]
): Promise<AlchemyAgentResponse> {
  return invokeFunction<AlchemyAgentResponse>('alchemy-agent', {
    action,
    ingredients
  });
}

// Judge Agent - Semantic Validator
export async function callJudgeAgent(
  servedDish: string,
  orderName: string
): Promise<JudgeAgentResponse> {
  return invokeFunction<JudgeAgentResponse>('judge-agent', {
    servedDish,
    orderName
  });
}

