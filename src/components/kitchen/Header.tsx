import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  return (
    <header className="px-6 py-4 border-b border-border">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Infinite Kitchen
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Where AI chefs turn any recipe into reality
          </p>
        </div>
        
        <Button variant="outline" size="sm" className="gap-2">
          <Volume2 className="h-4 w-4" />
          Audio
        </Button>
      </div>
    </header>
  );
};
