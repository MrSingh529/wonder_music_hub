"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import type { Track } from '@/lib/types';
import { createTrack, updateTrack } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  releaseDate: z.date({ required_error: 'Release date is required.' }),
  order: z.coerce.number().int().min(0, 'Order must be a positive number'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  blurb: z.string().optional(),
  coverUrl: z.any().optional(), // File handling
  audioUrl: z.any().optional(), // File handling
});

type TrackFormValues = z.infer<typeof formSchema>;

interface TrackFormProps {
  track?: Track;
}

export function TrackForm({ track }: TrackFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const defaultValues: Partial<TrackFormValues> = track ? {
      ...track,
      releaseDate: track.releaseDate instanceof Timestamp ? track.releaseDate.toDate() : new Date(track.releaseDate),
    } : {
      title: '',
      artist: '',
      order: 0,
      published: false,
      featured: false,
      blurb: '',
    };
  
  const form = useForm<TrackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: TrackFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (key === 'coverUrl' || key === 'audioUrl') {
        if (value && value[0]) formData.append(key, value[0]);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    try {
      if (track) {
        await updateTrack(track.id, formData);
        toast({ title: 'Success', description: 'Track updated successfully.' });
      } else {
        await createTrack(formData);
        toast({ title: 'Success', description: 'Track created successfully.' });
      }
      router.push('/admin/tracks');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter track title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist</FormLabel>
                <FormControl>
                  <Input placeholder="Enter artist name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="blurb"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Blurb (Optional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="A short, catchy description for the track." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Release Date</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value ? (
                            format(field.value, "PPP")
                            ) : (
                            <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="Enter display order" {...field} />
                    </FormControl>
                    <FormDescription>Controls track order on the same release date.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="coverUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Cover Art</FormLabel>
                    <FormControl>
                    <Input type="file" accept="image/jpeg,image/png" {...form.register('coverUrl')} />
                    </FormControl>
                    <FormDescription>
                        {track?.coverUrl ? `Current file: ${track.coverUrl.split('/').pop()?.split('?')[0]}` : 'Upload a JPG or PNG file.'}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="audioUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Audio File</FormLabel>
                    <FormControl>
                    <Input type="file" accept="audio/mpeg,audio/wav" {...form.register('audioUrl')} />
                    </FormControl>
                     <FormDescription>
                        {track?.audioUrl ? `Current file: ${track.audioUrl.split('/').pop()?.split('?')[0]}` : 'Upload an MP3 or WAV file.'}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="flex items-center space-x-8">
            <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                    <FormLabel>Published</FormLabel>
                    <FormDescription>
                        Make this track visible on the public site.
                    </FormDescription>
                    </div>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                        Display this track on the featured page.
                    </FormDescription>
                    </div>
                </FormItem>
                )}
            />
        </div>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : track ? 'Update Track' : 'Create Track'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
