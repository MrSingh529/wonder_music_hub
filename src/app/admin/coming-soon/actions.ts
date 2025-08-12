
"use server";

import { revalidatePath } from 'next/cache';
import { adminDb, adminStorage } from '@/lib/firebase/server';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage, uploadBytes, deleteObject } from 'firebase/storage';
import { z } from 'zod';

const UpcomingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  releaseDate: z.string().transform((str) => new Date(str)),
  teaserUrl: z.string().url().optional().or(z.literal('')),
});

const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(adminStorage(), path);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await uploadBytes(storageRef, fileBuffer, {
        contentType: file.type
    });
    return getDownloadURL(storageRef);
};

export async function createUpcoming(formData: FormData) {
    const db = adminDb();
    if (!db) throw new Error("Firebase Admin not initialized.");

    const parsed = UpcomingSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        throw new Error(parsed.error.errors.map(e => e.message).join(', '));
    }
    
    const data = parsed.data;
    const coverFile = formData.get('coverUrl') as File | null;
    
    const docRef = await addDoc(collection(db, 'upcoming'), {
        ...data,
        releaseDate: Timestamp.fromDate(data.releaseDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        coverUrl: '',
    });

    const upcomingId = docRef.id;
    let coverUrl = '';

    try {
        if (coverFile) {
            coverUrl = await uploadFile(coverFile, `upcoming_covers/${upcomingId}`);
        }

        await updateDoc(docRef, { coverUrl, updatedAt: serverTimestamp() });

        revalidatePath('/admin/coming-soon');
        revalidatePath('/coming-soon');
    } catch (error) {
        await deleteDoc(docRef);
        throw error;
    }
}

export async function updateUpcoming(id: string, formData: FormData) {
    const db = adminDb();
    if (!db) throw new Error("Firebase Admin not initialized.");

    const parsed = UpcomingSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        throw new Error(parsed.error.errors.map(e => e.message).join(', '));
    }

    const data = parsed.data;
    const coverFile = formData.get('coverUrl') as File | null;

    const docRef = doc(db, 'upcoming', id);
    const updateData: any = {
        ...data,
        releaseDate: Timestamp.fromDate(data.releaseDate),
        updatedAt: serverTimestamp(),
    };

    if (coverFile) {
        updateData.coverUrl = await uploadFile(coverFile, `upcoming_covers/${id}`);
    }

    await updateDoc(docRef, updateData);

    revalidatePath('/admin/coming-soon');
    revalidatePath(`/admin/coming-soon/${id}/edit`);
    revalidatePath('/coming-soon');
}

export async function deleteUpcoming(id: string) {
    const db = adminDb();
    if (!db) throw new Error("Firebase Admin not initialized.");

    const docRef = doc(db, 'upcoming', id);
    await deleteDoc(docRef);

    const storage = adminStorage();
    const coverRef = ref(storage, `upcoming_covers/${id}`);
    
    try {
        await deleteObject(coverRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') console.error("Failed to delete cover file:", error);
    }

    revalidatePath('/admin/coming-soon');
    revalidatePath('/coming-soon');
}
