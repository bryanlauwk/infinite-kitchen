import { useCallback, useRef, useState } from 'react';
import { getSoundPrompt, getAmbiencePrompt, uiSounds } from '@/lib/sounds';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// In-memory cache for generated sounds
const soundCache = new Map<string, Blob>();

// Track recently played sounds to avoid repetition
const recentlyPlayed = new Set<string>();
const RECENT_LIMIT = 5;

// Sound queue to prevent overlap
interface QueueItem {
  blob: Blob;
  volume: number;
  resolve: () => void;
}

export function useSoundEffects() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const ambienceLoaded = useRef(false);
  const currentActionAudio = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);
  const soundQueue = useRef<QueueItem[]>([]);

  // Process sound queue
  const processQueue = useCallback(async () => {
    if (isPlaying.current || soundQueue.current.length === 0) return;
    
    isPlaying.current = true;
    const item = soundQueue.current.shift()!;
    
    try {
      const audioUrl = URL.createObjectURL(item.blob);
      const audio = new Audio(audioUrl);
      audio.volume = item.volume;
      
      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.play().catch(() => resolve());
      });
      
      // Small gap between sounds
      await new Promise(r => setTimeout(r, 200));
    } finally {
      isPlaying.current = false;
      item.resolve();
      processQueue();
    }
  }, []);

  // Fetch sound from ElevenLabs via edge function with timeout
  const fetchSound = useCallback(async (prompt: string, duration: number = 3): Promise<Blob | null> => {
    // Check cache first
    const cacheKey = `${prompt}-${duration}`;
    if (soundCache.has(cacheKey)) {
      return soundCache.get(cacheKey)!;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('SFX fetch failed:', response.status, errorText);
        return null;
      }

      // Verify we got audio, not JSON error
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        console.warn('SFX generation error:', errorData);
        return null;
      }

      const blob = await response.blob();
      
      // Validate audio size (sanity check)
      if (blob.size < 1000) {
        console.warn('SFX audio too small, likely failed:', blob.size, 'bytes');
        return null;
      }

      soundCache.set(cacheKey, blob);
      return blob;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('SFX fetch timed out');
      } else {
        console.warn('SFX fetch error:', error);
      }
      return null;
    }
  }, []);

  // Play a sound blob
  const playBlob = useCallback(async (
    blob: Blob, 
    options: { loop?: boolean; volume?: number; queue?: boolean } = {}
  ): Promise<HTMLAudioElement | null> => {
    if (!isEnabled) return null;

    const { loop = false, volume: customVolume, queue = false } = options;
    const effectiveVolume = customVolume ?? volume;

    // If queuing is requested and not looping, add to queue
    if (queue && !loop) {
      return new Promise((resolve) => {
        soundQueue.current.push({ 
          blob, 
          volume: effectiveVolume,
          resolve: () => resolve(null)
        });
        processQueue();
      });
    }

    try {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.volume = effectiveVolume;
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
  }, [isEnabled, volume, processQueue]);

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
      await playBlob(blob, { volume: volume * 0.6, queue: true });
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
        // Clear queue
        soundQueue.current = [];
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

// Determine appropriate sound duration based on action type and thermal zone
function getActionDuration(action: string): number {
  const normalized = action.toLowerCase();
  
  // ===== COLD PREPARATIONS (2 seconds - quick, quiet) =====
  // Washing/cleaning
  if (/wash|rinse|clean|dry|drain/.test(normalized)) {
    return 2;
  }
  // Cold mixing/arranging
  if (/toss|combine|arrange|plate|drizzle|sprinkle|assemble|layer|garnish/.test(normalized)) {
    return 2;
  }
  // Fruit preparation
  if (/peel|core|hull|segment|pit|scoop|zest|squeeze|muddle/.test(normalized)) {
    return 2;
  }
  if (/slice_fruit|mix_salad|peel_fruit/.test(normalized)) {
    return 2;
  }
  // Temperature control (cold)
  if (/chill|freeze|thaw|room_temp|ice_bath|cool/.test(normalized)) {
    return 2;
  }
  // Marinating/soaking
  if (/marinate|brine|pickle|soak|cure/.test(normalized)) {
    return 2;
  }
  
  // ===== CUTTING (2 seconds - rhythmic but brief) =====
  if (/crack|chop|dice|slice|score|flip|season|press|trim|cut|mince|julienne|cube|carve|fillet|debone|shred|grate/.test(normalized)) {
    return 2;
  }
  
  // ===== NEUTRAL/MIXING (3 seconds - medium) =====
  if (/whisk|stir|fold|mix|blend|mash|beat|cream|emulsify|whip|aerate|puree|knead/.test(normalized)) {
    return 3;
  }
  // Shaping/forming
  if (/stuff|roll|shape|skewer|portion/.test(normalized)) {
    return 3;
  }
  // Coating/breading
  if (/coat|bread|batter|season/.test(normalized)) {
    return 3;
  }
  
  // ===== HOT TECHNIQUES (3-4 seconds - need time for sizzle) =====
  // Quick hot (3 seconds)
  if (/sear|saute|stir_fry|flash_fry|scramble|deglaze/.test(normalized)) {
    return 3;
  }
  // Continuous hot (4 seconds - longer sizzle/bubble)
  if (/boil|simmer|roast|bake|braise|reduce|stew|fry|grill|deep_fry|pan_fry|tempura/.test(normalized)) {
    return 4;
  }
  // Intense heat (4 seconds)
  if (/flambe|char|smoke|caramelize|render|broil/.test(normalized)) {
    return 4;
  }
  
  // Default - medium duration
  return 3;
}
