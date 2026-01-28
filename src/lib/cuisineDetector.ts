// Cuisine Detection Utility for Southeast Asian and Global Cuisines

export type CuisineType = 
  | 'malaysian' 
  | 'thai' 
  | 'vietnamese' 
  | 'indonesian' 
  | 'singaporean'
  | 'filipino'
  | 'japanese' 
  | 'korean'
  | 'chinese'
  | 'indian'
  | 'french' 
  | 'italian'
  | 'spanish'
  | 'mexican'
  | 'american'
  | 'generic';

export type CuisineRegion = 
  | 'southeast_asian' 
  | 'east_asian' 
  | 'south_asian'
  | 'european' 
  | 'american' 
  | 'other';

export interface CuisineInfo {
  type: CuisineType;
  region: CuisineRegion;
  cookingHints: string[];
}

// Keyword patterns for cuisine detection
const cuisinePatterns: Record<CuisineType, { keywords: string[]; hints: string[] }> = {
  malaysian: {
    keywords: [
      'nasi lemak', 'laksa', 'char kway teow', 'rendang', 'satay', 'roti canai',
      'mee goreng', 'nasi goreng', 'ayam percik', 'curry puff', 'kuih', 'cendol',
      'teh tarik', 'murtabak', 'rojak', 'asam laksa', 'nasi kerabu', 'otak-otak',
      'lemang', 'ketupat', 'sambal', 'belacan', 'ikan bakar', 'sup tulang',
      'nasi kandar', 'nasi dagang', 'keropok lekor', 'bubur lambuk'
    ],
    hints: [
      'Use coconut milk (santan) for richness',
      'Sambal belacan is essential for authentic heat',
      'Aromatics: lemongrass, galangal, kaffir lime leaves, pandan',
      'Balance of sweet, sour, salty, and spicy',
      'Fried shallots and anchovies (ikan bilis) for texture',
      'Turmeric leaf and torch ginger for traditional flavor'
    ]
  },
  thai: {
    keywords: [
      'pad thai', 'tom yum', 'green curry', 'massaman', 'khao soi', 'som tam',
      'pad kra pao', 'tom kha', 'panang', 'larb', 'moo ping', 'khao pad',
      'pad see ew', 'gaeng keow wan', 'pla rad prik', 'yum woon sen',
      'kao moo daeng', 'boat noodles', 'pad prik king', 'mango sticky rice'
    ],
    hints: [
      'Balance of sweet, sour, salty, and spicy (four tastes)',
      'Fish sauce (nam pla) is essential for umami',
      'Fresh Thai basil, cilantro, and mint for garnish',
      'Palm sugar for authentic sweetness',
      'Thai chilies for proper heat level',
      'Tamarind paste for characteristic sourness'
    ]
  },
  vietnamese: {
    keywords: [
      'pho', 'banh mi', 'goi cuon', 'bun bo hue', 'com tam', 'bun cha',
      'banh xeo', 'cao lau', 'mi quang', 'nem ran', 'bun rieu', 'che',
      'bo kho', 'canh chua', 'banh cuon', 'xoi', 'ga nuong', 'thit kho'
    ],
    hints: [
      'Fresh herbs are paramount: mint, Thai basil, cilantro, perilla',
      'Fish sauce (nuoc mam) in everything',
      'Light, clean flavors with minimal oil',
      'Lime and fresh vegetables for brightness',
      'Rice noodles and rice paper wraps',
      'Star anise and cinnamon for pho broth'
    ]
  },
  indonesian: {
    keywords: [
      'nasi goreng', 'rendang', 'soto ayam', 'gado gado', 'satay', 'rijsttafel',
      'gudeg', 'bakso', 'mie ayam', 'sate padang', 'rawon', 'opor ayam',
      'tempeh', 'sambal goreng', 'pecel', 'nasi uduk', 'martabak', 'es cendol',
      'nasi campur', 'ayam goreng', 'bebek goreng', 'karedok'
    ],
    hints: [
      'Slow-cook rendang until dry and caramelized',
      'Kecap manis (sweet soy sauce) is essential',
      'Sambal varieties: sambal oelek, sambal matah, sambal terasi',
      'Galangal, turmeric, and candlenuts in spice pastes',
      'Tempeh and tofu are protein staples',
      'Coconut milk for curries and desserts'
    ]
  },
  singaporean: {
    keywords: [
      'hainanese chicken rice', 'chili crab', 'laksa', 'char kway teow',
      'hokkien mee', 'bak kut teh', 'kaya toast', 'fish head curry',
      'carrot cake', 'popiah', 'satay bee hoon', 'mee siam'
    ],
    hints: [
      'Precise technique for silky chicken rice',
      'Rich, thick gravy for chili crab',
      'Wok hei (breath of the wok) is essential',
      'Fresh prawns and seafood',
      'Sambal chili on the side'
    ]
  },
  filipino: {
    keywords: [
      'adobo', 'sinigang', 'lechon', 'kare kare', 'sisig', 'lumpia',
      'pancit', 'bistek', 'tinola', 'kaldereta', 'menudo', 'tocino'
    ],
    hints: [
      'Vinegar and soy sauce base for adobo',
      'Tamarind for sinigang sourness',
      'Crispy pork skin (chicharon) for texture',
      'Calamansi for citrus notes',
      'Bagoong (fermented shrimp paste) for depth'
    ]
  },
  japanese: {
    keywords: [
      'sushi', 'ramen', 'tempura', 'tonkatsu', 'teriyaki', 'udon', 'soba',
      'yakitori', 'miso', 'gyoza', 'okonomiyaki', 'takoyaki', 'donburi',
      'onigiri', 'katsu curry', 'shabu shabu', 'sukiyaki'
    ],
    hints: [
      'Dashi (kelp and bonito) is the foundation',
      'Mirin, sake, and soy sauce for seasoning',
      'Precision and presentation matter',
      'Fresh, high-quality ingredients',
      'Balance of umami flavors'
    ]
  },
  korean: {
    keywords: [
      'kimchi', 'bibimbap', 'bulgogi', 'samgyeopsal', 'japchae', 'tteokbokki',
      'sundubu', 'galbi', 'jjigae', 'gimbap', 'pajeon', 'bossam'
    ],
    hints: [
      'Gochujang and gochugaru for heat',
      'Fermented ingredients: kimchi, doenjang, ganjang',
      'Sesame oil for fragrance',
      'Banchan (side dishes) accompany meals',
      'Marinating meat for tenderness'
    ]
  },
  chinese: {
    keywords: [
      'dim sum', 'kung pao', 'mapo tofu', 'peking duck', 'chow mein',
      'fried rice', 'dumplings', 'hot pot', 'char siu', 'congee',
      'wonton', 'spring rolls', 'lo mein', 'xiao long bao'
    ],
    hints: [
      'Wok hei (high heat cooking) is essential',
      'Light soy, dark soy, and oyster sauce',
      'Shaoxing wine for deglazing',
      'Ginger and scallion aromatics',
      'Cornstarch for velveting proteins'
    ]
  },
  indian: {
    keywords: [
      'curry', 'biryani', 'tikka masala', 'naan', 'samosa', 'dal',
      'tandoori', 'korma', 'vindaloo', 'palak paneer', 'butter chicken',
      'dosa', 'idli', 'chutney', 'raita', 'rogan josh'
    ],
    hints: [
      'Toast whole spices before grinding',
      'Build layers of flavor with aromatics',
      'Ghee or mustard oil for cooking',
      'Yogurt for marinades and cooling',
      'Fresh cilantro and mint for garnish'
    ]
  },
  french: {
    keywords: [
      'croissant', 'baguette', 'coq au vin', 'bouillabaisse', 'ratatouille',
      'quiche', 'souffle', 'crepe', 'beef bourguignon', 'creme brulee',
      'mousse', 'confit', 'cassoulet', 'hollandaise'
    ],
    hints: [
      'Butter and cream are essential',
      'Mother sauces: béchamel, velouté, espagnole, hollandaise, tomato',
      'Proper technique over speed',
      'Mirepoix (onion, carrot, celery) as base',
      'Deglaze with wine for sauces'
    ]
  },
  italian: {
    keywords: [
      'pasta', 'pizza', 'risotto', 'lasagna', 'carbonara', 'bolognese',
      'tiramisu', 'gnocchi', 'ravioli', 'bruschetta', 'pesto', 'gelato',
      'osso buco', 'minestrone', 'caprese', 'arancini'
    ],
    hints: [
      'Quality olive oil and fresh ingredients',
      'Al dente pasta is crucial',
      'San Marzano tomatoes for sauce',
      'Finish pasta in the sauce',
      'Parmesan, pecorino for finishing'
    ]
  },
  spanish: {
    keywords: [
      'paella', 'tapas', 'gazpacho', 'tortilla', 'churros', 'croquetas',
      'jamon', 'patatas bravas', 'sangria', 'albondigas'
    ],
    hints: [
      'Saffron for paella',
      'Smoked paprika (pimentón)',
      'Olive oil liberally',
      'Slow cooking for stews',
      'Sherry vinegar for acidity'
    ]
  },
  mexican: {
    keywords: [
      'taco', 'burrito', 'enchilada', 'quesadilla', 'mole', 'tamale',
      'guacamole', 'salsa', 'pozole', 'carnitas', 'fajita', 'churro'
    ],
    hints: [
      'Toast and rehydrate dried chilies',
      'Fresh lime juice and cilantro',
      'Corn tortillas for authenticity',
      'Lard for traditional cooking',
      'Layer flavors in mole'
    ]
  },
  american: {
    keywords: [
      'burger', 'bbq', 'mac and cheese', 'fried chicken', 'pancakes',
      'apple pie', 'chowder', 'buffalo wings', 'hot dog', 'cheesecake'
    ],
    hints: [
      'High heat for proper sear',
      'Low and slow for BBQ',
      'Butter and cheese generously',
      'Cast iron for even cooking'
    ]
  },
  generic: {
    keywords: [],
    hints: [
      'Focus on fundamental cooking techniques',
      'Balance flavors: salt, acid, fat, heat',
      'Taste and adjust seasoning as you cook',
      'Let proteins rest after cooking'
    ]
  }
};

