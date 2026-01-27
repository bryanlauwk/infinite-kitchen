// Function Call Kitchen - Type Definitions

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: IngredientCategory;
  isGenerated?: boolean;
}

export type IngredientCategory = 
  | 'proteins'
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'grains'
  | 'spices'
  | 'liquids'
  | 'condiments'
  | 'nuts'
  | 'generated';

export type IngredientGroup = 
  | 'discovered'
  | 'primary'
  | 'macronutrients'
  | 'micronutrients'
  | 'culinary';

export interface Tool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: ToolCategory;
}

export type ToolCategory =
  | 'heat'
  | 'cut'
  | 'mix'
  | 'prepare'
  | 'finish'
  | 'temperature'
  | 'transform';

export type OrderDifficulty = 'easy' | 'intermediate' | 'hard';

export type OrderStatus = 
  | 'not_started'
  | 'active'
  | 'cooking'
  | 'served'
  | 'verified'
  | 'rejected';

export interface PreviousAttempt {
  servedDish: string;
  reasoning: string;
  timestamp: number;
}

export interface Order {
  id: string;
  dishName: string;
  emoji: string;
  difficulty: OrderDifficulty;
  status: OrderStatus;
  timestamp: number;
  servedDish?: string;
  judgeResult?: JudgeResult;
  review?: CustomerReview;
  recookCount?: number;
  previousAttempts?: PreviousAttempt[];
}

export interface JudgeResult {
  match: boolean;
  confidence: number;
  reasoning: string;
}

export interface CustomerReview {
  stars: 1 | 2 | 3 | 4 | 5;
  comment: string;
}

export type AgentType = 'chef' | 'sous' | 'expeditor';

export type AgentStatus = 'idle' | 'thinking' | 'acting' | 'complete';

export interface AgentState {
  type: AgentType;
  name: string;
  emoji: string;
  description: string;
  status: AgentStatus;
  currentThinking?: string;
  lastAction?: string;
}

export type TimelineEventType = 
  | 'thinking'
  | 'action'
  | 'result'
  | 'serve'
  | 'judge'
  | 'error';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  agent: AgentType;
  content: string;
  functionCall?: FunctionCall;
  result?: AlchemyResult;
  timestamp: number;
}

export interface FunctionCall {
  name: string;
  ingredients: string[];
}

export interface AlchemyResult {
  resultName: string;
  resultId: string;
  emoji: string;
  description: string;
  isDiscovery?: boolean;
}

// Extended result for timeline events
export interface TimelineAlchemyResult extends AlchemyResult {
  isDiscovery?: boolean;
}

export interface CookingState {
  isActive: boolean;
  currentOrder: Order | null;
  conversationHistory: ConversationMessage[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  name?: string;
}

// API Payloads
export interface CookingAgentPayload {
  inventory: Ingredient[];
  order: Order;
  conversationHistory: ConversationMessage[];
}

export interface AlchemyAgentPayload {
  action: string;
  ingredients: Ingredient[];
}

export interface JudgeAgentPayload {
  servedDish: string;
  orderName: string;
}
