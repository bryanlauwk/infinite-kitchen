import React from 'react';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import headerIllustration from '@/assets/header-illustration.png';

export const Header: React.FC = () => {
  const { isEnabled, toggleSounds } = useSound();

  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* Illustration background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <img 
          src={headerIllustration} 
          alt="" 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Content */}
      <div className="relative flex justify-between items-start px-6 py-5">
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
          className="gap-2 rounded-xl bg-background/80 backdrop-blur-sm"
        >
          {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          Audio
        </Button>
      </div>
    </header>
  );
};
