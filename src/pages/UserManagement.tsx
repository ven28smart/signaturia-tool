
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { User, UserRole } from '@/types/user';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2, User as UserIcon, Plus, AlertTriangle, Key, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { toast } from 'sonner';
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils";

// User Management Component
const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, resetUserPassword, generatePasswordResetLink } = useUser();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Permission options
  const permissionOptions = [
    'documents.sign',
    'documents.view',
    'certificates.manage',
    'audit.view',
    'users.manage',
    'settings.edit',
  ];

  // Handle permission change
  const handlePermissionChange = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  // Handle role change with proper type handling
  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
  };

  // Handle create user
  const handleCreateUser = async () => {
    setIsSaving(true);
    
    // Basic validation
    if (!name || !username || !role) {
      toast.error('Name and username are required.');
      setIsSaving(false);
      return;
    }
    
    // Username format validation
    if (username.length < 3) {
      toast.error('Username must be at least 3 characters.');
      setIsSaving(false);
      return;
    }
    
    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      toast.error('Username already exists. Please choose a different one.');
      setIsSaving(false);
      return;
    }
    
    // Optional email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      setIsSaving(false);
      return;
    }

    const newUser: User = {
      id: String(Date.now()),
      name,
      username,
      email: email || undefined,
      role,
      permissions,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
    };

    addUser(newUser);
    setOpenCreateDialog(false);
    resetForm();
    toast.success('User created successfully.');
    setIsSaving(false);
  };

  // Handle edit user
  const handleEditUser = async () => {
    setIsSaving(true);
    
    if (!name || !username || !role) {
      toast.error('Name and username are required.');
      setIsSaving(false);
      return;
    }
    
    // Username format validation
    if (username.length < 3) {
      toast.error('Username must be at least 3 characters.');
      setIsSaving(false);
      return;
    }
    
    // Check if username already exists (excluding current user)
    if (selectedUser && 
        username !== selectedUser.username && 
        users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      toast.error('Username already exists. Please choose a different one.');
      setIsSaving(false);
      return;
    }
    
    // Optional email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      setIsSaving(false);
      return;
    }

    if (!selectedUser) return;

    const updatedUser: User = {
      ...selectedUser,
      name,
      username,
      email: email || undefined,
      role,
      permissions,
    };

    updateUser(updatedUser);
    setOpenEditDialog(false);
    resetForm();
    toast.success('User updated successfully.');
    setIsSaving(false);
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!selectedUser) return;
    
    setIsResetting(true);
    
    try {
      const success = await resetUserPassword(selectedUser.id);
      
      if (success) {
        toast.success('Password has been reset successfully');
        setOpenResetDialog(false);
      } else {
        toast.error('Failed to reset password');
      }
    } catch (error) {
      toast.error('An error occurred while resetting the password');
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };
  
  // Handle send password reset link
  const handleSendResetLink = async () => {
    if (!selectedUser) return;
    
    if (!selectedUser.email) {
      toast.error('User does not have an email address');
      return;
    }
    
    setIsResetting(true);
    
    try {
      const success = await generatePasswordResetLink(selectedUser.id);
      
      if (success) {
        toast.success('Password reset link has been sent to the user\'s email');
        setOpenResetDialog(false);
      } else {
        toast.error('Failed to send password reset link');
      }
    } catch (error) {
      toast.error('An error occurred while sending the password reset link');
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      deleteUser(user.id);
      toast.success('User deleted successfully.');
    }
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setUsername('');
    setEmail('');
    setRole('user');
    setPermissions([]);
    setSelectedUser(null);
  };

  // Open reset password dialog
  const openPasswordReset = (user: User) => {
    setSelectedUser(user);
    setOpenResetDialog(true);
  };

  // Edit user
  const editUser = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email || '');
    setRole(user.role);
    setPermissions(user.permissions);
    setOpenEditDialog(true);
  };

  // useEffect to update state when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setUsername(selectedUser.username);
      setEmail(selectedUser.email || '');
      setRole(selectedUser.role);
      setPermissions(selectedUser.permissions);
    }
  }, [selectedUser]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>
                Create a new user account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email (Optional)
                </Label>
                <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select onValueChange={handleRoleChange} defaultValue={role}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">
                  Permissions
                </Label>
                <div className="col-span-3 space-y-1">
                  {permissionOptions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={permissions.includes(permission)}
                        onCheckedChange={() => handlePermissionChange(permission)}
                      />
                      <Label htmlFor={permission} className="capitalize">
                        {permission.replace('.', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpenCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleCreateUser} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => editUser(user)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openPasswordReset(user)}>
                      <Key className="w-4 h-4 mr-2" />
                      Reset Password
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteUser(user)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit an existing user account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email (Optional)
              </Label>
              <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select onValueChange={handleRoleChange} value={role}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">
                Permissions
              </Label>
              <div className="col-span-3 space-y-1">
                {permissionOptions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${permission}`}
                      checked={permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionChange(permission)}
                    />
                    <Label htmlFor={`edit-${permission}`} className="capitalize">
                      {permission.replace('.', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenEditDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditUser} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  Update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Choose how to reset the password for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="flex items-start">
                <Key className="w-5 h-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Set New Password</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Reset the user's password manually
                  </p>
                  <Button 
                    onClick={handleResetPassword} 
                    disabled={isResetting}
                    variant="outline" 
                    className="w-full"
                  >
                    {isResetting ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </div>
            </div>
            
            {selectedUser?.email && (
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">Send Reset Link</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Send a password reset link to {selectedUser.email}
                    </p>
                    <Button 
                      onClick={handleSendResetLink} 
                      disabled={isResetting}
                      variant="outline"
                      className="w-full"
                    >
                      {isResetting ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenResetDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
