
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
    
    // Basic format validation
    if (!cleanKey || cleanKey.length < 10) {
      console.error('License key too short or empty');
      return { isValid: false };
    }
    
    let decodedString;
    try {
      decodedString = atob(cleanKey.toLowerCase());
    } catch (e) {
      console.error('Failed to decode license key:', e);
      return { isValid: false };
    }
    
    // Parse the components
    const parts = decodedString.split(":");
    if (parts.length !== 3) {
      console.error('License key has invalid format');
      return { isValid: false };
    }
    
    const [organizationId, expiryTimestamp, totalDocumentsStr] = parts;
    
    // Validate that we have all required parts
    if (!organizationId || !expiryTimestamp || !totalDocumentsStr) {
      console.error('License key missing required components');
      return { isValid: false };
    }
    
    // Parse the expiry timestamp
    const expiryTimestampNum = parseInt(expiryTimestamp);
    if (isNaN(expiryTimestampNum)) {
      console.error('Invalid expiry timestamp in license key');
      return { isValid: false };
    }
    
    const expiryDate = new Date(expiryTimestampNum);
    if (expiryDate.toString() === "Invalid Date") {
      console.error('Invalid date format in license key');
      return { isValid: false };
    }
    
    // Parse the document limit
    const totalDocuments = parseInt(totalDocumentsStr);
    if (isNaN(totalDocuments)) {
      console.error('Invalid document limit in license key');
      return { isValid: false };
    }
    
    // For testing purposes, let's be more lenient with expiration
    // In a real application, you'd want strict validation
    const now = new Date();
    if (expiryDate < now) {
      console.error('License key has expired');
      return { 
        isValid: false,
        organizationId,
        expiryDate,
        totalDocuments
      };
    }
    
    // If we made it here, the license key is valid
    console.log('License key validated successfully:', {
      organizationId,
      expiryDate: expiryDate.toISOString(),
      totalDocuments
    });
    
    return {
      isValid: true,
      organizationId,
      expiryDate,
      totalDocuments
    };
  } catch (error) {
    console.error('Error validating license key:', error);
    return { isValid: false };
  }
};
