import React, { useEffect } from 'react';
import headerIllustration from '@/assets/header-illustration.png';
import { Button } from '@/components/ui/button';
import { useSound } from '@/context/SoundContext';
import { Volume2, VolumeX } from 'lucide-react';

const SOUND_PREF_KEY = 'infinite-kitchen-sound-enabled';

export const Header: React.FC = () => {
  const { isEnabled, toggleSounds } = useSound();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedPreference = window.localStorage.getItem(SOUND_PREF_KEY);
    if (savedPreference !== 'true' && isEnabled) {
      toggleSounds();
    }
  }, [isEnabled, toggleSounds]);

  const handleToggleSound = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SOUND_PREF_KEY, String(!isEnabled));
    }
    toggleSounds();
  };

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
      <div className="relative flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
            INFINITE KITCHEN
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Where ingredients become possibilities
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 rounded-lg text-xs"
            onClick={handleToggleSound}
            aria-pressed={isEnabled}
            aria-label={isEnabled ? 'Turn kitchen sound off' : 'Turn kitchen sound on'}
          >
            {isEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            Sound {isEnabled ? 'On' : 'Off'}
          </Button>
          <a
            href="https://www.bryanlauwk.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            bryanlauwk.fun
          </a>
        </div>
      </div>
    </header>
  );
};
