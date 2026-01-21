import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="mx-6 mt-4 p-4 bg-hero border border-border rounded-lg">
      <div className="text-center">
        <h2 className="text-lg md:text-xl font-bold tracking-wide uppercase">
          👨‍🍳 Ultimate Function Calling Challenge! 👨‍🍳
        </h2>
        <p className="text-sm text-hero-foreground/80 mt-1">
          Sequence tasks from 100 tools and 100 ingredients to prepare a meal
        </p>
      </div>
    </div>
  );
};
