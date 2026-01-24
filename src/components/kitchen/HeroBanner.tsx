import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="bg-hero border-b border-border px-6 py-6">
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-hero-foreground mb-2">
          Cook Anything. Discover Everything.
        </h2>
        <p className="text-sm text-hero-foreground/80">
          Order any dish. The kitchen figures out the rest, revealing new ingredients and techniques along the way.
        </p>
      </div>
    </section>
  );
};
