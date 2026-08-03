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
    <section className="mx-3 my-4 px-4 py-4 bg-hero rounded-xl text-center sm:mx-6 sm:px-6">
      <p className="text-lg text-hero-foreground">
        Things happen here. Meals, mostly.
      </p>
      {showHint && (
        <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground sm:flex-row">
          <span>
            Select ingredients, choose a technique, then summon a dish from the order board.
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
