import { TrackForm } from '../_components/track-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NewTrackPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Create New Track</h1>
                <p className="text-muted-foreground">
                    Fill out the form to add a new track to the catalog.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Track Details</CardTitle>
                    <CardDescription>
                        Audio and cover files can be uploaded here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TrackForm />
                </CardContent>
            </Card>
        </div>
    );
}
