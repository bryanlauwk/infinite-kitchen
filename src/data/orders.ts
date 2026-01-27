import { Order, OrderDifficulty } from '@/lib/types';

interface OrderTemplate {
  id: string;
  dishName: string;
  emoji: string;
  difficulty: OrderDifficulty;
}

export const orderTemplates: OrderTemplate[] = [
  // Beginner (1-2 steps) - Very simple dishes for quick wins
  { id: 'sliced_apple', dishName: 'Sliced Apple', emoji: '🍎', difficulty: 'beginner' },
  { id: 'buttered_bread', dishName: 'Buttered Bread', emoji: '🍞', difficulty: 'beginner' },
  { id: 'glass_of_milk', dishName: 'Glass of Milk', emoji: '🥛', difficulty: 'beginner' },
  { id: 'fresh_orange_juice', dishName: 'Fresh Orange Juice', emoji: '🍊', difficulty: 'beginner' },
  { id: 'cheese_plate', dishName: 'Cheese Plate', emoji: '🧀', difficulty: 'beginner' },
  { id: 'mixed_nuts', dishName: 'Mixed Nuts', emoji: '🥜', difficulty: 'beginner' },
  { id: 'fruit_bowl', dishName: 'Fruit Bowl', emoji: '🍇', difficulty: 'beginner' },
  { id: 'toast_with_jam', dishName: 'Toast with Jam', emoji: '🍯', difficulty: 'beginner' },

  // Easy (3-4 steps) - Simple dishes
  { id: 'fried_eggs', dishName: 'Fried Eggs', emoji: '🍳', difficulty: 'easy' },
  { id: 'avocado_toast', dishName: 'Avocado Toast', emoji: '🥑', difficulty: 'easy' },
  { id: 'fruit_salad', dishName: 'Fruit Salad', emoji: '🍇', difficulty: 'easy' },
  { id: 'scrambled_eggs', dishName: 'Scrambled Eggs', emoji: '🥚', difficulty: 'easy' },
  { id: 'grilled_cheese', dishName: 'Grilled Cheese', emoji: '🧀', difficulty: 'easy' },
  { id: 'buttered_toast', dishName: 'Buttered Toast', emoji: '🍞', difficulty: 'easy' },
  { id: 'caprese_salad', dishName: 'Caprese Salad', emoji: '🍅', difficulty: 'easy' },
  { id: 'boiled_rice', dishName: 'Boiled Rice', emoji: '🍚', difficulty: 'easy' },
  { id: 'mashed_potatoes', dishName: 'Mashed Potatoes', emoji: '🥔', difficulty: 'easy' },
  { id: 'guacamole', dishName: 'Guacamole', emoji: '🥑', difficulty: 'easy' },
  { id: 'hummus', dishName: 'Hummus', emoji: '🫘', difficulty: 'easy' },
  { id: 'overnight_oats', dishName: 'Overnight Oats', emoji: '🥣', difficulty: 'easy' },
  { id: 'teh_tarik', dishName: 'Teh Tarik', emoji: '🍵', difficulty: 'easy' },
  { id: 'roti_canai', dishName: 'Roti Canai', emoji: '🫓', difficulty: 'easy' },

  // Intermediate (5-7 steps) - Moderate complexity
  { id: 'margherita_pizza', dishName: 'Margherita Pizza', emoji: '🍕', difficulty: 'intermediate' },
  { id: 'beef_stir_fry', dishName: 'Beef Stir-fry', emoji: '🥩', difficulty: 'intermediate' },
  { id: 'tonkotsu_ramen', dishName: 'Tonkotsu Ramen', emoji: '🍜', difficulty: 'intermediate' },
  { id: 'caesar_salad', dishName: 'Caesar Salad', emoji: '🥗', difficulty: 'intermediate' },
  { id: 'pasta_carbonara', dishName: 'Pasta Carbonara', emoji: '🍝', difficulty: 'intermediate' },
  { id: 'chicken_curry', dishName: 'Chicken Curry', emoji: '🍛', difficulty: 'intermediate' },
  { id: 'fish_tacos', dishName: 'Fish Tacos', emoji: '🌮', difficulty: 'intermediate' },
  { id: 'french_omelette', dishName: 'French Omelette', emoji: '🥚', difficulty: 'intermediate' },
  { id: 'pad_thai', dishName: 'Pad Thai', emoji: '🍜', difficulty: 'intermediate' },
  { id: 'shakshuka', dishName: 'Shakshuka', emoji: '🍳', difficulty: 'intermediate' },
  { id: 'eggs_benedict', dishName: 'Eggs Benedict', emoji: '🥚', difficulty: 'intermediate' },
  { id: 'risotto', dishName: 'Risotto', emoji: '🍚', difficulty: 'intermediate' },
  { id: 'pho', dishName: 'Pho', emoji: '🍜', difficulty: 'intermediate' },
  { id: 'tom_yum_soup', dishName: 'Tom Yum Soup', emoji: '🍲', difficulty: 'intermediate' },
  { id: 'nasi_lemak_ayam', dishName: 'Nasi Lemak Ayam', emoji: '🍚', difficulty: 'intermediate' },
  { id: 'mee_goreng', dishName: 'Mee Goreng', emoji: '🍜', difficulty: 'intermediate' },
  { id: 'char_kway_teow', dishName: 'Char Kway Teow', emoji: '🍜', difficulty: 'intermediate' },
  { id: 'laksa', dishName: 'Laksa', emoji: '🍜', difficulty: 'intermediate' },

  // Hard (8-10 steps) - Complex dishes
  { id: 'beef_wellington', dishName: 'Beef Wellington', emoji: '🥩', difficulty: 'hard' },
  { id: 'sushi_platter', dishName: 'Sushi Platter', emoji: '🍣', difficulty: 'hard' },
  { id: 'coq_au_vin', dishName: 'Coq au Vin', emoji: '🍗', difficulty: 'hard' },
  { id: 'lobster_thermidor', dishName: 'Lobster Thermidor', emoji: '🦞', difficulty: 'hard' },
  { id: 'creme_brulee', dishName: 'Crème Brûlée', emoji: '🍮', difficulty: 'hard' },
  { id: 'croissants', dishName: 'Croissants', emoji: '🥐', difficulty: 'hard' },
  { id: 'dim_sum', dishName: 'Dim Sum', emoji: '🥟', difficulty: 'hard' },
  { id: 'tiramisu', dishName: 'Tiramisu', emoji: '🍰', difficulty: 'hard' },
  { id: 'souffle', dishName: 'Soufflé', emoji: '🥧', difficulty: 'hard' },
  { id: 'bouillabaisse', dishName: 'Bouillabaisse', emoji: '🍲', difficulty: 'hard' },
  { id: 'ratatouille', dishName: 'Ratatouille', emoji: '🍆', difficulty: 'hard' },
  { id: 'beef_bourguignon', dishName: 'Beef Bourguignon', emoji: '🥘', difficulty: 'hard' },
  { id: 'bak_kut_teh', dishName: 'Bak Kut Teh', emoji: '🍲', difficulty: 'hard' },
  { id: 'hainanese_chicken_rice', dishName: 'Hainanese Chicken Rice', emoji: '🍗', difficulty: 'hard' },
  { id: 'satay', dishName: 'Satay', emoji: '🍢', difficulty: 'hard' },
  { id: 'curry_laksa', dishName: 'Curry Laksa', emoji: '🍜', difficulty: 'hard' },

  // Expert (11-15 steps) - Multi-technique masterpieces
  { id: 'cassoulet', dishName: 'Cassoulet', emoji: '🫘', difficulty: 'expert' },
  { id: 'paella', dishName: 'Paella', emoji: '🥘', difficulty: 'expert' },
  { id: 'bibimbap', dishName: 'Bibimbap', emoji: '🍚', difficulty: 'expert' },
  { id: 'mole_poblano', dishName: 'Mole Poblano', emoji: '🫔', difficulty: 'expert' },
  { id: 'xiaolongbao', dishName: 'Xiaolongbao', emoji: '🥟', difficulty: 'expert' },
  { id: 'baked_alaska', dishName: 'Baked Alaska', emoji: '🍨', difficulty: 'expert' },
  { id: 'croquembouche', dishName: 'Croquembouche', emoji: '🍩', difficulty: 'expert' },
  { id: 'turducken', dishName: 'Turducken', emoji: '🦃', difficulty: 'expert' },
  { id: 'peking_duck', dishName: 'Peking Duck', emoji: '🦆', difficulty: 'expert' },
  { id: 'beef_rendang', dishName: 'Beef Rendang', emoji: '🍖', difficulty: 'expert' },
  { id: 'nasi_kandar', dishName: 'Nasi Kandar', emoji: '🍛', difficulty: 'expert' },
  { id: 'ayam_percik', dishName: 'Ayam Percik', emoji: '🍗', difficulty: 'expert' },
  { id: 'murtabak', dishName: 'Murtabak', emoji: '🫓', difficulty: 'expert' },

  // Legendary (16+ steps) - Epic culinary feats
  { id: 'french_onion_soup', dishName: 'French Onion Soup Gratinée', emoji: '🧅', difficulty: 'legendary' },
  { id: 'homemade_ramen', dishName: 'Homemade Ramen (48-hour broth)', emoji: '🍜', difficulty: 'legendary' },
  { id: 'seven_layer_dip', dishName: 'Seven-Layer Dip Supreme', emoji: '🫕', difficulty: 'legendary' },
  { id: 'wedding_cake', dishName: 'Wedding Cake', emoji: '🎂', difficulty: 'legendary' },
  { id: 'full_english', dishName: 'Full English Breakfast', emoji: '🍳', difficulty: 'legendary' },
  { id: 'thanksgiving_feast', dishName: 'Thanksgiving Feast', emoji: '🦃', difficulty: 'legendary' },
  { id: 'kaiseki', dishName: 'Kaiseki Multi-Course', emoji: '🍱', difficulty: 'legendary' },
  { id: 'molecular_menu', dishName: 'Molecular Gastronomy Tasting', emoji: '🧪', difficulty: 'legendary' },
  { id: 'nasi_kerabu', dishName: 'Nasi Kerabu', emoji: '🍚', difficulty: 'legendary' },
  { id: 'malaysian_steamboat', dishName: 'Malaysian Steamboat', emoji: '🫕', difficulty: 'legendary' },
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
