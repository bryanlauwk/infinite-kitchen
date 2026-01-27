import React from 'react';
import { Switch } from '@/components/ui/switch';

interface Tool {
  id: string;
  emoji: string;
  name: string;
}

interface TechniqueToggleProps {
  tool: Tool;
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
}

export const TechniqueToggle: React.FC<TechniqueToggleProps> = ({ 
  tool, 
  isActive = true,
  onToggle 
}) => {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className="flex items-center gap-3">
        <span className="text-lg group-hover:scale-110 transition-transform">{tool.emoji}</span>
        <code className="text-xs text-muted-foreground font-mono">
          {tool.id}()
        </code>
      </div>
      <Switch 
        checked={isActive} 
        onCheckedChange={onToggle}
        className="scale-75 data-[state=checked]:bg-gemini"
      />
    </div>
  );
};
