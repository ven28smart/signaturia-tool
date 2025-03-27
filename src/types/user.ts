
export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export interface Permission {
  id: string;
  name: string;
  description: string;
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
