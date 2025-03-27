
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Save } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import PermissionGuard from "@/components/PermissionGuard";

interface NotificationPreferences {
  signatureSuccess: boolean;
  signatureFailure: boolean;
  certificateExpiry: boolean;
  licenseExpiry: boolean;
  unauthorizedAccess: boolean;
  systemErrors: boolean;
}

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    const savedPrefs = localStorage.getItem('notification_preferences');
    return savedPrefs ? JSON.parse(savedPrefs) : {
      signatureSuccess: false,
      signatureFailure: true,
      certificateExpiry: true,
      licenseExpiry: true,
      unauthorizedAccess: true,
      systemErrors: true
    };
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // In a real app, this would be sent to the backend
    // For now, we'll just store in localStorage
    localStorage.setItem('notification_preferences', JSON.stringify(preferences));
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notification preferences saved successfully');
    }, 1000);
  };
  
  return (
    <PermissionGuard permission="settings.edit">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Configure which events should trigger email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Signature Success</Label>
                <p className="text-sm text-muted-foreground">Notify when a document is successfully signed</p>
              </div>
              <Switch 
                checked={preferences.signatureSuccess}
                onCheckedChange={() => handleToggle('signatureSuccess')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Signature Failure</Label>
                <p className="text-sm text-muted-foreground">Notify when document signing fails</p>
              </div>
              <Switch 
                checked={preferences.signatureFailure}
                onCheckedChange={() => handleToggle('signatureFailure')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Certificate Expiry</Label>
                <p className="text-sm text-muted-foreground">Notify when certificates are about to expire</p>
              </div>
              <Switch 
                checked={preferences.certificateExpiry}
                onCheckedChange={() => handleToggle('certificateExpiry')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">License Expiry</Label>
                <p className="text-sm text-muted-foreground">Notify when license is about to expire</p>
              </div>
              <Switch 
                checked={preferences.licenseExpiry}
                onCheckedChange={() => handleToggle('licenseExpiry')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Unauthorized Access</Label>
                <p className="text-sm text-muted-foreground">Notify about unauthorized access attempts</p>
              </div>
              <Switch 
                checked={preferences.unauthorizedAccess}
                onCheckedChange={() => handleToggle('unauthorizedAccess')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">System Errors</Label>
                <p className="text-sm text-muted-foreground">Notify about critical system errors</p>
              </div>
              <Switch 
                checked={preferences.systemErrors}
                onCheckedChange={() => handleToggle('systemErrors')}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              type="button" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PermissionGuard>
  );
};

export default NotificationSettings;
