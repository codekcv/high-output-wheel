import { useEffect, useState } from 'react';

type PlayFunction = [(play: boolean) => void, boolean];

export const useAudio = (src: string): PlayFunction => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audio) {
      setAudio(new Audio(src));
    } else {
      const stop = (): void => setIsPlaying(false);
      audio.addEventListener('ended', stop);
      return () => audio.removeEventListener('ended', stop);
    }
  }, [audio, src]);

  useEffect(() => {
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio, isPlaying]);

  return [(play) => setIsPlaying(play), isPlaying];
};
