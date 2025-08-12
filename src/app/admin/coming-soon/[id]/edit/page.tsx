
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/server';
import type { Upcoming } from '@/lib/types';
import { UpcomingForm } from '../../_components/upcoming-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

async function getUpcoming(id: string): Promise<Upcoming | null> {
    const docRef = doc(adminDb(), 'upcoming', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    const data = { id: docSnap.id, ...docSnap.data() } as Upcoming;
    return JSON.parse(JSON.stringify(data));
}

export default async function EditUpcomingPage({ params }: { params: { id: string } }) {
    const upcoming = await getUpcoming(params.id);

    if (!upcoming) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Edit Upcoming Release</h1>
                <p className="text-muted-foreground">
                    Editing release: <span className="font-semibold">{upcoming.title}</span>
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Release Details</CardTitle>
                    <CardDescription>
                        Update release information and replace the cover file if needed.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UpcomingForm upcoming={upcoming} />
                </CardContent>
            </Card>
        </div>
    );
}
