
import React from 'react';
import { useUser } from '@/contexts/UserContext';

interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const { hasPermission } = useUser();
  
  const hasAccess = hasPermission(permission);
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
