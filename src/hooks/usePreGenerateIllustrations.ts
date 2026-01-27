import { useEffect, useRef } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';
import { orderTemplates } from '@/data/orders';

// Chef keys for pre-generation
const chefKeys = [
  'alchemist_robot_chef',
  'transmuter_octopus_creature',
  'oracle_sun_orb',
];

// Priority ingredients to pre-generate (most common ones)
const priorityIngredients = [
  'egg', 'chicken', 'beef', 'tomato', 'onion', 'garlic', 
  'cheese', 'butter', 'rice', 'pasta', 'bread', 'salt'
];

// Priority techniques to pre-generate (most common ones)
const priorityTechniques = [
  'fry', 'boil', 'chop', 'slice', 'stir', 'season', 
  'bake', 'grill', 'mix', 'serve'
];

export const usePreGenerateIllustrations = () => {
  const { requestIllustration, getIllustration } = useIllustrations();
  const hasStartedPreGen = useRef(false);

  useEffect(() => {
    if (hasStartedPreGen.current) return;
    hasStartedPreGen.current = true;

    const preGenerate = async () => {
      // Small delay to let the app initialize
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Pre-generate chef avatars first (highest priority)
      for (const chefKey of chefKeys) {
        const state = getIllustration(`chef_${chefKey}`);
        if (!state.url && !state.isLoading) {
          requestIllustration(chefKey, 'chef');
          // Stagger requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // 2. Pre-generate initial visible dishes (one from each difficulty)
      const initialDishes = [
        ...orderTemplates.filter(t => t.difficulty === 'beginner').slice(0, 1),
        ...orderTemplates.filter(t => t.difficulty === 'easy').slice(0, 2),
        ...orderTemplates.filter(t => t.difficulty === 'intermediate').slice(0, 2),
        ...orderTemplates.filter(t => t.difficulty === 'hard').slice(0, 1),
        ...orderTemplates.filter(t => t.difficulty === 'expert').slice(0, 1),
        ...orderTemplates.filter(t => t.difficulty === 'legendary').slice(0, 1),
      ];
      
      for (const template of initialDishes) {
        const state = getIllustration(`dish_${template.dishName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
        if (!state.url && !state.isLoading) {
          await requestIllustration(template.dishName, 'dish');
          await new Promise(r => setTimeout(r, 500));
        }
      }

      // 3. Pre-generate priority ingredients (after dishes are done)
      for (const ingredient of priorityIngredients.slice(0, 6)) {
        const state = getIllustration(`ingredient_${ingredient}`);
        if (!state.url && !state.isLoading) {
          requestIllustration(ingredient, 'ingredient' as any);
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }

      // 4. Pre-generate priority techniques
      for (const technique of priorityTechniques.slice(0, 6)) {
        const state = getIllustration(`technique_${technique}`);
        if (!state.url && !state.isLoading) {
          requestIllustration(technique, 'technique' as any);
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      // 5. Continue with more dishes in the background
      const remainingDishes = orderTemplates.filter(
        t => !initialDishes.includes(t)
      ).slice(0, 20);
      
      for (const template of remainingDishes) {
        const state = getIllustration(`dish_${template.dishName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
        if (!state.url && !state.isLoading) {
          await requestIllustration(template.dishName, 'dish');
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    };

    preGenerate();
  }, [requestIllustration, getIllustration]);
};
