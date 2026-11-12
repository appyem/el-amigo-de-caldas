import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface MapProject {
  id?: string;
  title: string;
  description: string;
  municipality: string;
  category: 'Obra' | 'Proyecto Social' | 'Infraestructura' | 'Educación' | 'Salud';
  lat: number;
  lng: number;
  imageUrl?: string;
  status: 'published' | 'draft';
  createdAt?: Timestamp;
}

const mapCollection = collection(db, 'mapa');

export async function getMapProjects() {
  const q = query(mapCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MapProject));
}

// Filtramos en cliente para no depender de índices compuestos
export async function getPublishedMapProjects() {
  const all = await getMapProjects();
  return all.filter(p => p.status === 'published');
}

export async function createMapProject(data: Omit<MapProject, 'id' | 'createdAt'>) {
  const docRef = await addDoc(mapCollection, { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

export async function updateMapProject(id: string, data: Partial<MapProject>) {
  await updateDoc(doc(db, 'mapa', id), data);
}

export async function deleteMapProject(id: string) {
  await deleteDoc(doc(db, 'mapa', id));
}
