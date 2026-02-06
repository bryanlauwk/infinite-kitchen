// Recipe pattern guidance for simple dishes
// Extracted from cooking-agent for maintainability

const beginnerPatterns: Record<string, string> = {
  'cheese plate': 'slice(cheese) → plate([sliced_cheese]) → serve([plated_cheese])',
  'sliced apple': 'slice(apple) → plate([sliced_apple]) → serve([plated_apple])',
  'buttered bread': 'slice(bread) → spread(butter on sliced_bread) → plate → serve',
  'glass of milk': 'plate(milk) → serve([plated_milk])',
  'fresh orange juice': 'crush(orange) → strain → plate → serve',
  'orange juice': 'crush(orange) → strain → plate → serve',
  'mixed nuts': 'mix([nuts from inventory]) → plate → serve',
  'fruit bowl': 'slice(fruits) → mix → plate → serve',
  'fruit salad': 'slice(fruits) → mix → plate → serve',
  'toast': 'toast(bread) → plate → serve',
  'toast with jam': 'toast(bread) → spread(jam) → plate → serve',
  'salad': 'chop(lettuce, vegetables) → mix → plate → serve',
  'green salad': 'chop(lettuce) → mix → drizzle(olive_oil) → plate → serve',
};

const easyPatterns: Record<string, string> = {
  'fried egg': 'crack(egg) → pan_fry → season(salt, pepper) → plate → serve',
  'fried eggs': 'crack(egg) → pan_fry → season(salt, pepper) → plate → serve',
  'scrambled eggs': 'crack(egg) → whisk → pan_fry(with stirring) → season → plate → serve',
  'boiled egg': 'boil(egg) → plate → serve',
  'grilled cheese': 'slice(bread, cheese) → assemble → pan_fry → plate → serve',
  'grilled cheese sandwich': 'slice(bread, cheese) → assemble → pan_fry → plate → serve',
  'avocado toast': 'toast(bread) → mash(avocado) → spread on toast → season → plate → serve',
  'caprese salad': 'slice(tomato, mozzarella) → arrange with basil → drizzle(olive_oil) → plate → serve',
  'boiled rice': 'rinse(rice) → boil(rice, water) → drain → plate → serve',
  'steamed rice': 'rinse(rice) → steam(rice, water) → plate → serve',
  'mashed potatoes': 'peel(potato) → boil → mash → mix(butter) → season → plate → serve',
  'guacamole': 'mash(avocado) → mix(with lime, salt, onion) → plate → serve',
  'omelette': 'crack(egg) → whisk → pan_fry → fold → plate → serve',
  'pancakes': 'mix(flour, egg, milk) → pan_fry → plate → serve',
  'french toast': 'crack(egg) → whisk → soak(bread) → pan_fry → plate → serve',
  'bacon': 'pan_fry(bacon) → plate → serve',
  'sauteed vegetables': 'chop(vegetables) → saute → season → plate → serve',
};

/**
 * Returns recipe guidance text for the AI prompt based on dish name and difficulty.
 */
export function getRecipeGuidance(dishName: string, difficulty: string): string {
  const normalizedName = dishName.toLowerCase();

  for (const [dish, pattern] of Object.entries(beginnerPatterns)) {
    if (normalizedName.includes(dish)) {
      return `\n\nRECIPE GUIDANCE (RECOMMENDED PATTERN):
${pattern}
IMPORTANT: This is a simple dish. Follow this pattern closely - do NOT overcomplicate.
The final served dish name should match or closely resemble "${dishName}".`;
    }
  }

  for (const [dish, pattern] of Object.entries(easyPatterns)) {
    if (normalizedName.includes(dish)) {
      return `\n\nRECIPE GUIDANCE (SUGGESTED APPROACH):
${pattern}
TIP: Keep it simple. 3-4 essential steps. The dish name should match "${dishName}".`;
    }
  }

  if (difficulty === 'beginner') {
    return `\n\nRECIPE GUIDANCE:
This is a BEGINNER dish. Keep it extremely simple:
- 1-2 cooking actions maximum
- Then plate() and serve()
- Do NOT overcomplicate with unnecessary transformations
- The served dish should match the order name closely`;
  } else if (difficulty === 'easy') {
    return `\n\nRECIPE GUIDANCE:
This is an EASY dish. Focus on essentials:
- 3-4 cooking steps maximum
- Standard cooking techniques
- Then plate() and serve()
- Avoid overcomplicating the dish`;
  }

  return '';
}
