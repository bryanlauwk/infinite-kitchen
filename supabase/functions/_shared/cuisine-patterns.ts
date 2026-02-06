// Cuisine detection for the cooking-agent edge function
// Extracted from the inline implementation for maintainability

interface CuisineInfo {
  type: string;
  region: string;
  hints: string[];
}

const cuisinePatterns: Record<string, { keywords: string[]; hints: string[] }> = {
  malaysian: {
    keywords: ['nasi lemak', 'laksa', 'char kway teow', 'rendang', 'satay', 'roti canai', 'mee goreng', 'ayam percik', 'sambal', 'belacan', 'nasi kandar', 'asam laksa', 'nasi kerabu'],
    hints: ['Use coconut milk (santan) for richness', 'Sambal belacan is essential for authentic heat', 'Aromatics: lemongrass, galangal, kaffir lime leaves, pandan', 'Balance of sweet, sour, salty, and spicy'],
  },
  thai: {
    keywords: ['pad thai', 'tom yum', 'green curry', 'massaman', 'khao soi', 'som tam', 'pad kra pao', 'tom kha', 'panang', 'larb'],
    hints: ['Balance of sweet, sour, salty, and spicy (four tastes)', 'Fish sauce (nam pla) is essential for umami', 'Fresh Thai basil, cilantro, and mint for garnish', 'Thai chilies for proper heat level'],
  },
  vietnamese: {
    keywords: ['pho', 'banh mi', 'goi cuon', 'bun bo hue', 'com tam', 'bun cha', 'banh xeo', 'cao lau', 'mi quang'],
    hints: ['Fresh herbs are paramount: mint, Thai basil, cilantro', 'Fish sauce (nuoc mam) in everything', 'Light, clean flavors with minimal oil', 'Lime and fresh vegetables for brightness'],
  },
  indonesian: {
    keywords: ['nasi goreng', 'rendang', 'soto ayam', 'gado gado', 'rijsttafel', 'gudeg', 'bakso', 'satay', 'tempeh', 'sambal goreng'],
    hints: ['Slow-cook rendang until dry and caramelized', 'Kecap manis (sweet soy sauce) is essential', 'Sambal varieties for heat', 'Galangal, turmeric, and candlenuts in spice pastes'],
  },
  japanese: {
    keywords: ['sushi', 'ramen', 'tempura', 'tonkatsu', 'teriyaki', 'udon', 'soba', 'yakitori', 'miso', 'gyoza'],
    hints: ['Dashi (kelp and bonito) is the foundation', 'Mirin, sake, and soy sauce for seasoning', 'Precision and presentation matter', 'Fresh, high-quality ingredients'],
  },
  korean: {
    keywords: ['kimchi', 'bibimbap', 'bulgogi', 'samgyeopsal', 'japchae', 'tteokbokki', 'sundubu', 'galbi'],
    hints: ['Gochujang and gochugaru for heat', 'Fermented ingredients: kimchi, doenjang', 'Sesame oil for fragrance', 'Marinating meat for tenderness'],
  },
  chinese: {
    keywords: ['dim sum', 'kung pao', 'mapo tofu', 'peking duck', 'chow mein', 'fried rice', 'dumplings', 'char siu'],
    hints: ['Wok hei (high heat cooking) is essential', 'Light soy, dark soy, and oyster sauce', 'Ginger and scallion aromatics', 'Cornstarch for velveting proteins'],
  },
  indian: {
    keywords: ['curry', 'biryani', 'tikka masala', 'naan', 'samosa', 'dal', 'tandoori', 'korma', 'vindaloo'],
    hints: ['Toast whole spices before grinding', 'Build layers of flavor with aromatics', 'Ghee for cooking', 'Yogurt for marinades'],
  },
  french: {
    keywords: ['croissant', 'coq au vin', 'bouillabaisse', 'ratatouille', 'quiche', 'souffle', 'crepe', 'beef bourguignon'],
    hints: ['Butter and cream are essential', 'Mother sauces as foundation', 'Proper technique over speed', 'Deglaze with wine for sauces'],
  },
  italian: {
    keywords: ['pasta', 'pizza', 'risotto', 'lasagna', 'carbonara', 'bolognese', 'tiramisu', 'gnocchi'],
    hints: ['Quality olive oil and fresh ingredients', 'Al dente pasta is crucial', 'Finish pasta in the sauce', 'Parmesan for finishing'],
  },
};

const regionMap: Record<string, string> = {
  malaysian: 'southeast_asian',
  thai: 'southeast_asian',
  vietnamese: 'southeast_asian',
  indonesian: 'southeast_asian',
  japanese: 'east_asian',
  korean: 'east_asian',
  chinese: 'east_asian',
  indian: 'south_asian',
  french: 'european',
  italian: 'european',
};

export function detectCuisine(dishName: string): CuisineInfo {
  const normalizedName = dishName.toLowerCase();

  for (const [cuisineType, { keywords, hints }] of Object.entries(cuisinePatterns)) {
    for (const keyword of keywords) {
      if (normalizedName.includes(keyword)) {
        return {
          type: cuisineType,
          region: regionMap[cuisineType] || 'other',
          hints,
        };
      }
    }
  }

  return {
    type: 'generic',
    region: 'other',
    hints: ['Focus on fundamental cooking techniques', 'Balance flavors: salt, acid, fat, heat'],
  };
}
