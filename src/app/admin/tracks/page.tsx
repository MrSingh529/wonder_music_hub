import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Track } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TracksDataTable } from './_components/tracks-data-table';
import { PlusCircle } from 'lucide-react';
import { adminDb } from '@/lib/firebase/server';

export const revalidate = 0;

async function getTracks(): Promise<Track[]> {
    const tracksRef = collection(adminDb(), 'tracks');
    const q = query(tracksRef, orderBy('order', 'asc'), orderBy('releaseDate', 'desc'));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    
    const tracks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Track[];

    return JSON.parse(JSON.stringify(tracks));
}


export default async function ManageTracksPage() {
    const tracks = await getTracks();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Manage Tracks</h1>
                    <p className="text-muted-foreground">
                        A list of all tracks in your catalog.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/tracks/new">
                        <PlusCircle />
                        New Track
                    </Link>
                </Button>
            </div>
            
            <TracksDataTable data={tracks} />
        </div>
    );
}
