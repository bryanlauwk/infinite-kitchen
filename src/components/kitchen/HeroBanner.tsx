import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="bg-hero border-b border-border px-6 py-6">
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-hero-foreground mb-2">
          Cook anything. Something always happens.
        </h2>
        <p className="text-sm text-hero-foreground/80">
          Tell the kitchen what you want. It figures out the rest.
        </p>
      </div>
    </section>
  );
};