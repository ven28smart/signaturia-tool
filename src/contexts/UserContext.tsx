
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, rolePermissions } from '@/types/user';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  loginUser: (username: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  updateCurrentUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  hasPermission: (permission: string) => boolean;
  resetUserPassword: (userId: string) => Promise<boolean>;
  generatePasswordResetLink: (userId: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  users: [],
  loginUser: async () => false,
  logoutUser: () => {},
  addUser: () => {},
  updateUser: () => {},
  updateCurrentUser: () => {},
  deleteUser: () => {},
  hasPermission: () => false,
  resetUserPassword: async () => false,
  generatePasswordResetLink: async () => false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialUsers: User[] = [
    {
      id: '1',
      name: 'Administrator',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      permissions: rolePermissions.admin,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
    },
    {
      id: '2',
      name: 'Manager User',
      username: 'manager',
      email: 'manager@example.com',
      role: 'manager',
      permissions: rolePermissions.manager,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
    },
    {
      id: '3',
      name: 'Regular User',
      username: 'user',
      email: 'user@example.com',
      role: 'user',
      permissions: rolePermissions.user,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
    }
  ];
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  
  useEffect(() => {
    // Load saved user on startup
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        console.log("Loaded user from localStorage", JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('currentUser');
      }
    }
    
    // Load saved users list
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error("Failed to parse saved users", e);
        localStorage.setItem('users', JSON.stringify(initialUsers));
      }
    } else {
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);
  
  const loginUser = async (username: string, password: string): Promise<boolean> => {
    console.log("Attempting login for:", username);
    
    // Admin login
    if (username === 'admin' && password === 'admin') {
      const adminUser = users.find(u => u.username === 'admin');
      if (adminUser) {
        const updatedUser = {
          ...adminUser,
          lastLogin: new Date().toISOString()
        };
        
        console.log("Admin login successful, setting current user", updatedUser);
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update the user in the users list
        updateUser(updatedUser);
        
        return true;
      }
    }
    
    // Regular user login
    const user = users.find(u => u.username === username);
    
    if (user && password === 'password') {
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      
      console.log("User login successful, setting current user", updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update the user in the users list
      updateUser(updatedUser);
      
      return true;
    }
    
    console.log("Login failed for:", username);
    return false;
  };
  
  const logoutUser = () => {
    console.log("Logging out user");
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  const addUser = (user: User) => {
    const newUsers = [...users, user];
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };
  
  const updateUser = (updatedUser: User) => {
    const newUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };
  
  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    updateUser(updatedUser);
  };
  
  const deleteUser = (userId: string) => {
    const newUsers = users.filter(user => user.id !== userId);
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };
  
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };
  
  const resetUserPassword = async (userId: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 1000);
    });
  };
  
  const generatePasswordResetLink = async (userId: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 1000);
    });
  };
  
  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        loginUser,
        logoutUser,
        addUser,
        updateUser,
        updateCurrentUser,
        deleteUser,
        hasPermission,
        resetUserPassword,
        generatePasswordResetLink
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
