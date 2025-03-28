
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Clock, Shield, Bell, Mail, Key } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { generateLicenseKey, validateLicenseKey } from '@/types/user';
import SMTPSettings from '@/components/SMTPSettings';
import NotificationSettings from '@/components/NotificationSettings';

const Settings: React.FC = () => {
  const { hasPermission } = useUser();
  
  const [timezone, setTimezone] = useState<string>('Asia/Kolkata');
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [isActivatingLicense, setIsActivatingLicense] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<{
    isActive: boolean;
    expiryDate: string;
    totalDocuments: number;
    usedDocuments: number;
  } | null>(null);
  
  const handleSaveGeneralSettings = () => {
    toast.success('Settings saved successfully');
  };
  
  const handleActivateLicense = () => {
    if (!licenseKey) {
      toast.error('Please enter a license key');
      return;
    }
    
    setIsActivatingLicense(true);
    
    // Simulate license activation
    setTimeout(() => {
      try {
        const validationResult = validateLicenseKey(licenseKey);
        
        if (validationResult.isValid) {
          setLicenseInfo({
            isActive: true,
            expiryDate: validationResult.expiryDate?.toISOString().split('T')[0] || '',
            totalDocuments: validationResult.totalDocuments || 1000,
            usedDocuments: 0
          });
          toast.success('License activated successfully');
        } else {
          toast.error('Invalid license key');
        }
      } catch (error) {
        console.error('Error validating license:', error);
        toast.error('An error occurred while validating the license');
      } finally {
        setIsActivatingLicense(false);
      }
    }, 1500);
  };
  
  const timezones = [
    { value: 'Asia/Kolkata', label: 'India (GMT+5:30)' },
    { value: 'America/New_York', label: 'Eastern Time (GMT-5:00)' },
    { value: 'America/Chicago', label: 'Central Time (GMT-6:00)' },
    { value: 'America/Denver', label: 'Mountain Time (GMT-7:00)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (GMT-8:00)' },
    { value: 'Europe/London', label: 'London (GMT+0:00)' },
    { value: 'Europe/Paris', label: 'Paris (GMT+1:00)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9:00)' },
    { value: 'Australia/Sydney', label: 'Sydney (GMT+10:00)' },
  ];
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-primary/10 rounded-full mr-3">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="license">License</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>General Settings</CardTitle>
              </div>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Time zone used for document signing timestamps
                </p>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSaveGeneralSettings}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="license">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>License Management</CardTitle>
              </div>
              <CardDescription>
                Manage your Leegality Bulk Signer license
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {licenseInfo ? (
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-4">Active License</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <p className="font-medium flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Active
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                      <p className="font-medium">
                        {new Date(licenseInfo.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Document Limit</p>
                      <p className="font-medium">{licenseInfo.totalDocuments.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Documents Used</p>
                      <p className="font-medium">{licenseInfo.usedDocuments.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active License</h3>
                  <p className="text-gray-500 mb-4">
                    Enter your license key to activate Leegality Bulk Signer
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="license-key">License Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="license-key"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="Enter your license key"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleActivateLicense}
                    disabled={isActivatingLicense}
                  >
                    {isActivatingLicense ? 'Activating...' : 'Activate'}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Contact Grey Swift support to obtain a license key
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>
                Configure security settings for the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Password Policy</h3>
                <p className="text-gray-500 mb-4">
                  Configure password requirements for all users
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Minimum Password Length</Label>
                      <p className="text-sm text-gray-500">
                        Minimum number of characters required
                      </p>
                    </div>
                    <Input 
                      type="number" 
                      min="6" 
                      max="20" 
                      defaultValue="8" 
                      className="w-20"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Password Expiry (Days)</Label>
                      <p className="text-sm text-gray-500">
                        Number of days until password must be changed
                      </p>
                    </div>
                    <Input 
                      type="number" 
                      min="0" 
                      max="365" 
                      defaultValue="90" 
                      className="w-20"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Failed Login Attempts</Label>
                      <p className="text-sm text-gray-500">
                        Number of failed attempts before account lockout
                      </p>
                    </div>
                    <Input 
                      type="number" 
                      min="1" 
                      max="10" 
                      defaultValue="5" 
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button>
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
          <SMTPSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
