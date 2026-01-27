import React from 'react';
import headerIllustration from '@/assets/header-illustration.png';

export const Header: React.FC = () => {
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
      <div className="relative flex justify-between items-start px-6 py-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
            INFINITE KITCHEN
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Where ingredients become possibilities
          </p>
        </div>
        
        <a 
          href="https://www.bryanlauwk.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          bryanlauwk.fun
        </a>
      </div>
    </header>
  );
};
