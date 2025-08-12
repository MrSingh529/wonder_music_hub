
import { getPublishedTracks } from '@/lib/data';
import type { ClientTrack } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { HomePage } from '@/components/player/HomePage';

async function getTracks(): Promise<ClientTrack[]> {
  const tracks = await getPublishedTracks();
  return tracks;
}


export default async function Home() {
  const tracks = await getTracks();

  return (
    <>
      <Header />
      <main className="flex-1">
        <HomePage tracks={tracks} />
      </main>
    </>
  );
}
