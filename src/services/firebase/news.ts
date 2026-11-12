import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where,
  orderBy, 
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

export interface News {
  id?: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  date: Timestamp | Date;
  status: 'published' | 'draft';
  createdAt?: Timestamp;
}

const newsCollection = collection(db, 'noticias');

// Para el panel admin (todas las noticias)
export async function getNews() {
  const q = query(newsCollection, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
}

// Para la página pública (solo publicadas)
export async function getPublishedNews() {
  const q = query(
    newsCollection, 
    where('status', '==', 'published'), 
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
}

// Para ver el detalle de una noticia
export async function getNewsById(id: string) {
  const docRef = doc(db, 'noticias', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as News;
  }
  return null;
}

export async function createNews(data: Omit<News, 'id' | 'createdAt'>) {
  const docRef = await addDoc(newsCollection, {
    ...data,
    createdAt: Timestamp.now()
  });
  return docRef.id;
}

export async function updateNews(id: string, data: Partial<News>) {
  const docRef = doc(db, 'noticias', id);
  await updateDoc(docRef, data);
}

export async function deleteNews(id: string) {
  const docRef = doc(db, 'noticias', id);
  await deleteDoc(docRef);
}
