import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface QuizQuestion {
  id?: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  category: 'Geografía' | 'Cultura' | 'Historia' | 'General';
  status: 'published' | 'draft';
  createdAt?: Timestamp;
}

const gamesCollection = collection(db, 'juegos');

export async function getQuizQuestions() {
  const q = query(gamesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizQuestion));
}

export async function getPublishedQuizQuestions() {
  const q = query(gamesCollection, orderBy('createdAt', 'desc')); // Obtenemos todas y filtramos en cliente para mezclar
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizQuestion)).filter(q => q.status === 'published');
}

export async function createQuizQuestion(data: Omit<QuizQuestion, 'id' | 'createdAt'>) {
  const docRef = await addDoc(gamesCollection, { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateQuizQuestion(id: string, data: Partial<QuizQuestion>) {
  const docRef = doc(db, 'juegos', id);
  await updateDoc(docRef, data);
}

export async function deleteQuizQuestion(id: string) {
  const docRef = doc(db, 'juegos', id);
  await deleteDoc(docRef);
}
