
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import type { Upcoming } from '@/lib/types';
import { createUpcoming, updateUpcoming } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  teaserUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  coverUrl: z.any().optional(), // File handling
});

type UpcomingFormValues = z.infer<typeof formSchema>;

interface UpcomingFormProps {
  upcoming?: Upcoming;
}

export function UpcomingForm({ upcoming }: UpcomingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const defaultValues: Partial<UpcomingFormValues> = upcoming ? {
      ...upcoming,
      releaseDate: upcoming.releaseDate instanceof Timestamp ? upcoming.releaseDate.toDate() : new Date(upcoming.releaseDate),
    } : {
      title: '',
      artist: '',
      teaserUrl: '',
    };
  
  const form = useForm<UpcomingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: UpcomingFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (key === 'coverUrl') {
        if (value && value[0]) formData.append(key, value[0]);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    try {
      if (upcoming) {
        await updateUpcoming(upcoming.id, formData);
        toast({ title: 'Success', description: 'Upcoming release updated successfully.' });
      } else {
        await createUpcoming(formData);
        toast({ title: 'Success', description: 'Upcoming release created successfully.' });
      }
      router.push('/admin/coming-soon');
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
                  <Input placeholder="Enter release title" {...field} />
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
                name="teaserUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Teaser URL (Optional)</FormLabel>
                    <FormControl>
                    <Input type="url" placeholder="https://youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        
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
                    {upcoming?.coverUrl ? `Current file: ${upcoming.coverUrl.split('/').pop()?.split('?')[0]}` : 'Upload a JPG or PNG file.'}
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : upcoming ? 'Update Release' : 'Create Release'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
