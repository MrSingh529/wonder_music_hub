
'use client';

import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  Mic2,
} from 'lucide-react';
import { usePlayer } from '@/lib/player-context';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { GradientCover } from '../GradientCover';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Player() {
  const {
    playlist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isShuffle,
    isRepeat,
    progress,
    volume,
    isMuted,
    duration,
    play,
    pause,
    playNext,
    playPrev,
    toggleShuffle,
    toggleRepeat,
    seek,
    setVolume,
    toggleMute,
  } = usePlayer();

  const handlePlayPause = (index?: number) => {
    if (index !== undefined && index !== currentTrackIndex) {
      play(index);
    } else if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      <Card className="lg:col-span-2 rounded-2xl overflow-hidden border-0 glass-card">
        <div className="relative h-64 md:h-[32rem] w-full">
          {currentTrack ? (
            currentTrack.coverUrl ? (
              <Image
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                fill
                className="object-cover"
                data-ai-hint="music album cover"
                priority
              />
            ) : (
              <GradientCover title={currentTrack.title} />
            )
          ) : (
            <div className="bg-muted/50 w-full h-full flex items-center justify-center">
              <ListMusic className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
            <h2 className="text-3xl md:text-5xl font-bold font-headline drop-shadow-lg">{currentTrack?.title ?? 'Harmony Hub'}</h2>
            <p className="text-lg md:text-xl text-white/80 drop-shadow-md">{currentTrack?.artist ?? 'Select a track to play'}</p>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            className="w-full"
            aria-label="Track progress"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{formatTime(progress / 100 * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleShuffle} className={cn(isShuffle && 'text-primary')} aria-label="Toggle shuffle">
              <Shuffle />
            </Button>
            <Button variant="ghost" size="icon" onClick={playPrev} disabled={currentTrackIndex === null} aria-label="Previous track">
              <SkipBack />
            </Button>
            <Button variant="default" size="icon" className="w-16 h-16 rounded-full shadow-lg" onClick={() => handlePlayPause()} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext} disabled={currentTrackIndex === null} aria-label="Next track">
              <SkipForward />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleRepeat} className={cn(isRepeat && 'text-primary')} aria-label="Toggle repeat">
              <Repeat />
            </Button>
          </div>
          <div className="flex items-center gap-2 max-w-xs mx-auto">
            <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}>
              {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
              aria-label="Volume control"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col">
        <Tabs defaultValue="playlist" className="w-full flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="playlist">Playlist</TabsTrigger>
            <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
          </TabsList>
          <TabsContent value="playlist" className="flex-grow">
              <Card className="rounded-2xl shadow-lg border-0 h-full glass-card flex flex-col">
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">Playlist</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow h-0">
                      <ScrollArea className="h-full">
                          <div className="space-y-1 pr-4">
                              {playlist.map((track, index) => (
                              <div
                                  key={track.id}
                                  className={cn(
                                      'flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors',
                                      currentTrackIndex === index ? 'bg-primary/20' : 'hover:bg-accent/50'
                                  )}
                                  onClick={() => handlePlayPause(index)}
                              >
                                  <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                                  {track.coverUrl ? (
                                      <Image
                                      src={track.coverUrl}
                                      alt={track.title}
                                      width={48}
                                      height={48}
                                      className="object-cover"
                                      data-ai-hint="music album cover"
                                      />
                                  ) : (
                                      <GradientCover title={track.title} />
                                  )}
                                  </div>
                                  <div className="flex-grow overflow-hidden">
                                      <p className={cn("font-semibold truncate", currentTrackIndex === index && 'text-primary')}>{track.title}</p>
                                      <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                                  </div>
                                  {currentTrackIndex === index && isPlaying && <Play className="w-5 h-5 text-primary shrink-0" />}
                                  {currentTrackIndex === index && !isPlaying && <Pause className="w-5 h-5 text-muted-foreground shrink-0" />}
                              </div>
                              ))}
                          </div>
                      </ScrollArea>
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="lyrics" className="flex-grow">
              <Card className="rounded-2xl shadow-lg border-0 h-full glass-card flex flex-col">
                   <CardHeader>
                      <CardTitle className="font-headline text-2xl">Lyrics</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow h-0">
                      <ScrollArea className="h-full">
                          {currentTrack?.lyrics ? (
                               <p className="text-muted-foreground whitespace-pre-line leading-relaxed pr-4">
                                  {currentTrack.lyrics}
                              </p>
                          ) : (
                              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground pr-4">
                                  <Mic2 className="w-12 h-12 mb-4" />
                                  <p>No lyrics available for this track.</p>
                              </div>
                          )}
                      </ScrollArea>
                  </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
