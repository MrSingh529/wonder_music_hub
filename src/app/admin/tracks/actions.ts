
"use server";

import { revalidatePath } from 'next/cache';
import { adminDb, adminStorage } from '@/lib/firebase/server';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { z } from 'zod';

const TrackSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  releaseDate: z.string(),
  order: z.coerce.number(),
  published: z.enum(['true', 'false']).transform(val => val === 'true'),
  featured: z.enum(['true', 'false']).transform(val => val === 'true'),
  blurb: z.string().optional(),
});

const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(adminStorage(), path);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await uploadBytes(storageRef, fileBuffer, {
        contentType: file.type
    });
    return await getDownloadURL(storageRef);
};

export async function createTrack(formData: FormData) {
    const db = adminDb();
    if (!db) throw new Error("Firebase Admin not initialized.");

    const parsed = TrackSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        throw new Error(parsed.error.errors.map(e => e.message).join(', '));
    }
    
    const data = parsed.data;
    const audioFile = formData.get('audioUrl') as File | null;
    const coverFile = formData.get('coverUrl') as File | null;

    if (!audioFile) throw new Error('Audio file is required.');
    
    const docRef = await addDoc(collection(db, 'tracks'), {
        ...data,
        releaseDate: Timestamp.fromDate(new Date(data.releaseDate)),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        audioUrl: '',
        coverUrl: '',
    });

    const trackId = docRef.id;
    let audioUrl = '';
    let coverUrl = '';

    try {
        audioUrl = await uploadFile(audioFile, `audio/${trackId}`);
        if (coverFile) {
            coverUrl = await uploadFile(coverFile, `covers/${trackId}`);
        }

        await updateDoc(docRef, { audioUrl, coverUrl, updatedAt: serverTimestamp() });

        revalidatePath('/admin/tracks');
        revalidatePath('/');
        revalidatePath('/features');
    } catch (error) {
        // Rollback Firestore doc creation on upload error
        await deleteDoc(docRef);
        throw error;
    }
}

export async function updateTrack(id: string, formData: FormData) {
    const db = adminDb();
    if (!db) throw new Error("Firebase Admin not initialized.");

    const parsed = TrackSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        throw new Error(parsed.error.errors.map(e => e.message).join(', '));
    }

    const data = parsed.data;
    const audioFile = formData.get('audioUrl') as File | null;
    const coverFile = formData.get('coverUrl') as File | null;

    const docRef = doc(db, 'tracks', id);
    const updateData: any = {
        ...data,
        releaseDate: Timestamp.fromDate(new Date(data.releaseDate)),
        updatedAt: serverTimestamp(),
    };

    if (audioFile) {
        updateData.audioUrl = await uploadFile(audioFile, `audio/${id}`);
    }
    if (coverFile) {
        updateData.coverUrl = await uploadFile(coverFile, `covers/${id}`);
    }

    await updateDoc(docRef, updateData);

    revalidatePath('/admin/tracks');
    revalidatePath(`/admin/tracks/${id}/edit`);
    revalidatePath('/');
    revalidatePath('/features');
}

export async function deleteTrack(id: string) {
    const db = adminDb();
    if (!db) throw new Error("Firebase Admin not initialized.");

    const docRef = doc(db, 'tracks', id);
    await deleteDoc(docRef);

    // Delete associated files from storage
    const storage = adminStorage();
    const audioRef = ref(storage, `audio/${id}`);
    const coverRef = ref(storage, `covers/${id}`);
    
    try {
        await deleteObject(audioRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') console.error("Failed to delete audio file:", error);
    }
    try {
        await deleteObject(coverRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') console.error("Failed to delete cover file:", error);
    }

    revalidatePath('/admin/tracks');
    revalidatePath('/');
    revalidatePath('/features');
}

export async function updateTrackStatus(id: string, field: 'published' | 'featured', value: boolean) {
    const db = adminDb();
    if (!db) throw new Error("Firebase Admin not initialized.");

    const docRef = doc(db, 'tracks', id);
    await updateDoc(docRef, {
        [field]: value,
        updatedAt: serverTimestamp(),
    });
    revalidatePath('/admin/tracks');
    revalidatePath('/');
    revalidatePath('/features');
}
