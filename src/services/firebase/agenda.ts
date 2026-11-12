import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  getDocs, getDoc, query, where, orderBy, Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface AgendaEvent {
  id?: string;
  title: string;
  description: string;
  location: string;
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  imageUrl?: string;
  status: 'published' | 'draft';
  createdAt?: Timestamp;
}

const agendaCollection = collection(db, 'agenda');

export async function getAgenda() {
  const q = query(agendaCollection, orderBy('startDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AgendaEvent));
}

export async function getPublishedAgenda() {
  const q = query(
    agendaCollection, 
    where('status', '==', 'published'), 
    orderBy('startDate', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AgendaEvent));
}

export async function getAgendaById(id: string) {
  const docRef = doc(db, 'agenda', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as AgendaEvent;
  }
  return null;
}

export async function createAgenda(data: Omit<AgendaEvent, 'id' | 'createdAt'>) {
  const docRef = await addDoc(agendaCollection, {
    ...data,
    createdAt: Timestamp.now()
  });
  return docRef.id;
}

export async function updateAgenda(id: string, data: Partial<AgendaEvent>) {
  const docRef = doc(db, 'agenda', id);
  await updateDoc(docRef, data);
}

export async function deleteAgenda(id: string) {
  const docRef = doc(db, 'agenda', id);
  await deleteDoc(docRef);
}
