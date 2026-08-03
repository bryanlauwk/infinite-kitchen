export const featuredIngredientIds = new Set([
  'egg',
  'spinach',
  'tomato',
  'avocado',
  'mango',
  'rice',
  'lemongrass',
  'ginger',
  'coconut_milk',
  'fish_sauce',
]);

export const featuredDishIds = new Set([
  'fried_eggs',
  'avocado_toast',
  'tom_yum_soup',
  'nasi_lemak_ayam',
  'green_curry',
  'curry_laksa',
]);

export const isFeaturedIngredient = (ingredientId: string) => featuredIngredientIds.has(ingredientId);

export const isFeaturedDish = (dishId: string) => featuredDishIds.has(dishId);
