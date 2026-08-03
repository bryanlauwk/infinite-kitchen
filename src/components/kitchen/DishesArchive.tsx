import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useKitchen } from '@/context/KitchenContext';
import { renderStars, getCustomerAvatarForDish } from '@/lib/reviewGenerator';
import { cn } from '@/lib/utils';
import { DishIllustration } from './DishIllustration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RotateCcw, Search, Share2, Sparkles, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { RecookDialog } from './RecookDialog';
import { Order } from '@/lib/types';
import { isFeaturedDish } from '@/data/featured';

type ArchiveFilter = 'all' | 'verified' | 'rejected' | 'featured';

export const DishesArchive: React.FC = () => {
  const { orders, recookOrder, resetProgress } = useKitchen();
  const [dialogOrder, setDialogOrder] = useState<Order | null>(null);
  const [isImprovement, setIsImprovement] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>('all');
  const [highlightedDishId, setHighlightedDishId] = useState<string | null>(null);
  const dishRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Only show served/verified/rejected dishes
  const completedDishes = orders.filter(
    order => order.status === 'served' || order.status === 'verified' || order.status === 'rejected'
  );

  const filteredDishes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return completedDishes.filter(dish => {
      const dishLabel = dish.servedDish || dish.dishName;
      const matchesSearch = !normalizedQuery ||
        dishLabel.toLowerCase().includes(normalizedQuery) ||
        dish.dishName.toLowerCase().includes(normalizedQuery) ||
        dish.id.toLowerCase().includes(normalizedQuery) ||
        dish.status.toLowerCase().includes(normalizedQuery);

      const matchesFilter =
        archiveFilter === 'all' ||
        dish.status === archiveFilter ||
        (archiveFilter === 'featured' && isFeaturedDish(dish.id));

      return matchesSearch && matchesFilter;
    });
  }, [archiveFilter, completedDishes, searchQuery]);

  const verifiedCount = completedDishes.filter(dish => dish.status === 'verified').length;
  const rejectedCount = completedDishes.filter(dish => dish.status === 'rejected').length;
  const featuredCount = completedDishes.filter(dish => isFeaturedDish(dish.id)).length;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const dishId = params.get('dish');
    if (!dishId) return;

    setHighlightedDishId(dishId);
    window.setTimeout(() => {
      dishRefs.current.get(dishId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [completedDishes.length]);
  
  const handleRecookClick = (order: Order, improvement: boolean = false) => {
    setDialogOrder(order);
    setIsImprovement(improvement);
  };

  const handleRecook = (feedback?: string) => {
    if (!dialogOrder) return;
    
    recookOrder(dialogOrder.id, feedback);
    toast({
      title: feedback ? "Dish returned with feedback" : "Dish returned to orders",
      description: `${dialogOrder.dishName} is ready for attempt #${(dialogOrder.recookCount || 0) + 2}`,
    });
    setDialogOrder(null);
  };

  const handleShareDish = async (dish: Order) => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('dish', dish.id);

    try {
      await navigator.clipboard.writeText(url.toString());
      toast({
        title: 'Dish link copied',
        description: `${dish.servedDish || dish.dishName} is ready to share.`,
      });
      setHighlightedDishId(dish.id);
    } catch {
      window.history.replaceState(null, '', url);
      toast({
        title: 'Dish link added to URL',
        description: 'Copy the current address to share it.',
      });
    }
  };
  
  if (completedDishes.length === 0) {
    return null; // Don't show until first dish is completed
  }
  
  return (
    <section className="px-3 py-4 sm:px-6">
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="font-bold text-lg">Dish History</h2>
              <p className="text-xs text-muted-foreground">
                Showing {filteredDishes.length} of {completedDishes.length} saved dishes.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-1.5 text-xs text-muted-foreground md:w-auto"
              onClick={resetProgress}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear history
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_170px] gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search served dishes"
                aria-label="Search served dishes"
                className="h-9 rounded-lg pl-8 text-xs"
              />
            </div>
            <Select value={archiveFilter} onValueChange={(value) => setArchiveFilter(value as ArchiveFilter)}>
              <SelectTrigger className="h-9 rounded-lg text-xs">
                <SelectValue placeholder="Filter archive" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                <SelectItem value="all">All ({completedDishes.length})</SelectItem>
                <SelectItem value="verified">Approved ({verifiedCount})</SelectItem>
                <SelectItem value="rejected">Try again ({rejectedCount})</SelectItem>
                <SelectItem value="featured">This Week ({featuredCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Dishes list */}
        <div className="divide-y divide-border">
          {filteredDishes.map((dish, index) => {
            const customerAvatar = dish.review ? getCustomerAvatarForDish(dish.id) : null;
            const isHighlighted = highlightedDishId === dish.id;
            const isFeatured = isFeaturedDish(dish.id);
            
            return (
              <div 
                key={dish.id}
                ref={(el) => {
                  if (el) dishRefs.current.set(dish.id, el);
                }}
                className={cn(
                  "p-4 transition-all",
                  index === 0 && "animate-slide-in",
                  isHighlighted && "bg-processing/10 ring-2 ring-inset ring-processing/50"
                )}
              >
                {/* Dish info row */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden">
                    <DishIllustration 
                      dishName={dish.servedDish || dish.dishName}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm leading-tight">
                        {dish.servedDish || dish.dishName}
                      </h3>
                      {isFeatured && (
                        <span className="rounded border border-processing/40 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-processing">
                          this week
                        </span>
                      )}
                    </div>
                    {dish.servedDish && dish.servedDish !== dish.dishName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Order: {dish.dishName}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => handleShareDish(dish)}
                    aria-label={`Copy share link for ${dish.servedDish || dish.dishName}`}
                    title="Copy dish link"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                {/* Review block with customer avatar */}
                {dish.review && customerAvatar && (
                  <div className="mt-3 p-3 bg-secondary/50 rounded-md border border-border/50">
                    <div className="flex items-start gap-3">
                      {/* Customer Avatar */}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm"
                        style={{ backgroundColor: customerAvatar.color }}
                      >
                        {customerAvatar.initials}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Customer name and stars */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-foreground/80">
                            {customerAvatar.name}
                          </span>
                          <span 
                            className="text-sm tracking-wider text-processing"
                            aria-label={`${dish.review.stars} out of 5 stars`}
                          >
                            {renderStars(dish.review.stars)}
                          </span>
                        </div>
                        
                        {/* Review comment */}
                        <p className="text-sm text-foreground/70 italic leading-relaxed">
                          "{dish.review.comment}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Waiting for review indicator */}
                {!dish.review && dish.status !== 'rejected' && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50 animate-pulse" />
                      Waiting for feedback
                    </span>
                  </div>
                )}
                
                {/* Rejected dishes - show recook option */}
                {dish.status === 'rejected' && !dish.review && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground opacity-60">
                      The dish needs another try.
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => handleRecookClick(dish, false)}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Cook again
                    </Button>
                  </div>
                )}

                {/* Low-confidence verified dishes - show improvement option */}
                {dish.status === 'verified' && dish.improvable && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground opacity-60">
                      The dish can be improved.
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs text-processing hover:text-processing"
                      onClick={() => handleRecookClick(dish, true)}
                    >
                      <Sparkles className="h-3 w-3" />
                      Improve dish
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredDishes.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No dishes found.
            </div>
          )}
        </div>
      </div>

      {/* Recook Dialog */}
      {dialogOrder && (
        <RecookDialog
          order={dialogOrder}
          open={!!dialogOrder}
          onOpenChange={(open) => !open && setDialogOrder(null)}
          onRecook={handleRecook}
          isImprovement={isImprovement}
        />
      )}
    </section>
  );
};
