import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface Slider {
  id?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkText?: string;
  linkUrl?: string;
  order: number;
  focusPosition: 'top' | 'center' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  status: 'published' | 'draft';
  createdAt?: Timestamp;
}

const slidersCollection = collection(db, 'sliders');

export async function getSliders() {
  const q = query(slidersCollection, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Slider));
}

export async function getPublishedSliders() {
  const all = await getSliders();
  return all.filter(s => s.status === 'published');
}

export async function createSlider(data: Omit<Slider, 'id' | 'createdAt'>) {
  const docRef = await addDoc(slidersCollection, { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateSlider(id: string, data: Partial<Slider>) {
  await updateDoc(doc(db, 'sliders', id), data);
}

export async function deleteSlider(id: string) {
  await deleteDoc(doc(db, 'sliders', id));
}
