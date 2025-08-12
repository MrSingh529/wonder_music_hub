
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { adminDb } from '@/lib/firebase/server';
import type { Upcoming } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UpcomingDataTable } from './_components/upcoming-data-table';
import { columns } from './_components/columns';
import { PlusCircle } from 'lucide-react';

export const revalidate = 0;

async function getUpcomingReleases(): Promise<Upcoming[]> {
    const upcomingRef = collection(adminDb(), 'upcoming');
    const q = query(upcomingRef, orderBy('releaseDate', 'asc'));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    
    const upcoming = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Upcoming[];

    return JSON.parse(JSON.stringify(upcoming));
}

export default async function ManageUpcomingPage() {
    const upcomingReleases = await getUpcomingReleases();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Manage Upcoming</h1>
                    <p className="text-muted-foreground">
                        A list of all your upcoming releases.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/coming-soon/new">
                        <PlusCircle />
                        New Release
                    </Link>
                </Button>
            </div>
            
            <UpcomingDataTable data={upcomingReleases} columns={columns} />
        </div>
    );
}
