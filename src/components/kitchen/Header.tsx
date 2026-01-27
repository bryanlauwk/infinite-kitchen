import React from 'react';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export const Header: React.FC = () => {
  const { isEnabled, toggleSounds } = useSound();

  return (
    <header className="flex justify-between items-start px-6 py-5 border-b border-border">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
          INFINITE KITCHEN
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Where ingredients become possibilities
        </p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={toggleSounds}
        className="gap-2 rounded-xl"
      >
        {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        Audio
      </Button>
    </header>
  );
};
