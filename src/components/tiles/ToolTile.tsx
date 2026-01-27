import React from 'react';
import { Tool } from '@/lib/types';
import { TechniqueIllustration } from '@/components/kitchen/TechniqueIllustration';

interface ToolTileProps {
  tool: Tool;
}

export const ToolTile: React.FC<ToolTileProps> = ({ tool }) => {
  return (
    <div className="tile flex items-center gap-2 py-2">
      <TechniqueIllustration 
        techniqueName={tool.name}
        techniqueId={tool.id}
        className="w-6 h-6"
      />
      <span className="text-sm font-mono">{tool.name}()</span>
    </div>
  );
};
