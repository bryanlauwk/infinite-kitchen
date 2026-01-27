import React from 'react';
import footerIllustration from '@/assets/footer-illustration.png';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-8 border-t border-border overflow-hidden">
      {/* Illustration */}
      <div className="h-32 md:h-40">
        <img 
          src={footerIllustration} 
          alt="" 
          className="w-full h-full object-cover object-top"
        />
      </div>
      
      {/* Subtle overlay with text */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex items-end justify-center pb-4">
        <p className="text-xs text-muted-foreground">
          The kitchen remains open
        </p>
      </div>
    </footer>
  );
};
