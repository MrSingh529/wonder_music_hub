import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/server';
import type { Track } from '@/lib/types';
import { TrackForm } from '../../_components/track-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

async function getTrack(id: string): Promise<Track | null> {
    const docRef = doc(adminDb(), 'tracks', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    const data = { id: docSnap.id, ...docSnap.data() } as Track;
    return JSON.parse(JSON.stringify(data));
}

export default async function EditTrackPage({ params }: { params: { id: string } }) {
    const track = await getTrack(params.id);

    if (!track) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Edit Track</h1>
                <p className="text-muted-foreground">
                    Editing track: <span className="font-semibold">{track.title}</span>
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Track Details</CardTitle>
                    <CardDescription>
                        Update track information and replace files if needed.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TrackForm track={track} />
                </CardContent>
            </Card>
        </div>
    );
}
