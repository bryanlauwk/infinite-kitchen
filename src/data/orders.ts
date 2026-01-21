import { Order, OrderDifficulty } from '@/lib/types';

interface OrderTemplate {
  id: string;
  dishName: string;
  emoji: string;
  difficulty: OrderDifficulty;
}

export const orderTemplates: OrderTemplate[] = [
  // Easy (3-5 steps)
  { id: 'fried_eggs', dishName: 'Fried Eggs', emoji: '🍳', difficulty: 'easy' },
  { id: 'avocado_toast', dishName: 'Avocado Toast', emoji: '🥑', difficulty: 'easy' },
  { id: 'fruit_salad', dishName: 'Fruit Salad', emoji: '🍇', difficulty: 'easy' },
  { id: 'scrambled_eggs', dishName: 'Scrambled Eggs', emoji: '🥚', difficulty: 'easy' },
  { id: 'grilled_cheese', dishName: 'Grilled Cheese', emoji: '🧀', difficulty: 'easy' },
  { id: 'buttered_toast', dishName: 'Buttered Toast', emoji: '🍞', difficulty: 'easy' },

  // Intermediate (5-8 steps)
  { id: 'margherita_pizza', dishName: 'Margherita Pizza', emoji: '🍕', difficulty: 'intermediate' },
  { id: 'beef_stir_fry', dishName: 'Beef Stir-fry', emoji: '🥩', difficulty: 'intermediate' },
  { id: 'tonkotsu_ramen', dishName: 'Tonkotsu Ramen', emoji: '🍜', difficulty: 'intermediate' },
  { id: 'caesar_salad', dishName: 'Caesar Salad', emoji: '🥗', difficulty: 'intermediate' },
  { id: 'pasta_carbonara', dishName: 'Pasta Carbonara', emoji: '🍝', difficulty: 'intermediate' },
  { id: 'chicken_curry', dishName: 'Chicken Curry', emoji: '🍛', difficulty: 'intermediate' },
  { id: 'fish_tacos', dishName: 'Fish Tacos', emoji: '🌮', difficulty: 'intermediate' },
  { id: 'french_omelette', dishName: 'French Omelette', emoji: '🥚', difficulty: 'intermediate' },

  // Hard (8+ steps)
  { id: 'beef_wellington', dishName: 'Beef Wellington', emoji: '🥩', difficulty: 'hard' },
  { id: 'sushi_platter', dishName: 'Sushi Platter', emoji: '🍣', difficulty: 'hard' },
  { id: 'coq_au_vin', dishName: 'Coq au Vin', emoji: '🍗', difficulty: 'hard' },
  { id: 'lobster_thermidor', dishName: 'Lobster Thermidor', emoji: '🦞', difficulty: 'hard' },
  { id: 'peking_duck', dishName: 'Peking Duck', emoji: '🦆', difficulty: 'hard' },
  { id: 'creme_brulee', dishName: 'Crème Brûlée', emoji: '🍮', difficulty: 'hard' },
];

export const createOrder = (template: OrderTemplate): Order => ({
  id: `${template.id}_${Date.now()}`,
  dishName: template.dishName,
  emoji: template.emoji,
  difficulty: template.difficulty,
  status: 'not_started',
  timestamp: Date.now(),
});

export const getOrdersByDifficulty = (difficulty: OrderDifficulty): OrderTemplate[] => {
  return orderTemplates.filter(o => o.difficulty === difficulty);
};
