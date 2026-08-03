import React from 'react';
import { Switch } from '@/components/ui/switch';
import { TechniqueIllustration } from './TechniqueIllustration';

interface Tool {
  id: string;
  emoji: string;
  name: string;
}

interface TechniqueToggleProps {
  tool: Tool;
  isActive?: boolean;
  isCurrentlyUsed?: boolean;
  onToggle?: (active: boolean) => void;
}

export const TechniqueToggle: React.FC<TechniqueToggleProps> = ({ 
  tool, 
  isActive = true,
  isCurrentlyUsed = false,
  onToggle 
}) => {
  return (
    <div 
      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-300 group ${
        isCurrentlyUsed 
          ? 'bg-gemini/20 ring-2 ring-gemini/50 scale-[1.02] shadow-md' 
          : 'hover:bg-muted/50'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`transition-transform duration-300 ${isCurrentlyUsed ? 'scale-110' : ''}`}>
          <TechniqueIllustration
            techniqueName={tool.name}
            techniqueId={tool.id}
          />
        </div>
        <span className={`text-xs capitalize transition-all duration-300 ${
          isCurrentlyUsed 
            ? 'text-gemini font-semibold' 
            : 'text-muted-foreground'
        }`}>
          {tool.name}
        </span>
        {isCurrentlyUsed && (
          <span className="inline-flex h-2 w-2 rounded-full bg-gemini animate-pulse" />
        )}
      </div>
      <Switch 
        checked={isActive} 
        onCheckedChange={onToggle}
        className="scale-75 data-[state=checked]:bg-gemini"
      />
    </div>
  );
};
