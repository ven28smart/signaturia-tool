
import React, { useState } from 'react';
import { Users, UserPlus, UserCheck, UserX, Edit, Trash2, Search, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { User, UserRole, defaultPermissions, rolePermissions } from '@/types/user';
import PermissionGuard from '@/components/PermissionGuard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser, hasPermission, currentUser } = useUser();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isRolePermissionsOpen, setIsRolePermissionsOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('user');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive' | 'pending'>('active');
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('user');
    setFormStatus('active');
    setCustomPermissions([]);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setCustomPermissions([...user.permissions]);
    setIsEditUserOpen(true);
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: formName,
      email: formEmail,
      role: formRole,
      permissions: customPermissions.length > 0 ? customPermissions : rolePermissions[formRole],
      createdAt: new Date().toISOString(),
      status: formStatus,
    };

    addUser(newUser);
    toast.success(`User ${formName} has been added`);
    setIsAddUserOpen(false);
    resetForm();
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    const updatedUser: User = {
      ...selectedUser,
      name: formName,
      email: formEmail,
      role: formRole,
      permissions: customPermissions.length > 0 ? customPermissions : rolePermissions[formRole],
      status: formStatus,
    };

    updateUser(updatedUser);
    toast.success(`User ${formName} has been updated`);
    setIsEditUserOpen(false);
    resetForm();
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    deleteUser(selectedUser.id);
    toast.success(`User ${selectedUser.name} has been deleted`);
    setIsDeleteUserOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChange = (role: UserRole) => {
    setFormRole(role);
    // Reset to standard permissions for the role
    setCustomPermissions(rolePermissions[role]);
  };

  const togglePermission = (permissionId: string) => {
    if (customPermissions.includes(permissionId)) {
      setCustomPermissions(customPermissions.filter(p => p !== permissionId));
    } else {
      setCustomPermissions([...customPermissions, permissionId]);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'user': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <PermissionGuard 
      permission="manage_users"
      fallback={
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Shield className="w-16 h-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You don't have permission to manage users.</p>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-full mr-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">User Management</h1>
            </div>
            <Button onClick={() => { resetForm(); setIsAddUserOpen(true); }} className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          </div>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage users and their permissions in the system
              </CardDescription>
              <div className="flex items-center mt-2">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <Input 
                  placeholder="Search users..." 
                  className="max-w-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("font-medium", getRoleColor(user.role))}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("font-medium", getStatusColor(user.status))}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}</TableCell>
                          <TableCell>{user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, yyyy') : 'Never'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEdit(user)}
                                disabled={currentUser?.id === user.id && user.role === 'admin'}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => { setSelectedUser(user); setIsDeleteUserOpen(true); }}
                                disabled={currentUser?.id === user.id}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsRolePermissionsOpen(true)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Role Permissions
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Add User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and set their permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formRole} 
                  onValueChange={(value) => handleRoleChange(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  {formRole === 'admin' && 'Full access to all features and settings'}
                  {formRole === 'manager' && 'Can manage users and perform most actions'}
                  {formRole === 'user' && 'Can sign documents and view audit logs'}
                  {formRole === 'viewer' && 'Read-only access to audit logs'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formStatus} 
                  onValueChange={(value) => setFormStatus(value as 'active' | 'inactive' | 'pending')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Custom Permissions</Label>
                  <Switch 
                    checked={customPermissions.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCustomPermissions([...rolePermissions[formRole]]);
                      } else {
                        setCustomPermissions([]);
                      }
                    }}
                  />
                </div>
                {customPermissions.length > 0 && (
                  <div className="space-y-2 border rounded-md p-3">
                    {Object.values(defaultPermissions).map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Switch 
                          id={`permission-${permission.id}`}
                          checked={customPermissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label 
                          htmlFor={`permission-${permission.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-gray-500">{permission.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddUser}
                disabled={!formName || !formEmail}
              >Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  placeholder="John Doe" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={formRole} 
                  onValueChange={(value) => handleRoleChange(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formStatus} 
                  onValueChange={(value) => setFormStatus(value as 'active' | 'inactive' | 'pending')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Custom Permissions</Label>
                  <Switch 
                    checked={customPermissions.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCustomPermissions([...rolePermissions[formRole]]);
                      } else {
                        setCustomPermissions([]);
                      }
                    }}
                  />
                </div>
                {customPermissions.length > 0 && (
                  <div className="space-y-2 border rounded-md p-3">
                    {Object.values(defaultPermissions).map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Switch 
                          id={`edit-permission-${permission.id}`}
                          checked={customPermissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label 
                          htmlFor={`edit-permission-${permission.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-gray-500">{permission.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpdateUser}
                disabled={!formName || !formEmail}
              >Update User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Confirmation */}
        <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedUser && (
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback>
                      {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedUser.name}</div>
                    <div className="text-sm text-gray-500">{selectedUser.email}</div>
                  </div>
                  <Badge className={cn("ml-auto font-medium", getRoleColor(selectedUser.role))}>
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </Badge>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>Cancel</Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteUser}
              >Delete User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role Permissions Dialog */}
        <Dialog open={isRolePermissionsOpen} onOpenChange={setIsRolePermissionsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Role Permissions</DialogTitle>
              <DialogDescription>
                Default permissions assigned to each role
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Badge className={getRoleColor('admin')} className="mr-2">Admin</Badge>
                  Administrator
                </h3>
                <ul className="space-y-1 ml-5 list-disc text-sm">
                  {rolePermissions['admin'].map(permission => (
                    <li key={permission}>
                      {defaultPermissions[permission]?.name} - <span className="text-gray-500">{defaultPermissions[permission]?.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Badge className={getRoleColor('manager')} className="mr-2">Manager</Badge>
                  Manager
                </h3>
                <ul className="space-y-1 ml-5 list-disc text-sm">
                  {rolePermissions['manager'].map(permission => (
                    <li key={permission}>
                      {defaultPermissions[permission]?.name} - <span className="text-gray-500">{defaultPermissions[permission]?.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Badge className={getRoleColor('user')} className="mr-2">User</Badge>
                  Regular User
                </h3>
                <ul className="space-y-1 ml-5 list-disc text-sm">
                  {rolePermissions['user'].map(permission => (
                    <li key={permission}>
                      {defaultPermissions[permission]?.name} - <span className="text-gray-500">{defaultPermissions[permission]?.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Badge className={getRoleColor('viewer')} className="mr-2">Viewer</Badge>
                  Viewer
                </h3>
                <ul className="space-y-1 ml-5 list-disc text-sm">
                  {rolePermissions['viewer'].map(permission => (
                    <li key={permission}>
                      {defaultPermissions[permission]?.name} - <span className="text-gray-500">{defaultPermissions[permission]?.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsRolePermissionsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default UserManagement;
