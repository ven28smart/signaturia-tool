
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole, rolePermissions } from '@/types/user';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  hasPermission: (permission: string) => boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default passwords (in a real app, these would be hashed)
const userPasswords: Record<string, string> = {
  'admin@example.com': 'admin123',
  'manager@example.com': 'password123',
  'user@example.com': 'password123',
  'viewer@example.com': 'password123',
};

// Mock admin user for development
const adminUser: User = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  permissions: rolePermissions['admin'],
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  status: 'active',
};

// Sample users for development
const sampleUsers: User[] = [
  adminUser,
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    permissions: rolePermissions['manager'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: '3',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    permissions: rolePermissions['user'],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: '4',
    email: 'viewer@example.com',
    name: 'Viewer User',
    role: 'viewer',
    permissions: rolePermissions['viewer'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('current_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [users, setUsers] = useState<User[]>(sampleUsers);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('current_user');
    }
  }, [currentUser]);

  const addUser = (user: User) => {
    setUsers([...users, user]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would verify against the backend
    // For now, we'll check against our local records
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return false;
    }
    
    if (userPasswords[email] !== password) {
      return false;
    }
    
    // Update last login time
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString()
    };
    
    updateUser(updatedUser);
    setCurrentUser(updatedUser);
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        setUsers,
        addUser,
        updateUser,
        deleteUser,
        hasPermission,
        loginUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
