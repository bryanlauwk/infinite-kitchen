import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  Ingredient, 
  Order, 
  TimelineEvent, 
  CookingState, 
  ConversationMessage,
  AlchemyResult,
  CustomerReview
} from '@/lib/types';
import { ingredients as baseIngredients } from '@/data/ingredients';
import { orderTemplates, createOrder } from '@/data/orders';

interface KitchenContextType {
  // Inventory
  inventory: Ingredient[];
  addToInventory: (ingredient: Ingredient) => void;
  resetInventory: () => void;
  
  // Orders
  orders: Order[];
  addOrder: (dishName: string) => void;
  startOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], servedDish?: string) => void;
  setJudgeResult: (orderId: string, result: Order['judgeResult']) => void;
  setOrderReview: (orderId: string, review: CustomerReview) => void;
  
  // Timeline
  timeline: TimelineEvent[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  clearTimeline: () => void;
  
  // Cooking state
  cookingState: CookingState;
  setCookingActive: (active: boolean) => void;
  setCurrentOrder: (order: Order | null) => void;
  addConversationMessage: (message: ConversationMessage) => void;
  clearConversation: () => void;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export const useKitchen = () => {
  const context = useContext(KitchenContext);
  if (!context) {
    throw new Error('useKitchen must be used within a KitchenProvider');
  }
  return context;
};

interface KitchenProviderProps {
  children: ReactNode;
}

export const KitchenProvider: React.FC<KitchenProviderProps> = ({ children }) => {
  // Initialize with predefined orders
  const initialOrders = orderTemplates.slice(0, 6).map(template => createOrder(template));
  
  const [inventory, setInventory] = useState<Ingredient[]>([...baseIngredients]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [cookingState, setCookingState] = useState<CookingState>({
    isActive: false,
    currentOrder: null,
    conversationHistory: [],
  });

  // Inventory functions
  const addToInventory = useCallback((ingredient: Ingredient) => {
    setInventory(prev => [...prev, { ...ingredient, isGenerated: true }]);
  }, []);

  const resetInventory = useCallback(() => {
    setInventory([...baseIngredients]);
  }, []);

  // Order functions
  const addOrder = useCallback((dishName: string) => {
    const newOrder: Order = {
      id: `custom_${Date.now()}`,
      dishName,
      emoji: '🍽️',
      difficulty: 'intermediate',
      status: 'not_started',
      timestamp: Date.now(),
    };
    setOrders(prev => [...prev, newOrder]);
  }, []);

  const startOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'active' as const }
        : order
    ));
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setCookingState(prev => ({
        ...prev,
        currentOrder: { ...order, status: 'active' },
      }));
    }
  }, [orders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status'], servedDish?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, ...(servedDish && { servedDish }) }
        : order
    ));
  }, []);

  const setJudgeResult = useCallback((orderId: string, result: Order['judgeResult']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, judgeResult: result, status: result?.match ? 'verified' : 'rejected' }
        : order
    ));
  }, []);

  const setOrderReview = useCallback((orderId: string, review: CustomerReview) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, review }
        : order
    ));
  }, []);

  // Timeline functions
  const addTimelineEvent = useCallback((event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setTimeline(prev => [...prev, newEvent]);
  }, []);

  const clearTimeline = useCallback(() => {
    setTimeline([]);
  }, []);

  // Cooking state functions
  const setCookingActive = useCallback((active: boolean) => {
    setCookingState(prev => ({ ...prev, isActive: active }));
  }, []);

  const setCurrentOrder = useCallback((order: Order | null) => {
    setCookingState(prev => ({ ...prev, currentOrder: order }));
  }, []);

  const addConversationMessage = useCallback((message: ConversationMessage) => {
    setCookingState(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, message],
    }));
  }, []);

  const clearConversation = useCallback(() => {
    setCookingState(prev => ({ ...prev, conversationHistory: [] }));
  }, []);

  const value: KitchenContextType = {
    inventory,
    addToInventory,
    resetInventory,
    orders,
    addOrder,
    startOrder,
    updateOrderStatus,
    setJudgeResult,
    setOrderReview,
    timeline,
    addTimelineEvent,
    clearTimeline,
    cookingState,
    setCookingActive,
    setCurrentOrder,
    addConversationMessage,
    clearConversation,
  };

  return (
    <KitchenContext.Provider value={value}>
      {children}
    </KitchenContext.Provider>
  );
};
