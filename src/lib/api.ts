// API Service Layer for Infinite Kitchen

import { supabase } from '@/integrations/supabase/client';
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

// Cooking Agent - Orchestrator
export async function callCookingAgent(
  inventory: Ingredient[],
  order: Order,
  conversationHistory: ConversationMessage[]
): Promise<CookingAgentResponse> {
  const { data, error } = await supabase.functions.invoke('cooking-agent', {
    body: {
      inventory,
      order,
      conversationHistory
    }
  });

  if (error) {
    console.error('Cooking agent error:', error);
    throw new Error(error.message || 'Failed to call cooking agent');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as CookingAgentResponse;
}

// Alchemy Agent - State Transformer
export async function callAlchemyAgent(
  action: string,
  ingredients: Ingredient[]
): Promise<AlchemyAgentResponse> {
  const { data, error } = await supabase.functions.invoke('alchemy-agent', {
    body: {
      action,
      ingredients
    }
  });

  if (error) {
    console.error('Alchemy agent error:', error);
    throw new Error(error.message || 'Failed to call alchemy agent');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as AlchemyAgentResponse;
}

// Judge Agent - Semantic Validator
export async function callJudgeAgent(
  servedDish: string,
  orderName: string
): Promise<JudgeAgentResponse> {
  const { data, error } = await supabase.functions.invoke('judge-agent', {
    body: {
      servedDish,
      orderName
    }
  });

  if (error) {
    console.error('Judge agent error:', error);
    throw new Error(error.message || 'Failed to call judge agent');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as JudgeAgentResponse;
}
