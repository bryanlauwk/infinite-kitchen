import React, { ReactNode } from 'react';

interface KitchenLayoutProps {
  children: ReactNode;
}

export const KitchenLayout: React.FC<KitchenLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left checkered border */}
      <div className="w-3 checkered-border-left flex-shrink-0" />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {children}
      </div>
      
      {/* Right checkered border */}
      <div className="w-3 checkered-border-right flex-shrink-0" />
    </div>
  );
};
