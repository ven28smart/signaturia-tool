import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  KeyRound, 
  Shield, 
  FileQuestion,
  Info,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import LicenseManager from '@/components/LicenseManager';
import { generateLicenseKey } from '@/types/user';
import SMTPSettings from '@/components/SMTPSettings';
import NotificationSettings from '@/components/NotificationSettings';

const Settings = () => {
  const [pdfLibrary, setPdfLibrary] = useState('itext');
  const [enableAudit, setEnableAudit] = useState(true);
  const [auditRetention, setAuditRetention] = useState('90');
  const [timeStampServer, setTimeStampServer] = useState('http://timestamp.digicert.com');
  const [isSaving, setIsSaving] = useState(false);
  
  const [orgId, setOrgId] = useState('demo-org-123');
  const [expiryDays, setExpiryDays] = useState(30);
  const [docLimit, setDocLimit] = useState(100);
  const [generatedKey, setGeneratedKey] = useState('');
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const handleGenerateLicenseKey = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays.toString()));
    
    const key = generateLicenseKey(
      orgId,
      expiryDate,
      parseInt(docLimit.toString())
    );
    
    setGeneratedKey(key);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center mb-6">
          <div className="p-2 bg-primary/10 rounded-full mr-3">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure the behavior of the document signing application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
                    <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                    <TabsTrigger value="audit" className="flex-1">Audit</TabsTrigger>
                    <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
                    <TabsTrigger value="license" className="flex-1">License</TabsTrigger>
                  </TabsList>
                  
                  <form onSubmit={handleSaveSettings}>
                    <TabsContent value="general">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>PDF Processing Library</Label>
                          <RadioGroup value={pdfLibrary} onValueChange={setPdfLibrary}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="itext" id="itext" />
                              <Label htmlFor="itext">iText (Recommended)</Label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <RadioGroupItem value="pdfbox" id="pdfbox" />
                              <Label htmlFor="pdfbox">Apache PDFBox</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timestamp-server">Timestamp Server URL</Label>
                          <Input 
                            id="timestamp-server" 
                            value={timeStampServer}
                            onChange={(e) => setTimeStampServer(e.target.value)}
                            placeholder="e.g., http://timestamp.digicert.com"
                          />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Trusted timestamp authority for document signatures
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enable-multi-sign">Enable Multiple Signatures</Label>
                            <Switch id="enable-multi-sign" defaultChecked />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Allow multiple signatures on the same document
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="security">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enable-encryption">Enable Document Encryption</Label>
                            <Switch id="enable-encryption" defaultChecked />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Encrypt documents after signing for additional security
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Certificate Validation Level</Label>
                          <RadioGroup defaultValue="full">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="full" id="full" />
                              <Label htmlFor="full">Full Validation (OCSP + CRL)</Label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <RadioGroupItem value="ocsp" id="ocsp" />
                              <Label htmlFor="ocsp">OCSP Only</Label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <RadioGroupItem value="crl" id="crl" />
                              <Label htmlFor="crl">CRL Only</Label>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <RadioGroupItem value="none" id="none" />
                              <Label htmlFor="none">No Validation</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex gap-3">
                            <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-yellow-800 dark:text-yellow-500">Security Recommendation</h4>
                              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                For the highest level of security, we recommend using an HSM device for key storage and full certificate validation.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="audit">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enable-audit">Enable Audit Logging</Label>
                            <Switch 
                              id="enable-audit" 
                              checked={enableAudit}
                              onCheckedChange={setEnableAudit}
                            />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Maintain a detailed log of all document signing activities
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="audit-retention">Audit Log Retention (days)</Label>
                          <Input 
                            id="audit-retention" 
                            type="number"
                            min="1"
                            value={auditRetention}
                            onChange={(e) => setAuditRetention(e.target.value)}
                            disabled={!enableAudit}
                          />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Number of days to retain audit logs before automatic deletion
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enable-export">Enable Audit Log Export</Label>
                            <Switch id="enable-export" defaultChecked disabled={!enableAudit} />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Allow exporting audit logs in CSV or PDF format
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notifications">
                      <div className="space-y-6">
                        <SMTPSettings />
                        <NotificationSettings />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="license" className="space-y-6">
                      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">License Key Generator</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          This section is for administrators only. Use it to generate license keys for your clients.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="org-id">Organization ID</Label>
                            <Input 
                              id="org-id" 
                              value={orgId}
                              onChange={(e) => setOrgId(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiry-days">License Duration (days)</Label>
                            <Input 
                              id="expiry-days" 
                              type="number"
                              min="1"
                              value={expiryDays}
                              onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doc-limit">Document Limit</Label>
                            <Input 
                              id="doc-limit" 
                              type="number"
                              min="1"
                              value={docLimit}
                              onChange={(e) => setDocLimit(parseInt(e.target.value))}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button 
                              type="button" 
                              onClick={handleGenerateLicenseKey}
                              className="w-full"
                            >
                              Generate Key
                            </Button>
                          </div>
                        </div>
                        
                        {generatedKey && (
                          <div className="mt-4 p-3 bg-primary/10 rounded-md">
                            <Label className="text-sm mb-1 block">Generated License Key:</Label>
                            <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border overflow-x-auto">
                              {generatedKey}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              This key will allow the client to sign {docLimit} documents within {expiryDays} days.
                            </p>
                          </div>
                        )}
                        
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                          <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-800 dark:text-blue-500">License Key Security</h4>
                              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                In a production environment, license keys would be generated on the server side with proper cryptographic signing to prevent tampering.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <div className="flex justify-end mt-6">
                      <Button type="submit" className="gap-2" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    These settings control how the application handles documents, certificates, emails, and audit logging. 
                    Changes take effect immediately after saving.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <LicenseManager />
            
            <Card className="mt-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Deployment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Build:</span>
                  <span className="font-medium">{new Date().toISOString().split('T')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-medium">Local</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">Embedded</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
