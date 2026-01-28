import { Ingredient } from '@/lib/types';

export const ingredients: Ingredient[] = [
  // Proteins (15)
  { id: 'egg', name: 'egg', emoji: '🥚', category: 'proteins' },
  { id: 'chicken', name: 'chicken', emoji: '🍗', category: 'proteins' },
  { id: 'beef', name: 'beef', emoji: '🥩', category: 'proteins' },
  { id: 'pork', name: 'pork', emoji: '🥓', category: 'proteins' },
  { id: 'fish', name: 'fish', emoji: '🐟', category: 'proteins' },
  { id: 'shrimp', name: 'shrimp', emoji: '🦐', category: 'proteins' },
  { id: 'tofu', name: 'tofu', emoji: '🧈', category: 'proteins' },
  { id: 'bacon', name: 'bacon', emoji: '🥓', category: 'proteins' },
  { id: 'salmon', name: 'salmon', emoji: '🍣', category: 'proteins' },
  { id: 'tuna', name: 'tuna', emoji: '🐟', category: 'proteins' },
  { id: 'lamb', name: 'lamb', emoji: '🍖', category: 'proteins' },
  { id: 'duck', name: 'duck', emoji: '🦆', category: 'proteins' },
  { id: 'crab', name: 'crab', emoji: '🦀', category: 'proteins' },
  { id: 'lobster', name: 'lobster', emoji: '🦞', category: 'proteins' },
  { id: 'sausage', name: 'sausage', emoji: '🌭', category: 'proteins' },
  // Southeast Asian Proteins
  { id: 'pork_ribs', name: 'pork ribs', emoji: '🍖', category: 'proteins' },
  { id: 'dried_shrimp', name: 'dried shrimp', emoji: '🦐', category: 'proteins' },

  // Vegetables (25)
  { id: 'spinach', name: 'spinach', emoji: '🥬', category: 'vegetables' },
  { id: 'lettuce', name: 'lettuce', emoji: '🥬', category: 'vegetables' },
  { id: 'broccoli', name: 'broccoli', emoji: '🥦', category: 'vegetables' },
  { id: 'cauliflower', name: 'cauliflower', emoji: '🥬', category: 'vegetables' },
  { id: 'cabbage', name: 'cabbage', emoji: '🥬', category: 'vegetables' },
  { id: 'zucchini', name: 'zucchini', emoji: '🥒', category: 'vegetables' },
  { id: 'cucumber', name: 'cucumber', emoji: '🥒', category: 'vegetables' },
  { id: 'eggplant', name: 'eggplant', emoji: '🍆', category: 'vegetables' },
  { id: 'avocado', name: 'avocado', emoji: '🥑', category: 'vegetables' },
  { id: 'jalapeno', name: 'jalapeño', emoji: '🌶️', category: 'vegetables' },
  { id: 'ginger', name: 'ginger', emoji: '🫚', category: 'vegetables' },
  { id: 'onion', name: 'onion', emoji: '🧅', category: 'vegetables' },
  { id: 'garlic', name: 'garlic', emoji: '🧄', category: 'vegetables' },
  { id: 'tomato', name: 'tomato', emoji: '🍅', category: 'vegetables' },
  { id: 'carrot', name: 'carrot', emoji: '🥕', category: 'vegetables' },
  { id: 'potato', name: 'potato', emoji: '🥔', category: 'vegetables' },
  { id: 'corn', name: 'corn', emoji: '🌽', category: 'vegetables' },
  { id: 'pepper', name: 'bell pepper', emoji: '🫑', category: 'vegetables' },
  { id: 'mushroom', name: 'mushroom', emoji: '🍄', category: 'vegetables' },
  { id: 'celery', name: 'celery', emoji: '🥬', category: 'vegetables' },
  { id: 'asparagus', name: 'asparagus', emoji: '🥦', category: 'vegetables' },
  { id: 'peas', name: 'peas', emoji: '🫛', category: 'vegetables' },
  { id: 'beans', name: 'green beans', emoji: '🫘', category: 'vegetables' },
  { id: 'radish', name: 'radish', emoji: '🥕', category: 'vegetables' },
  { id: 'leek', name: 'leek', emoji: '🥬', category: 'vegetables' },

  // Fruits (15)
  { id: 'apple', name: 'apple', emoji: '🍎', category: 'fruits' },
  { id: 'banana', name: 'banana', emoji: '🍌', category: 'fruits' },
  { id: 'orange', name: 'orange', emoji: '🍊', category: 'fruits' },
  { id: 'lemon', name: 'lemon', emoji: '🍋', category: 'fruits' },
  { id: 'lime', name: 'lime', emoji: '🍋', category: 'fruits' },
  { id: 'strawberry', name: 'strawberry', emoji: '🍓', category: 'fruits' },
  { id: 'blueberry', name: 'blueberry', emoji: '🫐', category: 'fruits' },
  { id: 'grape', name: 'grape', emoji: '🍇', category: 'fruits' },
  { id: 'mango', name: 'mango', emoji: '🥭', category: 'fruits' },
  { id: 'pineapple', name: 'pineapple', emoji: '🍍', category: 'fruits' },
  { id: 'peach', name: 'peach', emoji: '🍑', category: 'fruits' },
  { id: 'cherry', name: 'cherry', emoji: '🍒', category: 'fruits' },
  { id: 'watermelon', name: 'watermelon', emoji: '🍉', category: 'fruits' },
  { id: 'coconut', name: 'coconut', emoji: '🥥', category: 'fruits' },
  { id: 'kiwi', name: 'kiwi', emoji: '🥝', category: 'fruits' },

  // Dairy (10)
  { id: 'butter', name: 'butter', emoji: '🧈', category: 'dairy' },
  { id: 'milk', name: 'milk', emoji: '🥛', category: 'dairy' },
  { id: 'cheese', name: 'cheese', emoji: '🧀', category: 'dairy' },
  { id: 'cream', name: 'cream', emoji: '🥛', category: 'dairy' },
  { id: 'yogurt', name: 'yogurt', emoji: '🥛', category: 'dairy' },
  { id: 'mozzarella', name: 'mozzarella', emoji: '🧀', category: 'dairy' },
  { id: 'parmesan', name: 'parmesan', emoji: '🧀', category: 'dairy' },
  { id: 'ricotta', name: 'ricotta', emoji: '🧀', category: 'dairy' },
  { id: 'sourcream', name: 'sour cream', emoji: '🥛', category: 'dairy' },
  { id: 'icecream', name: 'ice cream', emoji: '🍨', category: 'dairy' },

  // Grains (12)
  { id: 'rice', name: 'rice', emoji: '🍚', category: 'grains' },
  { id: 'flour', name: 'flour', emoji: '🌾', category: 'grains' },
  { id: 'pasta', name: 'pasta', emoji: '🍝', category: 'grains' },
  { id: 'bread', name: 'bread', emoji: '🍞', category: 'grains' },
  { id: 'noodles', name: 'noodles', emoji: '🍜', category: 'grains' },
  { id: 'oats', name: 'oats', emoji: '🥣', category: 'grains' },
  { id: 'quinoa', name: 'quinoa', emoji: '🌾', category: 'grains' },
  { id: 'tortilla', name: 'tortilla', emoji: '🫓', category: 'grains' },
  { id: 'pizza_dough', name: 'pizza dough', emoji: '🍕', category: 'grains' },
  { id: 'breadcrumbs', name: 'breadcrumbs', emoji: '🍞', category: 'grains' },
  { id: 'couscous', name: 'couscous', emoji: '🌾', category: 'grains' },
  { id: 'polenta', name: 'polenta', emoji: '🌽', category: 'grains' },

  // Spices & Seasonings (15)
  { id: 'salt', name: 'salt', emoji: '🧂', category: 'spices' },
  { id: 'black_pepper', name: 'black pepper', emoji: '🌶️', category: 'spices' },
  { id: 'cumin', name: 'cumin', emoji: '🫙', category: 'spices' },
  { id: 'oregano', name: 'oregano', emoji: '🌿', category: 'spices' },
  { id: 'basil', name: 'basil', emoji: '🌿', category: 'spices' },
  { id: 'thyme', name: 'thyme', emoji: '🌿', category: 'spices' },
  { id: 'rosemary', name: 'rosemary', emoji: '🌿', category: 'spices' },
  { id: 'paprika', name: 'paprika', emoji: '🌶️', category: 'spices' },
  { id: 'cinnamon', name: 'cinnamon', emoji: '🫙', category: 'spices' },
  { id: 'nutmeg', name: 'nutmeg', emoji: '🫙', category: 'spices' },
  { id: 'cayenne', name: 'cayenne', emoji: '🌶️', category: 'spices' },
  { id: 'turmeric', name: 'turmeric', emoji: '🫙', category: 'spices' },
  { id: 'parsley', name: 'parsley', emoji: '🌿', category: 'spices' },
  { id: 'cilantro', name: 'cilantro', emoji: '🌿', category: 'spices' },
  { id: 'mint', name: 'mint', emoji: '🌿', category: 'spices' },
  // Southeast Asian Spices
  { id: 'star_anise', name: 'star anise', emoji: '⭐', category: 'spices' },
  { id: 'cloves', name: 'cloves', emoji: '🫙', category: 'spices' },
  { id: 'white_pepper', name: 'white pepper', emoji: '⚪', category: 'spices' },
  { id: 'dang_gui', name: 'dang gui (angelica)', emoji: '🌿', category: 'spices' },
  { id: 'cinnamon_stick', name: 'cinnamon stick', emoji: '🪵', category: 'spices' },
  { id: 'five_spice_powder', name: 'five spice powder', emoji: '🫙', category: 'spices' },
  // Southeast Asian Aromatics
  { id: 'galangal', name: 'galangal', emoji: '🫚', category: 'vegetables' },
  { id: 'lemongrass', name: 'lemongrass', emoji: '🌿', category: 'vegetables' },
  { id: 'kaffir_lime_leaf', name: 'kaffir lime leaf', emoji: '🍃', category: 'vegetables' },
  { id: 'pandan_leaf', name: 'pandan leaf', emoji: '🌿', category: 'vegetables' },
  { id: 'shallot', name: 'shallot', emoji: '🧅', category: 'vegetables' },

  // Liquids (10)
  { id: 'olive_oil', name: 'olive oil', emoji: '🫒', category: 'liquids' },
  { id: 'vegetable_oil', name: 'vegetable oil', emoji: '🛢️', category: 'liquids' },
  { id: 'sesame_oil', name: 'sesame oil', emoji: '🛢️', category: 'liquids' },
  { id: 'vinegar', name: 'vinegar', emoji: '🍶', category: 'liquids' },
  { id: 'wine', name: 'wine', emoji: '🍷', category: 'liquids' },
  { id: 'chicken_stock', name: 'chicken stock', emoji: '🍲', category: 'liquids' },
  { id: 'beef_stock', name: 'beef stock', emoji: '🍲', category: 'liquids' },
  { id: 'soy_sauce', name: 'soy sauce', emoji: '🍶', category: 'liquids' },
  { id: 'fish_sauce', name: 'fish sauce', emoji: '🍶', category: 'liquids' },
  { id: 'coconut_milk', name: 'coconut milk', emoji: '🥥', category: 'liquids' },

  // Condiments (8)
  { id: 'ketchup', name: 'ketchup', emoji: '🍅', category: 'condiments' },
  { id: 'mustard', name: 'mustard', emoji: '🟡', category: 'condiments' },
  { id: 'mayonnaise', name: 'mayonnaise', emoji: '🥚', category: 'condiments' },
  { id: 'honey', name: 'honey', emoji: '🍯', category: 'condiments' },
  { id: 'sugar', name: 'sugar', emoji: '🍬', category: 'condiments' },
  { id: 'maple_syrup', name: 'maple syrup', emoji: '🍁', category: 'condiments' },
  { id: 'hot_sauce', name: 'hot sauce', emoji: '🌶️', category: 'condiments' },
  { id: 'pesto', name: 'pesto', emoji: '🌿', category: 'condiments' },
  // Southeast Asian Sauces
  { id: 'dark_soy_sauce', name: 'dark soy sauce', emoji: '🍶', category: 'condiments' },
  { id: 'oyster_sauce', name: 'oyster sauce', emoji: '🦪', category: 'condiments' },

  // Nuts & Seeds (5)
  { id: 'almonds', name: 'almonds', emoji: '🥜', category: 'nuts' },
  { id: 'walnuts', name: 'walnuts', emoji: '🥜', category: 'nuts' },
  { id: 'peanuts', name: 'peanuts', emoji: '🥜', category: 'nuts' },
  { id: 'cashews', name: 'cashews', emoji: '🥜', category: 'nuts' },
  { id: 'sesame_seeds', name: 'sesame seeds', emoji: '🌾', category: 'nuts' },
];

export const getIngredientById = (id: string): Ingredient | undefined => {
  return ingredients.find(i => i.id === id);
};

export const getIngredientsByCategory = (category: string): Ingredient[] => {
  return ingredients.filter(i => i.category === category);
};
