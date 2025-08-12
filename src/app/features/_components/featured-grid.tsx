'use client';

import type { ClientTrack } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GradientCover } from '@/components/GradientCover';
import { usePlayer } from '@/lib/player-context';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';

export function FeaturedGrid({ tracks }: { tracks: ClientTrack[] }) {
    const { playTrackById } = usePlayer();
    const router = useRouter();

    const handlePlay = (trackId: string) => {
        playTrackById(trackId);
        router.push('/');
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {tracks.map(track => (
                <Card key={track.id} className="overflow-hidden border-0 transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1 glass-card">
                    <CardHeader className="p-0">
                        <div className="aspect-square relative group">
                            {track.coverUrl ? (
                                <Image
                                    src={track.coverUrl}
                                    alt={track.title}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="music album cover"
                                />
                            ) : (
                                <GradientCover title={track.title} />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button size="icon" className="h-14 w-14 rounded-full" onClick={() => handlePlay(track.id)}>
                                    <Play className="h-7 w-7" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg truncate font-headline">{track.title}</h3>
                        <p className="text-muted-foreground text-sm">{track.artist}</p>
                        {track.blurb && <p className="text-sm mt-2 text-foreground/80 line-clamp-2">{track.blurb}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
