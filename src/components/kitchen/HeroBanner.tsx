import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="mx-6 mt-4 p-4 bg-hero border border-border rounded-lg">
      <div className="text-center">
        <h2 className="text-lg md:text-xl font-bold tracking-wide uppercase">
          🍳 Cook Anything. Discover Everything. 🍳
        </h2>
        <p className="text-sm text-hero-foreground/80 mt-1">
          Order any dish and watch AI chefs collaborate using 100+ tools and ingredients
        </p>
      </div>
    </div>
  );
};
