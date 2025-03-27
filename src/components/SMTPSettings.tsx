
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import PermissionGuard from "@/components/PermissionGuard";

interface SMTPConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
  secure: boolean;
}

const SMTPSettings = () => {
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>(() => {
    const savedConfig = localStorage.getItem('smtp_config');
    return savedConfig ? JSON.parse(savedConfig) : {
      host: '',
      port: '587',
      username: '',
      password: '',
      fromEmail: '',
      secure: true
    };
  });
  
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSmtpConfig({
      ...smtpConfig,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // In a real app, this would be sent to the backend
    // For now, we'll just store in localStorage
    localStorage.setItem('smtp_config', JSON.stringify(smtpConfig));
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('SMTP settings saved successfully');
    }, 1000);
  };
  
  const handleTest = () => {
    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.username || !smtpConfig.password || !smtpConfig.fromEmail) {
      toast.error('Please fill in all SMTP fields');
      return;
    }
    
    setIsTesting(true);
    
    // Simulate test email
    setTimeout(() => {
      setIsTesting(false);
      toast.success('Test email sent successfully');
    }, 2000);
  };
  
  return (
    <PermissionGuard permission="settings.edit">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle>SMTP Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure your SMTP server for sending email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                name="host"
                value={smtpConfig.host}
                onChange={handleInputChange}
                placeholder="e.g. smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                name="port"
                value={smtpConfig.port}
                onChange={handleInputChange}
                placeholder="e.g. 587"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-username">Username</Label>
              <Input
                id="smtp-username"
                name="username"
                value={smtpConfig.username}
                onChange={handleInputChange}
                placeholder="Your SMTP username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">Password</Label>
              <Input
                id="smtp-password"
                name="password"
                type="password"
                value={smtpConfig.password}
                onChange={handleInputChange}
                placeholder="Your SMTP password"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="smtp-from">From Email</Label>
              <Input
                id="smtp-from"
                name="fromEmail"
                value={smtpConfig.fromEmail}
                onChange={handleInputChange}
                placeholder="notifications@yourcompany.com"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="smtp-secure">Use Secure Connection (TLS)</Label>
                <Switch
                  id="smtp-secure"
                  name="secure"
                  checked={smtpConfig.secure}
                  onCheckedChange={(checked) => setSmtpConfig({...smtpConfig, secure: checked})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleTest}
              disabled={isTesting}
            >
              {isTesting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
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
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PermissionGuard>
  );
};

export default SMTPSettings;
