'use client';

import { useEffect } from 'react';
import { usePlayer } from '@/lib/player-context';
import type { ClientTrack } from '@/lib/types';
import { Player } from './Player';

export function HomePage({ tracks }: { tracks: ClientTrack[] }) {
  const { setPlaylist, playlist } = usePlayer();

  useEffect(() => {
    // Only set the playlist if it's different from the one in context
    // This prevents re-shuffling when navigating back to the home page
    if (JSON.stringify(playlist) !== JSON.stringify(tracks)) {
      setPlaylist(tracks);
    }
  }, [tracks, setPlaylist, playlist]);

  return <Player />;
}
