import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { tools } from '@/data/tools';
import { TechniqueToggle } from './TechniqueToggle';

// Group tools by category for display
const categoryLabels: Record<string, string> = {
  heat: 'Heat',
  cut: 'Cut',
  mix: 'Mix',
  prepare: 'Prepare',
  temperature: 'Temperature',
  transform: 'Transform',
  finish: 'Finish',
};

export const TechniquesPanel: React.FC = () => {
  // Track active techniques (all enabled by default)
  const [activeTechniques, setActiveTechniques] = useState<Set<string>>(
    new Set(tools.map(t => t.id))
  );
  
  const toggleTechnique = (id: string, active: boolean) => {
    setActiveTechniques(prev => {
      const next = new Set(prev);
      if (active) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };
  
  // Get unique categories in order
  const categories = ['heat', 'cut', 'mix', 'prepare', 'temperature', 'transform', 'finish'];
  
  // Group tools by category
  const groupedTools = categories.reduce((acc, category) => {
    acc[category] = tools.filter(t => t.category === category);
    return acc;
  }, {} as Record<string, typeof tools>);
  
  return (
    <div className="border border-border rounded-2xl p-4 bg-card card-elevated h-full flex flex-col">
      <div className="mb-3 flex-shrink-0">
        <h2 className="font-bold uppercase text-sm tracking-wide">Impossible Techniques</h2>
        <p className="text-xs text-muted-foreground">
          Toggle what the kitchen can do.
        </p>
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 pr-2">
          {categories.map(category => {
            const categoryTools = groupedTools[category];
            if (!categoryTools || categoryTools.length === 0) return null;
            
            return (
              <div key={category}>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-1 text-muted-foreground px-3">
                  {categoryLabels[category]}
                </h3>
                <div className="space-y-0.5">
                  {categoryTools.map(tool => (
                    <TechniqueToggle
                      key={tool.id}
                      tool={tool}
                      isActive={activeTechniques.has(tool.id)}
                      onToggle={(active) => toggleTechnique(tool.id, active)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
