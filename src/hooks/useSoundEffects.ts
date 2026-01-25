import { useCallback, useRef, useState } from 'react';
import { getSoundPrompt, getAmbiencePrompt, uiSounds } from '@/lib/sounds';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// In-memory cache for generated sounds
const soundCache = new Map<string, Blob>();

// Track recently played sounds to avoid repetition
const recentlyPlayed = new Set<string>();
const RECENT_LIMIT = 5;

export function useSoundEffects() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const ambienceLoaded = useRef(false);
  const currentActionAudio = useRef<HTMLAudioElement | null>(null);

  // Fetch sound from ElevenLabs via edge function
  const fetchSound = useCallback(async (prompt: string, duration: number = 3): Promise<Blob | null> => {
    // Check cache first
    const cacheKey = `${prompt}-${duration}`;
    if (soundCache.has(cacheKey)) {
      return soundCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ prompt, duration }),
        }
      );

      if (!response.ok) {
        console.warn('SFX fetch failed:', response.status);
        return null;
      }

      const blob = await response.blob();
      soundCache.set(cacheKey, blob);
      return blob;
    } catch (error) {
      console.warn('SFX fetch error:', error);
      return null;
    }
  }, []);

  // Play a sound blob
  const playBlob = useCallback(async (
    blob: Blob, 
    options: { loop?: boolean; volume?: number } = {}
  ): Promise<HTMLAudioElement | null> => {
    if (!isEnabled) return null;

    const { loop = false, volume: customVolume } = options;

    try {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.volume = customVolume ?? volume;
      audio.loop = loop;
      
      audio.onended = () => {
        if (!loop) {
          URL.revokeObjectURL(audioUrl);
        }
      };

      await audio.play();
      return audio;
    } catch (error) {
      console.warn('Audio playback error:', error);
      return null;
    }
  }, [isEnabled, volume]);

  // Start background ambience (loops)
  const startAmbience = useCallback(async (variant: 'kitchen' | 'morning' | 'rush' | 'quiet' = 'kitchen') => {
    if (!isEnabled || ambienceRef.current) return;

    // Only fetch ambience once per variant
    const ambiencePrompt = getAmbiencePrompt(variant);
    
    if (!ambienceLoaded.current) {
      console.log('Starting kitchen ambience...');
      const blob = await fetchSound(ambiencePrompt, 10);
      if (blob) {
        const audio = await playBlob(blob, { loop: true, volume: volume * 0.25 });
        if (audio) {
          ambienceRef.current = audio;
          ambienceLoaded.current = true;
        }
      }
    } else if (ambienceRef.current) {
      ambienceRef.current.play();
    }
  }, [isEnabled, volume, fetchSound, playBlob]);

  // Stop background ambience with fade out
  const stopAmbience = useCallback(() => {
    if (ambienceRef.current) {
      const audio = ambienceRef.current;
      
      // Fade out over 1.5 seconds
      const fadeInterval = setInterval(() => {
        if (audio.volume > 0.03) {
          audio.volume = Math.max(0, audio.volume - 0.03);
        } else {
          clearInterval(fadeInterval);
          audio.pause();
          audio.volume = volume * 0.25; // Reset for next time
        }
      }, 100);
    }
  }, [volume]);

  // Play sound for a cooking action with ingredient context
  const playActionSound = useCallback(async (
    action: string, 
    ingredients?: string[]
  ) => {
    if (!isEnabled) return;

    // Stop any currently playing action sound
    if (currentActionAudio.current) {
      currentActionAudio.current.pause();
      currentActionAudio.current = null;
    }

    // Get technique-specific prompt with ingredient awareness
    const prompt = getSoundPrompt(action, ingredients);
    
    // Track to avoid immediate repetition
    const soundKey = `${action}-${(ingredients || []).join('-')}`;
    
    // Add slight variation if recently played
    let finalPrompt = prompt;
    if (recentlyPlayed.has(soundKey)) {
      // Add variation suffix for slight difference
      const variations = [
        ", slightly different intensity",
        ", from a different angle",
        ", with subtle variation",
      ];
      finalPrompt = prompt + variations[Math.floor(Math.random() * variations.length)];
    }
    
    // Update recently played
    recentlyPlayed.add(soundKey);
    if (recentlyPlayed.size > RECENT_LIMIT) {
      const first = recentlyPlayed.values().next().value;
      recentlyPlayed.delete(first);
    }

    console.log(`Playing sound: ${action}`, ingredients ? `with ${ingredients.join(', ')}` : '');
    
    // Determine duration based on action type
    const duration = getActionDuration(action);
    
    const blob = await fetchSound(finalPrompt, duration);
    if (blob) {
      const audio = await playBlob(blob, { volume: volume * 0.8 });
      if (audio) {
        currentActionAudio.current = audio;
        audio.onended = () => {
          currentActionAudio.current = null;
        };
      }
    }
  }, [isEnabled, volume, fetchSound, playBlob]);

  // Play order received sound
  const playOrderSound = useCallback(async () => {
    if (!isEnabled) return;
    const blob = await fetchSound(uiSounds.orderReceived, 2);
    if (blob) {
      await playBlob(blob, { volume: volume * 0.6 });
    }
  }, [isEnabled, volume, fetchSound, playBlob]);

  // Play serve sound
  const playServeSound = useCallback(async () => {
    if (!isEnabled) return;
    const blob = await fetchSound(uiSounds.serve, 2);
    if (blob) {
      await playBlob(blob, { volume: volume * 0.7 });
    }
  }, [isEnabled, volume, fetchSound, playBlob]);

  // Play success sound
  const playSuccessSound = useCallback(async () => {
    if (!isEnabled) return;
    const blob = await fetchSound(uiSounds.success, 2);
    if (blob) {
      await playBlob(blob, { volume: volume * 0.6 });
    }
  }, [isEnabled, volume, fetchSound, playBlob]);

  // Play error sound
  const playErrorSound = useCallback(async () => {
    if (!isEnabled) return;
    const blob = await fetchSound(uiSounds.error, 2);
    if (blob) {
      await playBlob(blob, { volume: volume * 0.5 });
    }
  }, [isEnabled, volume, fetchSound, playBlob]);

  // Play start cooking sound
  const playStartSound = useCallback(async () => {
    if (!isEnabled) return;
    const blob = await fetchSound(uiSounds.start, 2);
    if (blob) {
      await playBlob(blob, { volume: volume * 0.5 });
    }
  }, [isEnabled, volume, fetchSound, playBlob]);

  // Toggle sounds on/off
  const toggleSounds = useCallback(() => {
    setIsEnabled(prev => {
      if (prev) {
        // Turning off - stop all sounds
        if (ambienceRef.current) {
          ambienceRef.current.pause();
        }
        if (currentActionAudio.current) {
          currentActionAudio.current.pause();
        }
      }
      return !prev;
    });
  }, []);

  // Update volume
  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (ambienceRef.current) {
      ambienceRef.current.volume = newVolume * 0.25;
    }
  }, []);

  return {
    isEnabled,
    volume,
    toggleSounds,
    updateVolume,
    startAmbience,
    stopAmbience,
    playActionSound,
    playOrderSound,
    playServeSound,
    playSuccessSound,
    playErrorSound,
    playStartSound,
  };
}

// Determine appropriate sound duration based on action type
function getActionDuration(action: string): number {
  const normalized = action.toLowerCase();
  
  // Quick actions - shorter sounds
  if (/crack|chop|dice|slice|zest|score|flip/.test(normalized)) {
    return 2;
  }
  
  // Medium actions
  if (/sear|saute|whisk|stir|fold|mix|blend/.test(normalized)) {
    return 3;
  }
  
  // Longer continuous actions
  if (/boil|simmer|roast|bake|braise|reduce/.test(normalized)) {
    return 4;
  }
  
  // Default
  return 3;
}
