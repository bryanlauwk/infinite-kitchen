// Sound Effects Configuration for Infinite Kitchen
// Maps cooking actions to ElevenLabs SFX prompts with ingredient awareness

import { ToolCategory } from './types';

// Detailed technique-specific sound prompts
// These are highly descriptive to generate realistic, varied cooking sounds
export const techniqueSounds: Record<string, string> = {
  // ===== HEAT TECHNIQUES =====
  grill: "charcoal grill sizzling with meat fat dripping onto hot coals, flames licking, outdoor barbecue atmosphere",
  pan_fry: "cast iron skillet sizzling intensely with butter foam and food crackling in hot pan",
  saute: "stainless steel pan with olive oil shimmering, vegetables hitting hot surface, quick tossing sounds",
  sear: "heavy searing sound of cold meat hitting screaming hot cast iron, violent sizzle and smoke",
  roast: "oven roasting with fat dripping and splattering, gentle crackling of browning meat",
  bake: "quiet oven ambience with occasional bubbling and crust forming sounds",
  broil: "intense overhead heat with caramelization sizzle, cheese melting and bubbling",
  toast: "bread crisping in toaster, golden crackling texture forming",
  char: "aggressive charring with smoking and intense blackening sizzle",
  flambe: "dramatic whoosh of alcohol igniting, flames crackling then subsiding",
  smoke: "smoker with wood chips smoldering, gentle hissing and aromatic smoke",
  fry: "hot oil frying with steady bubbling sizzle, food turning golden",
  stew: "thick liquid bubbling slowly with occasional plop and gentle simmer",
  sous_vide: "water bath circulator humming, gentle water movement",
  
  // ===== LIQUID TECHNIQUES =====
  boil: "vigorous rolling boil with large bubbles breaking surface, steam escaping pot",
  simmer: "gentle low simmer with small lazy bubbles, quiet pot lid rattling",
  poach: "delicate barely simmering water with occasional soft bubble, egg sliding in",
  blanch: "quick splash into rapidly boiling water, bubbles intensifying then food removed",
  steam: "pressurized steam escaping from pot lid, condensation dripping",
  braise: "low slow bubble in covered pot, rich liquid barely moving",
  reduce: "concentrated bubbling as sauce thickens, viscous plops",
  deglaze: "wine or stock hitting screaming hot pan, dramatic sizzle and steam burst",
  
  // ===== FRYING VARIATIONS =====
  deep_fry: "food submerging in hot oil, explosive bubbling, crispy coating forming",
  shallow_fry: "medium oil depth frying, one-sided sizzle with occasional flip",
  stir_fry: "wok on high flame, rapid metal spatula scraping, intense quick sizzle bursts",
  flash_fry: "extremely quick intense fry, brief explosive sizzle",
  tempura: "light tempura batter hitting oil, delicate crispy bubbling",
  
  // ===== CUTTING TECHNIQUES =====
  chop: "chef knife chopping through vegetables on thick wooden cutting board, rhythmic thuds",
  dice: "precise dicing with sharp knife, multiple quick cuts on wooden board",
  slice: "long smooth knife strokes slicing through food cleanly",
  mince: "rapid fine mincing with rocking knife motion, quick light taps",
  julienne: "precise matchstick cutting, careful thin strokes",
  cube: "heavy cutting into cubes, solid knife-on-board sounds",
  shred: "box grater shredding vegetables, repetitive scraping",
  carve: "long carving knife slicing through roasted meat, tender cuts",
  fillet: "flexible filleting knife gliding along fish spine, subtle bone separation",
  debone: "knife working around joints, occasional bone snapping",
  peel: "vegetable peeler scraping potato skin, curling strips falling",
  zest: "microplane zesting citrus, fine scratchy scraping",
  core: "apple corer pushing through fruit with pop",
  trim: "quick knife trimming fat from meat",
  score: "shallow deliberate knife cuts across surface",
  crack: "egg shell cracking crisply against bowl rim, yolk sliding out",
  crush: "knife flat crushing garlic clove with firm press",
  pound: "meat tenderizer mallet pounding cutlets flat, thumping impacts",
  
  // ===== MIXING TECHNIQUES =====
  whisk: "wire whisk rapidly beating eggs in metal bowl, airy whipping sounds",
  stir: "wooden spoon stirring thick batter in ceramic bowl, scraping sides",
  blend: "electric blender motor whirring at high speed, liquid vortex",
  mix: "hand mixing ingredients in bowl with spoon, ingredients combining",
  fold: "rubber spatula gently folding batter, quiet careful scoops",
  beat: "electric mixer beating batter, motor humming with thick resistance",
  cream: "stand mixer creaming butter and sugar until fluffy, paddle spinning",
  emulsify: "whisking oil into egg yolk, mayonnaise forming",
  whip: "whisk whipping cream to stiff peaks, increasingly airy sounds",
  aerate: "gentle folding motion incorporating air into mixture",
  puree: "immersion blender pureeing soup, motor changing pitch in liquid",
  toss: "salad tongs tossing mixed greens in large bowl, leaves rustling gently, soft arranging",
  combine: "ingredients being gently mixed together in bowl, soft stirring sounds",
  mash: "potato masher pressing through cooked potatoes, soft squishing",
  muddle: "wooden muddler crushing mint and lime in glass",
  scramble: "spatula pushing eggs around hot pan, wet curds forming",
  
  // ===== COLD PREPARATION =====
  wash: "fresh vegetables rinsing under running water, water splashing gently in sink",
  clean: "hands rubbing vegetables clean, water droplets falling",
  dry: "kitchen towel patting food dry, soft fabric sounds",
  assemble: "gentle placement of ingredients on plate, soft arranging sounds",
  arrange: "careful food arranging on plate, quiet composition",
  hull: "strawberry stems being removed with soft pop",
  pit: "stone fruit pit being removed, knife cutting around",
  segment: "citrus being separated into segments, membrane tearing softly",
  peel_fruit: "fruit skin being peeled away, juice dripping lightly",
  scoop: "spoon scooping soft fruit flesh, gentle scraping",
  
  // ===== ADDITIONAL COLD PREP =====
  slice_fruit: "knife slicing through soft fruit, juice releasing",
  mix_salad: "salad tongs gently mixing greens and fruits in bowl",
  layer: "ingredients being carefully layered, soft placement sounds",
  
  // ===== GENERIC PREP =====
  cut: "knife cutting through food on cutting board",
  prep: "general food preparation sounds, gentle kitchen work",
  prepare: "quiet preparation, gathering ingredients",
  portion: "dividing food into portions, careful cutting",
  separate: "gently separating components, soft pulling apart",
  extract: "extracting component from food, careful separation",
  
  // ===== PREPARATION TECHNIQUES =====
  marinate: "liquid marinade pouring over meat in dish, splashing",
  season: "salt and pepper shaker sprinkling, fine granules hitting food",
  brine: "meat lowering into salt water solution, gentle splash",
  cure: "salt mixture rubbing onto salmon, grains pressing into flesh",
  coat: "food dredging through flour, light dusty coating sounds",
  bread: "food pressing into breadcrumbs, crispy coating adhering",
  batter: "food dipping into wet batter, dripping excess",
  stuff: "filling being pushed into cavity, soft squelching",
  roll: "rolling pin on dough, wooden cylinder pressing",
  shape: "hands shaping dough balls, soft pressing and forming",
  sift: "flour sifting through mesh sieve, fine powder falling",
  strain: "liquid straining through mesh, dripping into bowl",
  drain: "colander draining pasta water, rushing water sound",
  rinse: "vegetables rinsing under running faucet water",
  soak: "dried ingredients lowering into water, gentle submersion",
  rest: "quiet kitchen ambience, meat resting on board",
  proof: "yeast dough slowly rising, very quiet ambient",
  ferment: "fermentation bubbles in jar, occasional pop",
  pickle: "vegetables lowering into vinegar brine, acidic splash",
  infuse: "tea steeping in hot water, delicate",
  grind: "mortar and pestle grinding spices, stone on stone",
  press: "garlic press squeezing cloves through, soft extrusion",
  squeeze: "hand squeezing lemon, citrus juice streaming",
  skewer: "wooden skewer piercing meat chunks, threading sounds",
  tenderize: "meat mallet thumping raw chicken flat",
  knead: "hands kneading bread dough on floured counter, stretching and folding",
  
  // ===== TEMPERATURE CONTROL =====
  chill: "refrigerator door opening and closing, cool air",
  freeze: "freezer door with frost, ice crackling",
  thaw: "ice melting, water droplets forming and dripping",
  melt: "butter or chocolate slowly melting, soft liquid spreading",
  temper: "chocolate tempering with careful stirring, smooth",
  cool: "hot pan cooling on rack, metal contracting ticks",
  warm: "gentle warming, soft ambient heat",
  room_temp: "quiet room temperature resting",
  preheat: "oven preheating, element clicking and warming",
  ice_bath: "hot pot plunging into ice water, dramatic temperature change",
  
  // ===== FINISHING TECHNIQUES =====
  caramelize: "sugar melting and browning, crackling caramel forming",
  glaze: "pastry brush applying shiny glaze, wet strokes",
  garnish: "tweezers placing microgreens, delicate precise sounds",
  plate: "food carefully placed on ceramic plate, soft ceramic touch",
  drizzle: "thin stream of oil or sauce pouring over dish",
  sprinkle: "fingertips sprinkling herbs, light scattered falling",
  velvet: "cornstarch slurry coating chicken pieces",
  age: "quiet aging ambient, cheese wheel in cave",
  brown: "maillard reaction, food turning golden in pan",
  crisp: "food becoming crunchy, crackling texture forming",
  render: "bacon fat slowly rendering out, gentle sizzle",
  clarify: "butter foam skimming, clear ghee separating",
  
  // ===== SERVICE =====
  serve: "plate sliding onto pass, chef calling order up, kitchen bell ding",
};

