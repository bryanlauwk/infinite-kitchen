import { IngredientCategory, IngredientGroup } from './types';

export const categoryToGroup: Record<IngredientCategory, IngredientGroup> = {
  proteins: 'primary',
  vegetables: 'primary',
  fruits: 'primary',
  dairy: 'macronutrients',
  grains: 'macronutrients',
  nuts: 'macronutrients',
  spices: 'micronutrients',
  liquids: 'culinary',
  condiments: 'culinary',
  generated: 'discovered',
};

export const groupLabels: Record<IngredientGroup, string> = {
  discovered: 'Newly Discovered',
  primary: 'Primary Foods',
  macronutrients: 'Grains & Dairy',
  micronutrients: 'Herbs & Spices',
  culinary: 'Oils & Condiments',
};

export const groupOrder: IngredientGroup[] = [
  'discovered',
  'primary',
  'macronutrients',
  'micronutrients',
  'culinary',
];
