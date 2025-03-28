
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BellRing, Settings, Bell } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import PermissionGuard from "@/components/PermissionGuard";
import { Button } from "@/components/ui/button";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    documentSigned: {
      users: true,
      admin: true
    },
    documentViewers: {
      users: false,
      admin: true
    },
    certificateExpiry: {
      users: false,
      admin: true
    },
    loginAttempts: {
      users: false,
      admin: true
    },
    userCreated: {
      users: false,
      admin: true
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  
  const handleNotificationChange = (category: string, target: 'users' | 'admin', checked: boolean) => {
    setNotifications({
      ...notifications,
      [category]: {
        ...notifications[category as keyof typeof notifications],
        [target]: checked
      }
    });
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // In a real app, this would send the notification settings to the backend
    // For now, we'll just simulate success
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notification settings saved successfully');
    }, 1000);
  };
  
  return (
    <PermissionGuard permission="manage_settings">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>
            Configure which notifications are sent to users and administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 pb-2 mb-4 border-b">
              <div></div>
              <div className="text-center text-sm font-medium">Users</div>
              <div className="text-center text-sm font-medium">Admin</div>
            </div>
            
            {/* Document Signed */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Document Signed</Label>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.documentSigned.users}
                  onCheckedChange={(checked) => handleNotificationChange('documentSigned', 'users', checked)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.documentSigned.admin}
                  onCheckedChange={(checked) => handleNotificationChange('documentSigned', 'admin', checked)}
                />
              </div>
            </div>
            
            {/* Document Viewed */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Document Viewed</Label>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.documentViewers.users}
                  onCheckedChange={(checked) => handleNotificationChange('documentViewers', 'users', checked)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.documentViewers.admin}
                  onCheckedChange={(checked) => handleNotificationChange('documentViewers', 'admin', checked)}
                />
              </div>
            </div>
            
            {/* Certificate Expiry */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Certificate Expiry</Label>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.certificateExpiry.users}
                  onCheckedChange={(checked) => handleNotificationChange('certificateExpiry', 'users', checked)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.certificateExpiry.admin}
                  onCheckedChange={(checked) => handleNotificationChange('certificateExpiry', 'admin', checked)}
                />
              </div>
            </div>
            
            {/* Login Attempts */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Failed Login Attempts</Label>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.loginAttempts.users}
                  onCheckedChange={(checked) => handleNotificationChange('loginAttempts', 'users', checked)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.loginAttempts.admin}
                  onCheckedChange={(checked) => handleNotificationChange('loginAttempts', 'admin', checked)}
                />
              </div>
            </div>
            
            {/* User Created */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>User Created/Updated</Label>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.userCreated.users}
                  onCheckedChange={(checked) => handleNotificationChange('userCreated', 'users', checked)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={notifications.userCreated.admin}
                  onCheckedChange={(checked) => handleNotificationChange('userCreated', 'admin', checked)}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PermissionGuard>
  );
};

export default NotificationSettings;
