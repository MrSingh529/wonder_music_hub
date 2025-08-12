import { getUpcomingReleases } from '@/lib/data';
import type { ClientUpcoming } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { GradientCover } from '@/components/GradientCover';
import { Header } from '@/components/layout/Header';

async function getReleases(): Promise<ClientUpcoming[]> {
    const releases = await getUpcomingReleases();
    return releases;
}

export default async function ComingSoonPage() {
    const upcomingReleases = await getUpcomingReleases();

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 font-headline">Coming Soon</h1>
                {upcomingReleases.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">No upcoming releases announced. Stay tuned!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {upcomingReleases.map(item => (
                            <Card key={item.id} className="overflow-hidden border-0 transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1 glass-card">
                                <CardHeader className="p-0">
                                    <div className="aspect-square relative">
                                        {item.coverUrl ? (
                                            <Image
                                                src={item.coverUrl}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                data-ai-hint="music album cover"
                                            />
                                        ) : (
                                            <GradientCover title={item.title} />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg truncate font-headline">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.artist}</p>
                                    <p className="text-sm font-medium mt-2 text-primary">
                                        Releasing: {format(item.releaseDate, 'PPP')}
                                    </p>
                                </CardContent>
                                {item.teaserUrl && (
                                    <CardFooter className="p-4 pt-0">
                                        <Button asChild variant="secondary" className="w-full">
                                            <Link href={item.teaserUrl} target="_blank" rel="noopener noreferrer">Play Teaser</Link>
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
