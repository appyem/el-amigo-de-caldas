import { Navigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { UserClaims } from '@/services/firebase/roles';
import { Loader } from '@/components/ui/Loader';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: UserClaims['role'];
  requiredPermission?: string;
}

export function RoleGuard({ children, requiredRole, requiredPermission }: RoleGuardProps) {
  const { loading, checkRole, checkPermission } = usePermissions();

  if (loading) {
    return <Loader variant="fullscreen" text="Verificando permisos..." />;
  }

  if (requiredRole && !checkRole(requiredRole)) {
    return <Navigate to="/admin" replace />;
  }

  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
