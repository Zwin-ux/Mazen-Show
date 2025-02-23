import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

export const useAudioPlayer = (url?: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!url) return;

    soundRef.current = new Howl({
      src: [url],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
      onseek: () => updateProgress(),
    });

    const interval = setInterval(updateProgress, 1000);

    return () => {
      soundRef.current?.unload();
      clearInterval(interval);
    };
  }, [url]);

  const updateProgress = () => {
    if (soundRef.current) {
      const newProgress = soundRef.current.seek() / soundRef.current.duration();
      setProgress(newProgress);
      setCurrentTime(soundRef.current.seek());
    }
  };

  const togglePlay = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  };

  return { isPlaying, togglePlay, progress, currentTime };
};