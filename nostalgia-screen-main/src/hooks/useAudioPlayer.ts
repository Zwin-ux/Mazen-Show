import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';

// Define return type for better TypeScript support
interface AudioPlayerState {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  togglePlay: () => void;
  seek: (position: number) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
}

export const useAudioPlayer = (url?: string): AudioPlayerState => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1.0); // Default volume at 100%
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Update progress using requestAnimationFrame for smoother updates
  const updateProgress = useCallback(() => {
    if (soundRef.current && isPlaying) {
      const seek = soundRef.current.seek() as number;
      const totalDuration = soundRef.current.duration();
      setCurrentTime(seek);
      setProgress(totalDuration > 0 ? seek / totalDuration : 0);
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [isPlaying]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setIsLoading(false);
  }, []);

  // Initialize audio
  useEffect(() => {
    if (!url) {
      cleanup();
      return;
    }

    setIsLoading(true);
    setError(null);

    soundRef.current = new Howl({
      src: [url],
      html5: true, // Better for streaming/large files
      preload: true,
      volume: volume,
      onload: () => {
        setIsLoading(false);
        setDuration(soundRef.current?.duration() || 0);
      },
      onloaderror: (_, err) => {
        setError(`Failed to load audio: ${err}`);
        setIsLoading(false);
      },
      onplayerror: (_, err) => {
        setError(`Playback error: ${err}`);
        setIsPlaying(false);
      },
      onplay: () => {
        setIsPlaying(true);
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      },
      onpause: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setProgress(1);
        setCurrentTime(soundRef.current?.duration() || 0);
      },
      onseek: () => updateProgress(),
    });

    return cleanup;
  }, [url, cleanup, updateProgress]);

  // Volume control
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (soundRef.current) {
      soundRef.current.volume(clampedVolume);
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!soundRef.current || isLoading) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  }, [isPlaying, isLoading]);

  // Seek to position (0-1 range)
  const seek = useCallback((position: number) => {
    if (!soundRef.current) return;

    const clampedPosition = Math.max(0, Math.min(1, position));
    const newTime = clampedPosition * soundRef.current.duration();
    soundRef.current.seek(newTime);
    setCurrentTime(newTime);
    setProgress(clampedPosition);
  }, []);

  // Stop playback
  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      Howler.stop(); // Ensure all audio is stopped
    };
  }, [cleanup]);

  return {
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isLoading,
    error,
    togglePlay,
    seek,
    setVolume,
    stop,
  };
};