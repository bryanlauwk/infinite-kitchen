// Customer Review Generator
// Generates human-feeling, slightly unpredictable food reviews
// Observational, not instructional. They reflect, not teach.

import { CustomerReview } from './types';

// Reviews are grouped by star rating, with multiple options per tier
const reviewPool: Record<number, string[]> = {
  5: [
    "I don't know why this worked.",
    "Unexpectedly perfect.",
    "Made me forget what I ordered.",
    "Felt like someone understood me.",
    "This shouldn't exist, and yet.",
    "I keep thinking about it.",
    "Quietly transcendent.",
    "The kind of thing you remember.",
    "Left me a little changed.",
    "Suspiciously good.",
  ],
  4: [
    "Comforting. Slightly confusing. Would eat again.",
    "Almost exactly what I wanted.",
    "Better than I deserved today.",
    "Solid. Maybe great.",
    "Made sense in a way I didn't expect.",
    "I'd come back for this.",
    "Pleasant surprise.",
    "Hits different.",
    "Scratched an itch I didn't know I had.",
    "Four stars, but I mean it.",
  ],
  3: [
    "It was fine. Really, it was fine.",
    "Competent. Not sure if that's a compliment.",
    "Did the job.",
    "Neither here nor there.",
    "I've had worse. Also better.",
    "Acceptable in every measurable way.",
    "Three stars. No notes.",
    "This exists, and I ate it.",
    "Unremarkable. Untroubling.",
    "A meal happened.",
  ],
  2: [
    "Not what I expected. Still thinking about it.",
    "Confusing, but not entirely unpleasant.",
    "I finished it, which says something.",
    "Almost interesting.",
    "Had potential.",
    "Two stars. I'm being generous.",
    "I wanted to like this more.",
    "The idea was better than the execution.",
    "Left me with questions.",
    "Points for effort.",
  ],
  1: [
    "I respect the attempt.",
    "This taught me something about myself.",
    "Bold choice.",
    "I'm not angry, just confused.",
    "One star, but educational.",
    "Memorable for the wrong reasons.",
    "I won't forget this. I've tried.",
    "A learning experience.",
    "Humbling.",
    "Let's not speak of this again.",
  ],
};

// Weight distribution for star ratings (skews toward 3-4 stars, like real reviews)
const starWeights = [
  { stars: 5, weight: 15 },
  { stars: 4, weight: 35 },
  { stars: 3, weight: 30 },
  { stars: 2, weight: 15 },
  { stars: 1, weight: 5 },
];

function weightedRandomStars(): 1 | 2 | 3 | 4 | 5 {
  const totalWeight = starWeights.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const { stars, weight } of starWeights) {
    random -= weight;
    if (random <= 0) {
      return stars as 1 | 2 | 3 | 4 | 5;
    }
  }
  
  return 3; // fallback
}

function pickRandomComment(stars: number): string {
  const pool = reviewPool[stars] || reviewPool[3];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function generateReview(): CustomerReview {
  const stars = weightedRandomStars();
  const comment = pickRandomComment(stars);
  
  return { stars, comment };
}

// Render stars as a string for display
export function renderStars(stars: number): string {
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

// Customer avatar pool - whimsical, surreal customer personas
const customerAvatars = [
  { name: 'The Void', color: 'hsl(270 60% 50%)' },
  { name: 'Wanderer', color: 'hsl(200 70% 50%)' },
  { name: 'Cloud Nine', color: 'hsl(180 60% 55%)' },
  { name: 'Stardust', color: 'hsl(45 90% 55%)' },
  { name: 'Whisper', color: 'hsl(320 50% 55%)' },
  { name: 'Echo', color: 'hsl(160 60% 45%)' },
  { name: 'Drift', color: 'hsl(220 65% 55%)' },
  { name: 'Ember', color: 'hsl(15 80% 55%)' },
  { name: 'Mist', color: 'hsl(190 40% 60%)' },
  { name: 'Ripple', color: 'hsl(240 55% 60%)' },
  { name: 'Glimmer', color: 'hsl(50 85% 50%)' },
  { name: 'Breeze', color: 'hsl(170 55% 50%)' },
  { name: 'Shadow', color: 'hsl(260 30% 40%)' },
  { name: 'Spark', color: 'hsl(35 90% 55%)' },
  { name: 'Haze', color: 'hsl(280 45% 55%)' },
  { name: 'Flicker', color: 'hsl(25 75% 55%)' },
];

export interface CustomerAvatar {
  name: string;
  color: string;
  initials: string;
}

export function getRandomCustomerAvatar(): CustomerAvatar {
  const avatar = customerAvatars[Math.floor(Math.random() * customerAvatars.length)];
  return {
    ...avatar,
    initials: avatar.name.substring(0, 2).toUpperCase(),
  };
}

// Seeded random for consistent avatar per dish
export function getCustomerAvatarForDish(dishId: string): CustomerAvatar {
  // Simple hash from dish ID
  let hash = 0;
  for (let i = 0; i < dishId.length; i++) {
    const char = dishId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % customerAvatars.length;
  const avatar = customerAvatars[index];
  return {
    ...avatar,
    initials: avatar.name.substring(0, 2).toUpperCase(),
  };
}
