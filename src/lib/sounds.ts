// Sound Effects Configuration for Infinite Kitchen
// Maps cooking actions to ElevenLabs SFX prompts

export const actionSounds: Record<string, string> = {
  // Heat actions
  grill: "sizzling meat on a hot grill with crackling fire",
  pan_fry: "sizzling frying pan with hot oil and food cooking",
  saute: "gentle sizzling in a pan with wooden spoon stirring",
  sear: "intense sizzling of meat hitting a hot pan",
  roast: "oven roasting with gentle crackling",
  bake: "oven baking with soft ambient heat",
  broil: "broiler heating with intense overhead heat",
  toast: "toaster popping with crispy sound",
  char: "charring food with smoky sizzle",
  flame: "open flame cooking with whooshing fire",
  smoke: "smoker with gentle hissing smoke",
  
  // Liquid actions
  boil: "bubbling boiling water in a pot",
  simmer: "gentle simmering liquid with occasional bubbles",
  poach: "gentle water poaching with soft bubbles",
  blanch: "quick blanching splash in boiling water",
  steam: "steam hissing from a pot with lid",
  braise: "braising liquid bubbling gently",
  reduce: "liquid reducing with concentrated bubbling",
  deglaze: "sizzling deglaze with liquid hitting hot pan",
  
  // Frying actions
  deep_fry: "intense bubbling oil deep frying food",
  shallow_fry: "shallow frying with medium sizzle",
  stir_fry: "wok stir frying with high heat sizzle",
  flash_fry: "quick intense frying sizzle",
  tempura: "tempura frying with light crispy bubbles",
  
  // Cutting actions
  chop: "sharp knife chopping vegetables on cutting board",
  dice: "rhythmic knife dicing on wooden cutting board",
  slice: "knife slicing through food cleanly",
  mince: "rapid mincing with sharp knife",
  julienne: "precise julienne cutting strokes",
  cube: "knife cutting into cubes on cutting board",
  shred: "shredding food with grater or knife",
  carve: "carving knife slicing through roasted meat",
  fillet: "filleting knife gliding along fish bones",
  debone: "knife deboning with occasional bone crack",
  peel: "vegetable peeler scraping skin off",
  zest: "zester scraping citrus peel",
  core: "coring tool removing fruit core",
  trim: "knife trimming excess from food",
  score: "knife scoring surface of food",
  
  // Mixing actions
  whisk: "wire whisk beating eggs in a metal bowl",
  stir: "wooden spoon stirring in a pot",
  blend: "electric blender whirring and mixing",
  mix: "mixing ingredients together in bowl",
  fold: "gentle folding with spatula",
  beat: "vigorous beating with whisk or beater",
  cream: "creaming butter and sugar together",
  emulsify: "whisking emulsion together vigorously",
  whip: "whipping cream or eggs to peaks",
  aerate: "aerating mixture with gentle folding",
  
  // Prep actions
  crack: "egg cracking against bowl edge",
  crush: "crushing garlic or spices with knife",
  pound: "meat mallet pounding on cutting board",
  grind: "grinding spices in mortar and pestle",
  grate: "grater scraping cheese or vegetables",
  press: "pressing garlic through press",
  squeeze: "squeezing citrus juice",
  drain: "draining water from colander",
  strain: "straining liquid through sieve",
  sift: "sifting flour through mesh",
  knead: "kneading dough on counter",
  roll: "rolling pin on dough",
  shape: "shaping dough or food by hand",
  stuff: "stuffing filling into food",
  wrap: "wrapping food in wrapper",
  skewer: "skewering food onto stick",
  marinate: "pouring marinade over food",
  brine: "submerging food in brine solution",
  cure: "rubbing cure onto food",
  tenderize: "tenderizing meat with mallet",
  
  // Finishing actions
  plate: "plating food with gentle placement",
  garnish: "placing garnish with precision",
  drizzle: "drizzling sauce over dish",
  dust: "dusting powder over food",
  glaze: "brushing glaze over surface",
  torch: "culinary torch caramelizing surface",
  rest: "quiet resting period",
  cool: "food cooling with ambient sounds",
  chill: "refrigerator door closing",
  freeze: "freezer with cold air",
  thaw: "ice melting with dripping",
  
  // Serve action
  serve: "restaurant bell ding for order ready",
};

// Default fallback prompts by category
export const categoryFallbacks: Record<string, string> = {
  heat: "sizzling cooking sounds on hot surface",
  cut: "knife cutting on cutting board",
  mix: "mixing and stirring sounds in bowl",
  prepare: "food preparation sounds in kitchen",
  finish: "gentle plating and presentation sounds",
  temperature: "temperature changing ambient sound",
  transform: "cooking transformation with steam and sizzle",
};

// Background ambience prompt
export const ambiencePrompt = "busy professional restaurant kitchen background ambience with distant cooking sounds pots clanking and kitchen activity";

// Success/failure sounds
export const uiSounds = {
  serve: "restaurant service bell ding",
  success: "cheerful success chime ding",
  error: "gentle error buzz notification",
  start: "kitchen timer starting beep",
};

// Get sound prompt for an action
export function getSoundPrompt(action: string): string {
  const normalized = action.toLowerCase().replace(/[-\s]/g, '_');
  
  if (actionSounds[normalized]) {
    return actionSounds[normalized];
  }
  
  // Try to find a partial match
  for (const [key, prompt] of Object.entries(actionSounds)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return prompt;
    }
  }
  
  // Return generic cooking sound
  return "cooking sound effect in a busy kitchen";
}
