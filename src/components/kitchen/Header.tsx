import React from 'react';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export const Header: React.FC = () => {
  const { isEnabled, toggleSounds } = useSound();

  return (
    <header className="flex justify-between items-start px-6 py-4 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">INFINITE KITCHEN</h1>
        <p className="text-sm text-muted-foreground">
          A culinary sandbox powered by impossible & endless possibilities.
        </p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={toggleSounds}
        className="gap-2"
      >
        {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        Audio
      </Button>
    </header>
  );
};
