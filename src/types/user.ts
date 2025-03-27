
export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface License {
  key: string;
  expiryDate: string;
  totalDocuments: number;
  usedDocuments: number;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
}

export interface OrganizationLicense {
  licenseKey: string;
  issuedDate: string;
  expiryDate: string;
  totalDocuments: number;
  usedDocuments: number;
  isActive: boolean;
  features: string[];
}

export const defaultPermissions: Record<string, Permission> = {
  'sign_documents': {
    id: 'sign_documents',
    name: 'Sign Documents',
    description: 'Can sign documents using available certificates'
  },
  'manage_certificates': {
    id: 'manage_certificates',
    name: 'Manage Certificates',
    description: 'Can upload, view and manage certificates'
  },
  'view_audit': {
    id: 'view_audit',
    name: 'View Audit Logs',
    description: 'Can view audit logs of document signing activities'
  },
  'manage_users': {
    id: 'manage_users',
    name: 'Manage Users',
    description: 'Can add, edit and manage system users'
  },
  'manage_settings': {
    id: 'manage_settings',
    name: 'Manage Settings',
    description: 'Can change system settings'
  }
};

export const rolePermissions: Record<UserRole, string[]> = {
  'admin': ['sign_documents', 'manage_certificates', 'view_audit', 'manage_users', 'manage_settings'],
  'manager': ['sign_documents', 'manage_certificates', 'view_audit', 'manage_users'],
  'user': ['sign_documents', 'view_audit'],
  'viewer': ['view_audit']
};

// License key generation and validation functions
export const generateLicenseKey = (
  organizationId: string, 
  expiryDate: Date, 
  totalDocuments: number
): string => {
  // Encode organization ID, expiry date, and document limit into the license key
  const expiryTimestamp = expiryDate.getTime();
  const baseString = `${organizationId}:${expiryTimestamp}:${totalDocuments}`;
  
  // In a real implementation, this would use proper encryption or signing
  // For demonstration, we'll use a simple encoding scheme
  const encodedString = btoa(baseString);
  
  // Format the key to be more readable (groups of 5 characters separated by dashes)
  const formattedKey = encodedString.replace(/(.{5})/g, "$1-").slice(0, -1);
  
  return formattedKey.toUpperCase();
};

export const validateLicenseKey = (licenseKey: string): {
  isValid: boolean;
  organizationId?: string;
  expiryDate?: Date;
  totalDocuments?: number;
} => {
  try {
    // Clean and decode the license key
    const cleanKey = licenseKey.replace(/-/g, "");
    const decodedString = atob(cleanKey.toLowerCase());
    
    // Parse the components
    const [organizationId, expiryTimestamp, totalDocumentsStr] = decodedString.split(":");
    const expiryDate = new Date(parseInt(expiryTimestamp));
    const totalDocuments = parseInt(totalDocumentsStr);
    
    // Validate expiry date
    const now = new Date();
    if (expiryDate < now) {
      return { isValid: false };
    }
    
    return {
      isValid: true,
      organizationId,
      expiryDate,
      totalDocuments
    };
  } catch (error) {
    return { isValid: false };
  }
};
