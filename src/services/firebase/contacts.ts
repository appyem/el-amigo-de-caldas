import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface ContactRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  municipality: string;
  type: 'Contacto' | 'Petición' | 'Queja' | 'Sugerencia';
  message: string;
  status: 'pending' | 'read';
  createdAt?: Timestamp;
}

const contactsCollection = collection(db, 'solicitudes');

export async function getContacts() {
  const q = query(contactsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactRequest));
}

export async function createContact(data: Omit<ContactRequest, 'id' | 'createdAt' | 'status'>) {
  const docRef = await addDoc(contactsCollection, {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now()
  });
  return docRef.id;
}

export async function markAsRead(id: string) {
  const docRef = doc(db, 'solicitudes', id);
  await updateDoc(docRef, { status: 'read' });
}
