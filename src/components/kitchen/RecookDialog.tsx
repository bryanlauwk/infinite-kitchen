import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RotateCcw, MessageSquare, Sparkles } from 'lucide-react';
import { Order } from '@/lib/types';

interface RecookDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecook: (feedback?: string) => void;
  isImprovement?: boolean; // True for low-confidence matches
}

export const RecookDialog: React.FC<RecookDialogProps> = ({
  order,
  open,
  onOpenChange,
  onRecook,
  isImprovement = false,
}) => {
  const [feedback, setFeedback] = useState('');

  const handleRecook = (withFeedback: boolean) => {
    onRecook(withFeedback ? feedback.trim() || undefined : undefined);
    setFeedback('');
    onOpenChange(false);
  };

  const title = isImprovement ? 'Improve dish' : 'Cook dish again';
  const description = isImprovement
    ? 'The dish is ready, but you can send it back with a note for the chef.'
    : 'The dish needs another try. Add a note to help the chef adjust it.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isImprovement ? (
              <Sparkles className="h-5 w-5 text-processing" />
            ) : (
              <RotateCcw className="h-5 w-5" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Order context */}
        <div className="space-y-3 py-2">
          <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-md border border-border/50">
            <div className="text-2xl">{order.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Ordered: {order.dishName}</p>
              {order.servedDish && order.servedDish !== order.dishName && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Served: {order.servedDish}
                </p>
              )}
            </div>
          </div>

          {/* Show previous rejection reasoning */}
          {order.judgeResult?.reasoning && (
            <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded border border-border/30">
              <span className="font-medium">Kitchen note: </span>
              {order.judgeResult.reasoning}
            </div>
          )}

          {/* Show confidence for improvement requests */}
          {isImprovement && order.judgeResult?.confidence && (
            <div className="text-xs text-muted-foreground">
              Dish match score: {order.judgeResult.confidence}%
            </div>
          )}

          {/* Feedback input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Your feedback (optional)
            </label>
            <Textarea
              placeholder={
                isImprovement
                  ? 'e.g., "Add more spice" or "Make it crispier"...'
                  : 'e.g., "Please use traditional ingredients" or "Cook it longer"...'
              }
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Previous attempts info */}
          {order.recookCount && order.recookCount > 0 && (
            <p className="text-xs text-muted-foreground">
              This will be attempt #{order.recookCount + 2}
            </p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleRecook(false)}
            className="flex-1 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Cook again
          </Button>
          <Button
            onClick={() => handleRecook(true)}
            className="flex-1 gap-1.5"
            disabled={!feedback.trim()}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Cook with notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
