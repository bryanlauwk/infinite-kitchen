import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface IllustrationState {
  url: string | null;
  isLoading: boolean;
  error: string | null;
}

interface IllustrationContextType {
  getIllustration: (key: string) => IllustrationState;
  requestIllustration: (dishName: string, type: 'dish' | 'chef') => Promise<string | null>;
}

const IllustrationContext = createContext<IllustrationContextType | undefined>(undefined);

export const useIllustrations = () => {
  const context = useContext(IllustrationContext);
  if (!context) {
    throw new Error('useIllustrations must be used within an IllustrationProvider');
  }
  return context;
};

// Generate a consistent key from dish name
const generatePromptKey = (name: string, type: 'dish' | 'chef'): string => {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${type}_${normalized}`;
};

interface IllustrationProviderProps {
  children: ReactNode;
}

// Detailed prompts for chef avatars
const chefPrompts: Record<string, string> = {
  alchemist_robot_chef: 'A cute friendly robot chef character with chef hat and ladle. Light gray and blue metallic colors. Vector art style with soft gradients. Simple geometric shapes, rounded friendly appearance. Clean white background. No text.',
  transmuter_octopus_creature: 'A whimsical purple octopus chef creature character. Cute cartoon style with soft gradients and rounded shapes. Playful and friendly expression. Clean white background. No text. Think indie game mascot.',
  oracle_sun_orb: 'A warm glowing sun orb character with a friendly face. Orange and golden yellow colors with soft gradients. Cosmic and magical appearance. Clean white background. No text. Vector art style.',
};

export const IllustrationProvider: React.FC<IllustrationProviderProps> = ({ children }) => {
  const [illustrations, setIllustrations] = useState<Record<string, IllustrationState>>({});
  const pendingRequests = useRef<Set<string>>(new Set());
  const requestQueue = useRef<Array<() => Promise<void>>>([]);
  const activeRequests = useRef<number>(0);
  const MAX_CONCURRENT = 3;

  const processQueue = useCallback(async () => {
    while (requestQueue.current.length > 0 && activeRequests.current < MAX_CONCURRENT) {
      const nextRequest = requestQueue.current.shift();
      if (nextRequest) {
        activeRequests.current++;
        try {
          await nextRequest();
        } finally {
          activeRequests.current--;
          processQueue();
        }
      }
    }
  }, []);

  const getIllustration = useCallback((key: string): IllustrationState => {
    return illustrations[key] || { url: null, isLoading: false, error: null };
  }, [illustrations]);

  const requestIllustration = useCallback(async (
    dishName: string,
    type: 'dish' | 'chef'
  ): Promise<string | null> => {
    const promptKey = generatePromptKey(dishName, type);

    // Return cached URL if available
    if (illustrations[promptKey]?.url) {
      return illustrations[promptKey].url;
    }

    // Prevent duplicate requests
    if (pendingRequests.current.has(promptKey)) {
      return null;
    }

    pendingRequests.current.add(promptKey);

    // Set loading state
    setIllustrations(prev => ({
      ...prev,
      [promptKey]: { url: null, isLoading: true, error: null }
    }));

    return new Promise((resolve) => {
      const doRequest = async () => {
        try {
          // First check database cache
          const { data: cached } = await supabase
            .from('generated_illustrations')
            .select('image_url')
            .eq('prompt_key', promptKey)
            .single();

          if (cached?.image_url) {
            setIllustrations(prev => ({
              ...prev,
              [promptKey]: { url: cached.image_url, isLoading: false, error: null }
            }));
            pendingRequests.current.delete(promptKey);
            resolve(cached.image_url);
            return;
          }

          // Generate new illustration - use chef-specific prompt if available
          const actualPrompt = type === 'chef' && chefPrompts[dishName] 
            ? chefPrompts[dishName] 
            : dishName;
            
          const { data, error } = await supabase.functions.invoke('generate-illustration', {
            body: { dishName: actualPrompt, type, promptKey }
          });

          if (error) {
            throw new Error(error.message);
          }

          if (data?.error) {
            throw new Error(data.error);
          }

          const imageUrl = data?.imageUrl;

          if (imageUrl) {
            setIllustrations(prev => ({
              ...prev,
              [promptKey]: { url: imageUrl, isLoading: false, error: null }
            }));
            resolve(imageUrl);
          } else {
            throw new Error('No image URL returned');
          }
        } catch (err) {
          console.error(`Failed to generate illustration for ${dishName}:`, err);
          setIllustrations(prev => ({
            ...prev,
            [promptKey]: { 
              url: null, 
              isLoading: false, 
              error: err instanceof Error ? err.message : 'Unknown error' 
            }
          }));
          resolve(null);
        } finally {
          pendingRequests.current.delete(promptKey);
        }
      };

      requestQueue.current.push(doRequest);
      processQueue();
    });
  }, [illustrations, processQueue]);

  const value: IllustrationContextType = {
    getIllustration,
    requestIllustration,
  };

  return (
    <IllustrationContext.Provider value={value}>
      {children}
    </IllustrationContext.Provider>
  );
};
