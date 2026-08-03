import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const TUTORIAL_KEY = 'infinite-kitchen-first-run-dismissed';

export const HeroBanner: React.FC = () => {
  const [showHint, setShowHint] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(TUTORIAL_KEY) !== 'true';
  });

  const dismissHint = () => {
    setShowHint(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TUTORIAL_KEY, 'true');
    }
  };

  return (
    <section className="mx-3 my-4 border-y border-border bg-hero px-4 py-4 text-center sm:mx-6 sm:px-6">
      <p className="text-lg text-hero-foreground">
        Choose a dish. See how the kitchen prepares it.
      </p>
      {showHint && (
        <div className="mt-3 flex flex-col items-center justify-center gap-2 border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground sm:flex-row">
          <span>
            Pick a dish and press Start cooking. The kitchen will choose the ingredients and methods.
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0"
            onClick={dismissHint}
            aria-label="Dismiss kitchen hint"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </section>
  );
};
