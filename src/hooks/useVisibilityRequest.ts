import { useEffect, useRef, useState } from 'react';
import { useIllustrations } from '@/context/IllustrationContext';

type IllustrationType = 'dish' | 'chef' | 'ingredient' | 'technique';

interface UseVisibilityRequestOptions {
  name: string;
  type: IllustrationType;
  displayName?: string;
  rootMargin?: string;
}

/**
 * Hook that triggers illustration requests only when the element is visible in the viewport.
 * Uses IntersectionObserver to defer requests for offscreen items.
 */
export const useVisibilityRequest = ({
  name,
  type,
  displayName,
  rootMargin = '100px'
}: UseVisibilityRequestOptions) => {
  const { getIllustration, requestIllustration } = useIllustrations();
  const [hasRequested, setHasRequested] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Generate the prompt key consistently
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const promptKey = `${type}_${normalized}`;
  const illustrationState = getIllustration(promptKey);

  useEffect(() => {
    // Don't observe if already have URL or already requested
    if (illustrationState.url || hasRequested) {
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasRequested) {
          setHasRequested(true);
          requestIllustration(name, type, displayName);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [name, type, displayName, hasRequested, illustrationState.url, requestIllustration, rootMargin]);

  return {
    elementRef,
    illustrationState,
    promptKey
  };
};
