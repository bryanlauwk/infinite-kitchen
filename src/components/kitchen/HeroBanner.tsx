import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="mx-6 my-4 px-6 py-4 bg-hero rounded-xl text-center">
      <p className="text-lg text-hero-foreground">
        Things happen here. Meals, mostly.
      </p>
    </section>
  );
};
