
import { getFeaturedTracks } from '@/lib/data';
import type { ClientTrack } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { FeaturedGrid } from './_components/featured-grid';

async function getTracks(): Promise<ClientTrack[]> {
    const tracks = await getFeaturedTracks();
    return tracks;
}


export default async function FeaturesPage() {
    const featuredTracks = await getTracks();

    return (
        <>
        <Header />
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 font-headline">Featured Tracks</h1>
            {featuredTracks.length === 0 ? (
                 <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No featured tracks at the moment. Check back soon!</p>
                </div>
            ) : (
                <FeaturedGrid tracks={featuredTracks} />
            )}
        </main>
        </>
    );
}
