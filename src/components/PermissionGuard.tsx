
import React, { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
  requiresLicense?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null,
  requiresLicense = false
}) => {
  const { hasPermission } = useUser();
  
  // Check license if required
  if (requiresLicense) {
    const checkLicense = () => {
      // @ts-ignore - This function is registered globally by LicenseManager
      if (window.checkLicenseForSigning && typeof window.checkLicenseForSigning === 'function') {
        // @ts-ignore
        return window.checkLicenseForSigning();
      }
      return true; // Default to true if function not available (during development)
    };
    
    if (!checkLicense()) {
      return <>{fallback}</>;
    }
  }
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionGuard;
