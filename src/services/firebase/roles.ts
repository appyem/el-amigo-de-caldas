import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface UserClaims {
  role: 'super_admin' | 'admin' | 'editor' | 'moderator' | 'viewer';
  permissions: Record<string, boolean>;
}

const db = getFirestore();

export async function getUserClaims(): Promise<UserClaims | null> {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) return null;

  try {
    // Leemos el rol directamente desde la colección 'users' en Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        role: (data.role as UserClaims['role']) || 'viewer',
        permissions: data.permissions || {},
      };
    }
    
    // Si no existe el documento, es un usuario nuevo (rol viewer por defecto)
    return { role: 'viewer', permissions: {} };
  } catch (error) {
    console.error('Error al obtener roles:', error);
    return { role: 'viewer', permissions: {} };
  }
}

export function hasRole(requiredRole: UserClaims['role'], userRole: UserClaims['role']): boolean {
  const roleHierarchy: Record<UserClaims['role'], number> = {
    viewer: 0,
    moderator: 1,
    editor: 2,
    admin: 3,
    super_admin: 4,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function hasPermission(permissions: Record<string, boolean>, permission: string): boolean {
  return permissions[permission] === true;
}
