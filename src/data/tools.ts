import { Tool } from '@/lib/types';

export const tools: Tool[] = [
  // Heat Methods (20)
  { id: 'fry', name: 'fry', emoji: '🍳', description: 'Cook in hot oil or fat', category: 'heat' },
  { id: 'saute', name: 'sauté', emoji: '🥘', description: 'Cook quickly in a small amount of fat', category: 'heat' },
  { id: 'boil', name: 'boil', emoji: '🫕', description: 'Cook in boiling water', category: 'heat' },
  { id: 'simmer', name: 'simmer', emoji: '🍲', description: 'Cook gently below boiling point', category: 'heat' },
  { id: 'steam', name: 'steam', emoji: '♨️', description: 'Cook with steam', category: 'heat' },
  { id: 'roast', name: 'roast', emoji: '🔥', description: 'Cook with dry heat in oven', category: 'heat' },
  { id: 'bake', name: 'bake', emoji: '🍞', description: 'Cook in oven with dry heat', category: 'heat' },
  { id: 'grill', name: 'grill', emoji: '🥓', description: 'Cook on a grill with direct heat', category: 'heat' },
  { id: 'broil', name: 'broil', emoji: '🔥', description: 'Cook under high direct heat', category: 'heat' },
  { id: 'braise', name: 'braise', emoji: '🍖', description: 'Slow cook in liquid', category: 'heat' },
  { id: 'sear', name: 'sear', emoji: '🥩', description: 'Brown quickly at high heat', category: 'heat' },
  { id: 'blanch', name: 'blanch', emoji: '🫕', description: 'Briefly boil then ice bath', category: 'heat' },
  { id: 'poach', name: 'poach', emoji: '🥚', description: 'Cook gently in simmering liquid', category: 'heat' },
  { id: 'stew', name: 'stew', emoji: '🍲', description: 'Slow cook in liquid with vegetables', category: 'heat' },
  { id: 'deep_fry', name: 'deep_fry', emoji: '🍟', description: 'Submerge in hot oil', category: 'heat' },
  { id: 'pan_fry', name: 'pan_fry', emoji: '🍳', description: 'Fry in shallow oil', category: 'heat' },
  { id: 'stir_fry', name: 'stir_fry', emoji: '🥡', description: 'High heat quick cooking with stirring', category: 'heat' },
  { id: 'flambe', name: 'flambé', emoji: '🔥', description: 'Ignite alcohol for flavor', category: 'heat' },
  { id: 'sous_vide', name: 'sous_vide', emoji: '🌡️', description: 'Cook vacuum-sealed in water bath', category: 'heat' },
  { id: 'smoke', name: 'smoke', emoji: '💨', description: 'Flavor with smoke', category: 'heat' },

  // Cutting Methods (18)
  { id: 'chop', name: 'chop', emoji: '🔪', description: 'Cut into rough pieces', category: 'cut' },
  { id: 'dice', name: 'dice', emoji: '🎲', description: 'Cut into small cubes', category: 'cut' },
  { id: 'mince', name: 'mince', emoji: '🔪', description: 'Cut into very fine pieces', category: 'cut' },
  { id: 'slice', name: 'slice', emoji: '🔪', description: 'Cut into thin pieces', category: 'cut' },
  { id: 'julienne', name: 'julienne', emoji: '🥢', description: 'Cut into thin matchsticks', category: 'cut' },
  { id: 'cube', name: 'cube', emoji: '🧊', description: 'Cut into larger cubes', category: 'cut' },
  { id: 'shred', name: 'shred', emoji: '🥗', description: 'Tear or cut into strips', category: 'cut' },
  { id: 'grate', name: 'grate', emoji: '🧀', description: 'Reduce to small pieces with grater', category: 'cut' },
  { id: 'peel', name: 'peel', emoji: '🍌', description: 'Remove outer skin', category: 'cut' },
  { id: 'zest', name: 'zest', emoji: '🍋', description: 'Remove citrus outer peel', category: 'cut' },
  { id: 'debone', name: 'debone', emoji: '🦴', description: 'Remove bones', category: 'cut' },
  { id: 'fillet', name: 'fillet', emoji: '🐟', description: 'Cut boneless portions', category: 'cut' },
  { id: 'butterfly', name: 'butterfly', emoji: '🦋', description: 'Split and flatten', category: 'cut' },
  { id: 'score', name: 'score', emoji: '🔪', description: 'Make shallow cuts', category: 'cut' },
  { id: 'trim', name: 'trim', emoji: '✂️', description: 'Remove excess fat or edges', category: 'cut' },
  { id: 'crack', name: 'crack', emoji: '🥚', description: 'Break open shells', category: 'cut' },
  { id: 'crush', name: 'crush', emoji: '🧄', description: 'Flatten with force', category: 'cut' },
  { id: 'pound', name: 'pound', emoji: '🔨', description: 'Flatten with mallet', category: 'cut' },

  // Mixing Methods (15)
  { id: 'stir', name: 'stir', emoji: '🥄', description: 'Mix with circular motion', category: 'mix' },
  { id: 'whisk', name: 'whisk', emoji: '🥄', description: 'Beat rapidly to incorporate air', category: 'mix' },
  { id: 'fold', name: 'fold', emoji: '🥣', description: 'Gently combine mixtures', category: 'mix' },
  { id: 'knead', name: 'knead', emoji: '🍞', description: 'Work dough with hands', category: 'mix' },
  { id: 'blend', name: 'blend', emoji: '🫗', description: 'Combine until smooth', category: 'mix' },
  { id: 'puree', name: 'purée', emoji: '🥤', description: 'Blend to smooth consistency', category: 'mix' },
  { id: 'cream', name: 'cream', emoji: '🧈', description: 'Beat until light and fluffy', category: 'mix' },
  { id: 'beat', name: 'beat', emoji: '🥚', description: 'Mix vigorously', category: 'mix' },
  { id: 'toss', name: 'toss', emoji: '🥗', description: 'Mix by throwing lightly', category: 'mix' },
  { id: 'combine', name: 'combine', emoji: '🥣', description: 'Mix ingredients together', category: 'mix' },
  { id: 'emulsify', name: 'emulsify', emoji: '🫗', description: 'Combine oil and water-based liquids', category: 'mix' },
  { id: 'whip', name: 'whip', emoji: '🍨', description: 'Beat to add air and volume', category: 'mix' },
  { id: 'mash', name: 'mash', emoji: '🥔', description: 'Crush into paste', category: 'mix' },
  { id: 'muddle', name: 'muddle', emoji: '🍹', description: 'Crush herbs or fruits', category: 'mix' },
  { id: 'scramble', name: 'scramble', emoji: '🍳', description: 'Stir while cooking', category: 'mix' },

  // Preparation Methods (20)
  { id: 'marinate', name: 'marinate', emoji: '🥩', description: 'Soak in flavored liquid', category: 'prepare' },
  { id: 'season', name: 'season', emoji: '🧂', description: 'Add salt and spices', category: 'prepare' },
  { id: 'brine', name: 'brine', emoji: '🧂', description: 'Soak in salt water', category: 'prepare' },
  { id: 'cure', name: 'cure', emoji: '🥓', description: 'Preserve with salt', category: 'prepare' },
  { id: 'coat', name: 'coat', emoji: '🍞', description: 'Cover with breading or batter', category: 'prepare' },
  { id: 'bread', name: 'bread', emoji: '🍞', description: 'Apply breadcrumb coating', category: 'prepare' },
  { id: 'batter', name: 'batter', emoji: '🥞', description: 'Dip in liquid coating', category: 'prepare' },
  { id: 'stuff', name: 'stuff', emoji: '🦃', description: 'Fill cavity with ingredients', category: 'prepare' },
  { id: 'roll', name: 'roll', emoji: '🌯', description: 'Wrap ingredients in sheet', category: 'prepare' },
  { id: 'shape', name: 'shape', emoji: '🥟', description: 'Form into desired form', category: 'prepare' },
  { id: 'sift', name: 'sift', emoji: '🌾', description: 'Pass through fine mesh', category: 'prepare' },
  { id: 'strain', name: 'strain', emoji: '🥢', description: 'Separate liquid from solids', category: 'prepare' },
  { id: 'drain', name: 'drain', emoji: '💧', description: 'Remove excess liquid', category: 'prepare' },
  { id: 'rinse', name: 'rinse', emoji: '💦', description: 'Wash with water', category: 'prepare' },
  { id: 'soak', name: 'soak', emoji: '🫧', description: 'Submerge in liquid', category: 'prepare' },
  { id: 'rest', name: 'rest', emoji: '⏰', description: 'Allow to sit before serving', category: 'prepare' },
  { id: 'proof', name: 'proof', emoji: '🍞', description: 'Allow dough to rise', category: 'prepare' },
  { id: 'ferment', name: 'ferment', emoji: '🧪', description: 'Allow controlled decomposition', category: 'prepare' },
  { id: 'pickle', name: 'pickle', emoji: '🥒', description: 'Preserve in vinegar', category: 'prepare' },
  { id: 'infuse', name: 'infuse', emoji: '🫖', description: 'Steep to extract flavors', category: 'prepare' },

  // Temperature Methods (10)
  { id: 'chill', name: 'chill', emoji: '❄️', description: 'Cool in refrigerator', category: 'temperature' },
  { id: 'freeze', name: 'freeze', emoji: '🧊', description: 'Solidify in freezer', category: 'temperature' },
  { id: 'thaw', name: 'thaw', emoji: '💧', description: 'Return to room temperature', category: 'temperature' },
  { id: 'melt', name: 'melt', emoji: '🫕', description: 'Heat until liquid', category: 'temperature' },
  { id: 'temper', name: 'temper', emoji: '🍫', description: 'Control temperature precisely', category: 'temperature' },
  { id: 'cool', name: 'cool', emoji: '🌡️', description: 'Reduce temperature', category: 'temperature' },
  { id: 'warm', name: 'warm', emoji: '☀️', description: 'Heat gently', category: 'temperature' },
  { id: 'room_temp', name: 'room_temp', emoji: '🏠', description: 'Bring to room temperature', category: 'temperature' },
  { id: 'preheat', name: 'preheat', emoji: '🔥', description: 'Heat oven before cooking', category: 'temperature' },
  { id: 'ice_bath', name: 'ice_bath', emoji: '🧊', description: 'Rapidly cool in ice water', category: 'temperature' },

  // Transform/Finish Methods (19)
  { id: 'reduce', name: 'reduce', emoji: '🍯', description: 'Simmer to thicken', category: 'transform' },
  { id: 'caramelize', name: 'caramelize', emoji: '🍮', description: 'Brown sugars with heat', category: 'transform' },
  { id: 'deglaze', name: 'deglaze', emoji: '🍷', description: 'Add liquid to release fond', category: 'transform' },
  { id: 'clarify', name: 'clarify', emoji: '🧈', description: 'Remove impurities from butter', category: 'transform' },
  { id: 'glaze', name: 'glaze', emoji: '✨', description: 'Apply shiny coating', category: 'transform' },
  { id: 'garnish', name: 'garnish', emoji: '🌿', description: 'Add decorative finishing', category: 'transform' },
  { id: 'plate', name: 'plate', emoji: '🍽️', description: 'Arrange for presentation', category: 'transform' },
  { id: 'drizzle', name: 'drizzle', emoji: '💧', description: 'Pour in thin stream', category: 'transform' },
  { id: 'sprinkle', name: 'sprinkle', emoji: '✨', description: 'Scatter small amounts', category: 'transform' },
  { id: 'dust', name: 'dust', emoji: '🌫️', description: 'Lightly coat with powder', category: 'transform' },
  { id: 'torch', name: 'torch', emoji: '🔥', description: 'Apply direct flame', category: 'transform' },
  { id: 'velvet', name: 'velvet', emoji: '🥢', description: 'Tenderize protein with coating', category: 'transform' },
  { id: 'age', name: 'age', emoji: '🧀', description: 'Allow to mature over time', category: 'transform' },
  { id: 'char', name: 'char', emoji: '🔥', description: 'Blacken with high heat', category: 'transform' },
  { id: 'toast', name: 'toast', emoji: '🍞', description: 'Brown with dry heat', category: 'transform' },
  { id: 'brown', name: 'brown', emoji: '🥧', description: 'Cook until golden', category: 'transform' },
  { id: 'crisp', name: 'crisp', emoji: '🥓', description: 'Make crunchy', category: 'transform' },
  { id: 'render', name: 'render', emoji: '🥓', description: 'Extract fat by heating', category: 'transform' },
  { id: 'serve', name: 'serve', emoji: '🍽️', description: 'Present the completed dish', category: 'finish' },
];

export const getToolById = (id: string): Tool | undefined => {
  return tools.find(t => t.id === id);
};

export const getToolsByCategory = (category: string): Tool[] => {
  return tools.filter(t => t.category === category);
};

// Generate tool definitions for Gemini function calling
export const generateToolDefinitions = () => {
  return tools.map(tool => ({
    type: "function" as const,
    function: {
      name: tool.id,
      description: `${tool.emoji} ${tool.name}: ${tool.description}`,
      parameters: {
        type: "object",
        properties: {
          ingredients: {
            type: "array",
            items: { type: "string" },
            description: "Array of ingredient IDs to apply this action to"
          }
        },
        required: ["ingredients"]
      }
    }
  }));
};
