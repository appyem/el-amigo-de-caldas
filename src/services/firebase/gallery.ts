import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface GalleryItem {
  id?: string;
  title: string;
  category: string;
  imageUrl: string;
  status: 'published' | 'draft';
  createdAt?: Timestamp;
}

const galleryCollection = collection(db, 'galeria');

export async function getGallery() {
  const q = query(galleryCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
}

export async function getPublishedGallery() {
  const q = query(galleryCollection, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
}

export async function createGallery(data: Omit<GalleryItem, 'id' | 'createdAt'>) {
  const docRef = await addDoc(galleryCollection, { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateGallery(id: string, data: Partial<GalleryItem>) {
  const docRef = doc(db, 'galeria', id);
  await updateDoc(docRef, data);
}

export async function deleteGallery(id: string) {
  const docRef = doc(db, 'galeria', id);
  await deleteDoc(docRef);
}