// Ingredient-specific sound modifiers
// These add context when specific ingredients are being used
export const ingredientSoundModifiers: Record<string, string> = {
  // Proteins
  egg: "egg cracking and sizzling",
  chicken: "poultry skin crisping",
  beef: "rich beef searing",
  pork: "pork fat rendering",
  fish: "delicate fish skin crisping",
  shrimp: "quick shrimp sizzle",
  bacon: "bacon strips crackling and popping",
  
  // Vegetables
  onion: "onion sizzling and softening",
  garlic: "garlic becoming aromatic",
  potato: "starchy potato cooking",
  pepper: "peppers charring",
  mushroom: "mushrooms releasing moisture",
  
  // Liquids
  wine: "wine deglazing with steam burst",
  butter: "butter foam and sizzle",
  oil: "oil shimmering in hot pan",
  cream: "cream bubbling and thickening",
  stock: "savory stock simmering",
  
  // Grains
  rice: "rice grains absorbing liquid",
  pasta: "pasta bubbling in water",
  bread: "bread crust crackling",
  
  // Aromatics
  herbs: "fresh herbs releasing fragrance",
  spices: "spices toasting aromatically",
};

// Background ambient kitchen sounds
// These loop continuously during cooking
export const ambiencePrompts = {
  // Main kitchen ambience - bustling, realistic
  kitchen: "busy professional restaurant kitchen ambience with chefs calling orders, pots clanking, distant sizzling, ventilation hum, occasional plate sounds, kitchen staff working efficiently",
  
  // Alternative ambiences for variety
  morning: "calm morning kitchen with coffee brewing, eggs frying gently, quiet preparation sounds",
  rush: "intense dinner rush kitchen with multiple burners going, urgent calls, rapid plating",
  quiet: "peaceful home kitchen with single pan cooking, subtle ambient hum",
};

