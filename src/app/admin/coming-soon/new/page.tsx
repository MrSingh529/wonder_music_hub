
import { UpcomingForm } from '../_components/upcoming-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NewUpcomingPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">New Upcoming Release</h1>
                <p className="text-muted-foreground">
                    Fill out the form to announce a new release.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Release Details</CardTitle>
                    <CardDescription>
                        The cover file can be uploaded here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UpcomingForm />
                </CardContent>
            </Card>
        </div>
    );
}
