import { useCallback, useRef, useState } from 'react';
import { getSoundPrompt, ambiencePrompt, uiSounds } from '@/lib/sounds';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// In-memory cache for generated sounds
const soundCache = new Map<string, Blob>();

export function useSoundEffects() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const ambienceLoaded = useRef(false);

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
  const playBlob = useCallback(async (blob: Blob, loop: boolean = false): Promise<HTMLAudioElement | null> => {
    if (!isEnabled) return null;

    try {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.volume = volume;
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
  const startAmbience = useCallback(async () => {
    if (!isEnabled || ambienceRef.current) return;

    // Only fetch ambience once
    if (!ambienceLoaded.current) {
      const blob = await fetchSound(ambiencePrompt, 10);
      if (blob) {
        const audio = await playBlob(blob, true);
        if (audio) {
          audio.volume = volume * 0.3; // Lower volume for background
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
      
      // Fade out over 1 second
      const fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          clearInterval(fadeInterval);
          audio.pause();
          audio.volume = volume * 0.3; // Reset for next time
        }
      }, 100);
    }
  }, [volume]);

  // Play sound for a cooking action
  const playActionSound = useCallback(async (action: string) => {
    if (!isEnabled) return;

    const prompt = getSoundPrompt(action);
    const blob = await fetchSound(prompt, 3);
    if (blob) {
      await playBlob(blob);
    }
  }, [isEnabled, fetchSound, playBlob]);

  // Play serve sound
  const playServeSound = useCallback(async () => {
    if (!isEnabled) return;

    const blob = await fetchSound(uiSounds.serve, 2);
    if (blob) {
      await playBlob(blob);
    }
  }, [isEnabled, fetchSound, playBlob]);

  // Play success sound
  const playSuccessSound = useCallback(async () => {
    if (!isEnabled) return;

    const blob = await fetchSound(uiSounds.success, 2);
    if (blob) {
      await playBlob(blob);
    }
  }, [isEnabled, fetchSound, playBlob]);

  // Play error sound
  const playErrorSound = useCallback(async () => {
    if (!isEnabled) return;

    const blob = await fetchSound(uiSounds.error, 2);
    if (blob) {
      await playBlob(blob);
    }
  }, [isEnabled, fetchSound, playBlob]);

  // Toggle sounds on/off
  const toggleSounds = useCallback(() => {
    setIsEnabled(prev => {
      if (prev && ambienceRef.current) {
        ambienceRef.current.pause();
      }
      return !prev;
    });
  }, []);

  // Update volume
  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (ambienceRef.current) {
      ambienceRef.current.volume = newVolume * 0.3;
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
    playServeSound,
    playSuccessSound,
    playErrorSound,
  };
}
