import { adminDb } from '@/lib/firebase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, ListMusic, Star, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getStats() {
    const db = adminDb();
    const tracksSnapshot = await db.collection('tracks').get();
    const upcomingSnapshot = await db.collection('upcoming').get();
    
    const published = tracksSnapshot.docs.filter(doc => doc.data().published).length;
    const drafts = tracksSnapshot.size - published;
    const featured = tracksSnapshot.docs.filter(doc => doc.data().featured).length;

    return {
        published,
        drafts,
        featured,
        upcoming: upcomingSnapshot.size,
    };
}


export default async function AdminDashboard() {
  const stats = await getStats().catch(e => {
      console.error("Failed to get stats:", e);
      return { published: 0, drafts: 0, featured: 0, upcoming: 0 };
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your music catalog.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild><Link href="/admin/tracks/new">New Track</Link></Button>
            <Button asChild variant="secondary"><Link href="/admin/coming-soon/new">New Upcoming</Link></Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <ListMusic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Tracks</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Releases</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