// UI and event sounds
export const uiSounds = {
  orderReceived: "restaurant ticket printer printing new order, paper ripping",
  serve: "service bell ding with plate sliding onto pass",
  success: "satisfied chef hmm with soft positive chime",
  error: "kitchen timer urgent beeping alert",
  start: "gas burner igniting with click and whoosh",
  complete: "order complete with gentle triumphant tone",
};

// Cold techniques that should NOT get heat-related ingredient modifiers
const coldTechniques = new Set([
  'toss', 'mix', 'combine', 'wash', 'rinse', 'peel', 'core',
  'hull', 'pit', 'segment', 'scoop', 'assemble', 'arrange',
  'clean', 'dry', 'garnish', 'plate', 'drizzle', 'sprinkle',
  'slice_fruit', 'mix_salad', 'layer', 'peel_fruit', 'chill',
  'squeeze', 'zest', 'muddle'
]);

// Get the most specific sound prompt for an action + ingredients combo
export function getSoundPrompt(action: string, ingredients?: string[]): string {
  const normalized = action.toLowerCase().replace(/[-\s]/g, '_');
  
  // Get base technique sound
  let basePrompt = techniqueSounds[normalized];
  
  if (!basePrompt) {
    // Try partial match
    for (const [key, prompt] of Object.entries(techniqueSounds)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        basePrompt = prompt;
        break;
      }
    }
  }
  
  if (!basePrompt) {
    // Fallback to category-based sound
    basePrompt = getCategorySound(action);
  }
  
  // Only add ingredient modifiers for HOT techniques
  // Skip for cold preparations to avoid "sizzling" sounds on fruit salad etc.
  if (ingredients && ingredients.length > 0 && !coldTechniques.has(normalized)) {
    const ingredientModifier = getIngredientModifier(ingredients);
    if (ingredientModifier) {
      return `${basePrompt}, ${ingredientModifier}`;
    }
  }
  
  return basePrompt;
}

