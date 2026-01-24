import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-border px-6 py-4">
      <h1 className="text-2xl font-bold tracking-tight">Infinite Kitchen</h1>
      <p className="text-sm text-muted-foreground">
        A kitchen that always works and never finishes discovering
      </p>
    </header>
  );
};