const regionMap: Record<CuisineType, CuisineRegion> = {
  malaysian: 'southeast_asian',
  thai: 'southeast_asian',
  vietnamese: 'southeast_asian',
  indonesian: 'southeast_asian',
  singaporean: 'southeast_asian',
  filipino: 'southeast_asian',
  japanese: 'east_asian',
  korean: 'east_asian',
  chinese: 'east_asian',
  indian: 'south_asian',
  french: 'european',
  italian: 'european',
  spanish: 'european',
  mexican: 'american',
  american: 'american',
  generic: 'other'
};

/**
 * Detects cuisine type from dish name and returns cooking hints
 */
export function detectCuisine(dishName: string): CuisineInfo {
  const normalizedName = dishName.toLowerCase();
  
  // Check each cuisine for keyword matches
  for (const [cuisineType, { keywords, hints }] of Object.entries(cuisinePatterns)) {
    if (cuisineType === 'generic') continue;
    
    for (const keyword of keywords) {
      if (normalizedName.includes(keyword)) {
        return {
          type: cuisineType as CuisineType,
          region: regionMap[cuisineType as CuisineType],
          cookingHints: hints
        };
      }
    }
  }
  
  // Fallback to generic
  return {
    type: 'generic',
    region: 'other',
    cookingHints: cuisinePatterns.generic.hints
  };
}

/**
 * Formats cuisine context for the cooking agent prompt
 */
export function formatCuisineContext(cuisineInfo: CuisineInfo): string {
  if (cuisineInfo.type === 'generic') {
    return '';
  }
  
  const regionLabel = cuisineInfo.region.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  return `CUISINE CONTEXT: ${cuisineInfo.type.charAt(0).toUpperCase() + cuisineInfo.type.slice(1)} (${regionLabel})
- ${cuisineInfo.cookingHints.join('\n- ')}`;
}
