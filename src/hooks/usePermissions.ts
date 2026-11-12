import { useEffect, useState } from 'react';
import { getUserClaims, UserClaims, hasRole, hasPermission } from '@/services/firebase/roles';

export function usePermissions() {
  const [claims, setClaims] = useState<UserClaims | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClaims = async () => {
      const userClaims = await getUserClaims();
      setClaims(userClaims);
      setLoading(false);
    };

    loadClaims();
  }, []);

  const checkRole = (requiredRole: UserClaims['role']) => {
    if (!claims) return false;
    return hasRole(requiredRole, claims.role);
  };

  const checkPermission = (permission: string) => {
    if (!claims) return false;
    return hasPermission(claims.permissions, permission);
  };

  return {
    role: claims?.role || 'viewer',
    permissions: claims?.permissions || {},
    loading,
    checkRole,
    checkPermission,
  };
}
