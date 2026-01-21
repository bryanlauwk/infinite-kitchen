import React from 'react';
import { Tool } from '@/lib/types';

interface ToolTileProps {
  tool: Tool;
}

export const ToolTile: React.FC<ToolTileProps> = ({ tool }) => {
  return (
    <div className="tile flex items-center gap-2 py-2">
      <span className="text-base opacity-60">{tool.emoji}</span>
      <span className="text-sm font-mono">{tool.name}()</span>
    </div>
  );
};
