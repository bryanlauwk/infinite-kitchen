import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { tools } from '@/data/tools';

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
  // Get unique categories in order
  const categories = ['heat', 'cut', 'mix', 'prepare', 'temperature', 'transform', 'finish'];
  
  // Group tools by category
  const groupedTools = categories.reduce((acc, category) => {
    acc[category] = tools.filter(t => t.category === category);
    return acc;
  }, {} as Record<string, typeof tools>);
  
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="mb-3">
        <h2 className="font-bold uppercase text-sm tracking-wide">Techniques</h2>
        <p className="text-xs text-muted-foreground">
          Ways the kitchen behaves.
        </p>
      </div>
      
      <ScrollArea className="h-[320px]">
        <div className="space-y-4 pr-2">
          {categories.map(category => {
            const categoryTools = groupedTools[category];
            if (!categoryTools || categoryTools.length === 0) return null;
            
            return (
              <div key={category}>
                <h3 className="text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">
                  {categoryLabels[category]}
                </h3>
                <div className="space-y-1">
                  {categoryTools.slice(0, 6).map(tool => (
                    <div 
                      key={tool.id}
                      className="flex items-center gap-2 text-sm py-1"
                    >
                      <span className="text-base">{tool.emoji}</span>
                      <code className="text-xs text-muted-foreground">
                        {tool.id}()
                      </code>
                    </div>
                  ))}
                  {categoryTools.length > 6 && (
                    <div className="text-xs text-muted-foreground pl-6">
                      +{categoryTools.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
