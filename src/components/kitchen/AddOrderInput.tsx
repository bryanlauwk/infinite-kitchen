import React, { useState } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

const placeholderExamples = [
  'Eggs Benedict',
  'Pad Thai',
  'Caesar Salad',
  'Beef Bourguignon',
  'Sushi Roll',
  'Chocolate Soufflé',
  'Ramen',
  'Margherita Pizza',
];

export const AddOrderInput: React.FC = () => {
  const { addOrder } = useKitchen();
  const [dishName, setDishName] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Rotate placeholder on focus
  const handleFocus = () => {
    setPlaceholderIndex(prev => (prev + 1) % placeholderExamples.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmed = dishName.trim();
    if (!trimmed) {
      toast.error('Please enter a dish name');
      return;
    }

    addOrder(trimmed);
    setDishName('');
    toast.success(`Added order: ${trimmed}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
      <div className="relative flex-1">
        <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          onFocus={handleFocus}
          placeholder={`Try "${placeholderExamples[placeholderIndex]}"...`}
          className="pl-9 font-mono text-sm bg-background"
        />
      </div>
      <Button 
        type="submit" 
        size="sm"
        className="gap-1"
        disabled={!dishName.trim()}
      >
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </form>
  );
};
