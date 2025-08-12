
'use client';

import { usePathname } from 'next/navigation';
import { usePlayer } from '@/lib/player-context';
import { MiniPlayer } from './MiniPlayer';

export function PlayerWrapper() {
  const pathname = usePathname();
  const { audioRef, currentTrack } = usePlayer();
  
  const isPublicRoute = !pathname.startsWith('/admin') && pathname !== '/login';

  return (
    <>
      <audio ref={audioRef} src={currentTrack?.audioUrl} />
      {isPublicRoute && <MiniPlayer />}
    </>
  );
}
