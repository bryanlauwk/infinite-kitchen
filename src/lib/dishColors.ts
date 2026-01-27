// Dish category color mapping for gradient backgrounds

export type DishCategory = 
  | 'pasta' 
  | 'salad' 
  | 'meat' 
  | 'seafood' 
  | 'dessert' 
  | 'cosmic' 
  | 'soup'
  | 'bread'
  | 'breakfast'
  | 'default';

export const dishGradients: Record<DishCategory, { gradient: string; darkGradient: string }> = {
  pasta: {
    gradient: 'linear-gradient(135deg, hsl(45 90% 94%) 0%, hsl(35 85% 88%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(45 40% 18%) 0%, hsl(35 35% 14%) 100%)',
  },
  salad: {
    gradient: 'linear-gradient(135deg, hsl(142 60% 92%) 0%, hsl(152 55% 85%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(142 35% 18%) 0%, hsl(152 30% 14%) 100%)',
  },
  meat: {
    gradient: 'linear-gradient(135deg, hsl(0 65% 93%) 0%, hsl(15 60% 87%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(0 35% 18%) 0%, hsl(15 30% 14%) 100%)',
  },
  seafood: {
    gradient: 'linear-gradient(135deg, hsl(200 75% 92%) 0%, hsl(210 70% 86%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(200 40% 18%) 0%, hsl(210 35% 14%) 100%)',
  },
  dessert: {
    gradient: 'linear-gradient(135deg, hsl(330 70% 94%) 0%, hsl(340 65% 88%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(330 35% 18%) 0%, hsl(340 30% 14%) 100%)',
  },
  cosmic: {
    gradient: 'linear-gradient(135deg, hsl(270 70% 93%) 0%, hsl(280 65% 87%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(270 40% 18%) 0%, hsl(280 35% 14%) 100%)',
  },
  soup: {
    gradient: 'linear-gradient(135deg, hsl(25 80% 92%) 0%, hsl(35 75% 86%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(25 40% 18%) 0%, hsl(35 35% 14%) 100%)',
  },
  bread: {
    gradient: 'linear-gradient(135deg, hsl(35 75% 92%) 0%, hsl(30 70% 85%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(35 40% 18%) 0%, hsl(30 35% 14%) 100%)',
  },
  breakfast: {
    gradient: 'linear-gradient(135deg, hsl(50 85% 93%) 0%, hsl(45 80% 87%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(50 45% 18%) 0%, hsl(45 40% 14%) 100%)',
  },
  default: {
    gradient: 'linear-gradient(135deg, hsl(40 50% 94%) 0%, hsl(35 45% 88%) 100%)',
    darkGradient: 'linear-gradient(135deg, hsl(40 25% 18%) 0%, hsl(35 20% 14%) 100%)',
  },
};

export function inferDishCategory(dishName: string): DishCategory {
  const name = dishName.toLowerCase();
  
  // Cosmic/surreal dishes
  if (/cosmic|quantum|nebula|void|infinity|stellar|galactic|ethereal|transcendent/.test(name)) {
    return 'cosmic';
  }
  
  // Pasta dishes
  if (/pasta|carbonara|spaghetti|noodle|ramen|fettuccine|lasagna|macaroni|penne|linguine|ravioli/.test(name)) {
    return 'pasta';
  }
  
  // Salad dishes
  if (/salad|greens|lettuce|caesar|coleslaw|arugula/.test(name)) {
    return 'salad';
  }
  
  // Meat dishes
  if (/beef|steak|meat|pork|chicken|lamb|duck|turkey|bacon|ham|ribs/.test(name)) {
    return 'meat';
  }
  
  // Seafood dishes
  if (/fish|shrimp|lobster|crab|sushi|salmon|tuna|oyster|mussel|seafood|prawn/.test(name)) {
    return 'seafood';
  }
  
  // Dessert dishes
  if (/cake|pie|brulee|souffle|dessert|chocolate|cookie|brownie|pudding|ice cream|tart|mousse|macaron/.test(name)) {
    return 'dessert';
  }
  
  // Soup dishes
  if (/soup|broth|stew|chowder|bisque|consomme/.test(name)) {
    return 'soup';
  }
  
  // Bread dishes
  if (/bread|toast|bagel|croissant|baguette|focaccia|pretzel/.test(name)) {
    return 'bread';
  }
  
  // Breakfast dishes
  if (/egg|omelette|omelet|pancake|waffle|benedict|scrambled|fried egg|breakfast/.test(name)) {
    return 'breakfast';
  }
  
  return 'default';
}

export function getDishGradient(dishName: string, isDark: boolean = false): string {
  const category = inferDishCategory(dishName);
  const colors = dishGradients[category];
  return isDark ? colors.darkGradient : colors.gradient;
}