// Get sound based on tool category
function getCategorySound(action: string): string {
  const normalized = action.toLowerCase();
  
  // Cold/no-heat preparations FIRST (priority)
  if (/wash|rinse|clean|dry/.test(normalized)) {
    return "running water and gentle cleaning sounds";
  }
  if (/toss|mix|combine|assemble|arrange/.test(normalized)) {
    return "gentle mixing and arranging sounds in bowl";
  }
  if (/peel|core|hull|pit|segment|scoop/.test(normalized)) {
    return "soft fruit preparation, gentle cutting and separating";
  }
  if (/drizzle|sprinkle|garnish|plate/.test(normalized)) {
    return "delicate finishing sounds, careful plating";
  }
  
  // Hot preparations
  if (/fry|sear|grill|saute|pan/.test(normalized)) {
    return "food sizzling in hot pan with oil bubbling";
  }
  if (/boil|simmer|steam|poach/.test(normalized)) {
    return "water bubbling gently in pot";
  }
  if (/chop|slice|dice|cut|mince/.test(normalized)) {
    return "sharp knife cutting on wooden board";
  }
  if (/whisk|stir|blend/.test(normalized)) {
    return "utensil mixing ingredients in bowl";
  }
  if (/bake|roast|oven/.test(normalized)) {
    return "oven with gentle heat and occasional sizzle";
  }
  
  // Final fallback - generic but neutral (no sizzling)
  return "kitchen preparation sounds, utensils and ingredients";
}

// Get modifier based on primary ingredient
function getIngredientModifier(ingredients: string[]): string | null {
  for (const ingredient of ingredients) {
    const normalized = ingredient.toLowerCase();
    for (const [key, modifier] of Object.entries(ingredientSoundModifiers)) {
      if (normalized.includes(key)) {
        return modifier;
      }
    }
  }
  return null;
}

// Get ambient sound prompt
export function getAmbiencePrompt(variant: keyof typeof ambiencePrompts = 'kitchen'): string {
  return ambiencePrompts[variant];
}

// Legacy export for compatibility
export const ambiencePrompt = ambiencePrompts.kitchen;

// Export category fallbacks for edge cases
export const categoryFallbacks: Record<string, string> = {
  heat: "food sizzling on hot cooking surface with steam",
  cut: "sharp knife cutting on wooden cutting board",
  mix: "mixing utensil stirring in bowl",
  prepare: "food preparation sounds with various kitchen tools",
  finish: "delicate plating sounds with gentle ceramic touches",
  temperature: "temperature change ambient with subtle sounds",
  transform: "cooking transformation with aromatic sizzle",
};

// Backwards compatibility - map old generic prompts to new specific ones
export const actionSounds = techniqueSounds;
