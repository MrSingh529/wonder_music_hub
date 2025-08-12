'use client';

import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { usePlayer } from '@/lib/player-context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { GradientCover } from '../GradientCover';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    play,
    pause,
    playPrev,
    playNext,
    progress,
    seek,
    duration,
  } = usePlayer();

  if (!currentTrack) {
    return null;
  }
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-24 p-4">
      <div className="relative container mx-auto flex h-full items-center gap-4 glass-card rounded-xl">
        <div className="flex items-center gap-4 flex-1 min-w-0 pl-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md shadow-md">
            {currentTrack.coverUrl ? (
              <Image
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                width={64}
                height={64}
                className="object-cover"
                data-ai-hint="music album cover"
              />
            ) : (
              <GradientCover title={currentTrack.title} />
            )}
          </div>
          <div className="min-w-0">
            <Link href="/" className="hover:underline font-headline font-semibold">
                <p className="truncate">{currentTrack.title}</p>
            </Link>
            <p className="truncate text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center gap-2 w-full max-w-md">
            <Button variant="ghost" size="icon" onClick={playPrev} aria-label="Previous track">
                <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-primary/20 hover:bg-primary/30" onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause className="h-6 w-6 text-primary" /> : <Play className="h-6 w-6 text-primary" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext} aria-label="Next track">
                <SkipForward className="h-5 w-5" />
            </Button>
        </div>

        <div className="flex-1 items-center gap-2 hidden lg:flex pr-4">
            <span className="text-xs text-muted-foreground w-12 text-right">{formatTime(progress / 100 * duration)}</span>
            <Slider
                value={[progress]}
                onValueChange={handleSeek}
                className="w-full"
                aria-label="Track progress"
            />
            <span className="text-xs text-muted-foreground w-12">{formatTime(duration)}</span>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2 pr-4">
           <Button variant="ghost" size="icon" onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
