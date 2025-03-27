
import React, { useState } from 'react';
import { 
  Upload, 
  FileCheck, 
  Server, 
  AlertCircle, 
  CheckCircle, 
  Trash,
  Plus,
  Info,
  Edit,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from "framer-motion";

interface Certificate {
  id: string;
  name: string;
  type: 'pkcs12' | 'hsm';
  issuer: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expired' | 'revoked';
  lastUsed?: string;
}

const CertificateManager = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 'cert-001',
      name: 'Company Signing Certificate',
      type: 'pkcs12',
      issuer: 'DigiCert Inc',
      validFrom: '2023-01-01',
      validTo: '2024-01-01',
      status: 'active',
      lastUsed: '2023-10-15'
    }
  ]);
  
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [hsmName, setHsmName] = useState('');
  const [hsmEndpoint, setHsmEndpoint] = useState('');
  const [hsmSlot, setHsmSlot] = useState('');
  const [hsmPin, setHsmPin] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a certificate file');
      return;
    }
    
    if (!password) {
      toast.error('Please enter the certificate password');
      return;
    }
    
    if (!certificateName) {
      toast.error('Please enter a name for the certificate');
      return;
    }
    
    setIsUploading(true);
    
    // Mock upload process
    setTimeout(() => {
      const newCertificate: Certificate = {
        id: `cert-${Math.floor(Math.random() * 1000)}`,
        name: certificateName,
        type: 'pkcs12',
        issuer: 'Uploaded Certificate Authority',
        validFrom: new Date().toISOString().split('T')[0],
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active'
      };
      
      setCertificates([...certificates, newCertificate]);
      setIsUploading(false);
      setFile(null);
      setPassword('');
      setCertificateName('');
      toast.success('Certificate uploaded successfully');
    }, 1500);
  };

  const handleAddHSM = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hsmName || !hsmEndpoint || !hsmSlot || !hsmPin) {
      toast.error('Please fill in all HSM connection details');
      return;
    }
    
    setIsTestingConnection(true);
    
    // Mock connection test
    setTimeout(() => {
      const newCertificate: Certificate = {
        id: `hsm-${Math.floor(Math.random() * 1000)}`,
        name: hsmName,
        type: 'hsm',
        issuer: 'Hardware Security Module',
        validFrom: new Date().toISOString().split('T')[0],
        validTo: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active'
      };
      
      setCertificates([...certificates, newCertificate]);
      setIsTestingConnection(false);
      setHsmName('');
      setHsmEndpoint('');
      setHsmSlot('');
      setHsmPin('');
      toast.success('HSM connected successfully');
    }, 2000);
  };

  const confirmDelete = (certificateId: string) => {
    setCertificateToDelete(certificateId);
    setShowDeleteDialog(true);
  };

  const handleDeleteCertificate = () => {
    if (certificateToDelete) {
      setCertificates(certificates.filter(cert => cert.id !== certificateToDelete));
      toast.success('Certificate deleted successfully');
      setShowDeleteDialog(false);
      setCertificateToDelete(null);
    }
  };

  const getStatusBadge = (status: Certificate['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'revoked':
        return <Badge variant="outline" className="text-red-500 border-red-500">Revoked</Badge>;
      default:
        return null;
    }
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
            <FileCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Certificate Manager</h1>
        </div>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Digital Certificates</CardTitle>
            <CardDescription>
              Manage your PKCS #12 certificates and HSM connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="certificates" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="certificates" className="flex-1">Certificates</TabsTrigger>
                <TabsTrigger value="add" className="flex-1">Add Certificate</TabsTrigger>
              </TabsList>
              <TabsContent value="certificates" className="pt-4">
                {certificates.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="mb-2">
                      <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No Certificates Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You haven't added any certificates yet
                    </p>
                    <Button variant="outline" onClick={() => document.getElementById('add-tab')?.click()}>
                      Add Your First Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <div className="flex justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              {cert.type === 'pkcs12' ? (
                                <FileCheck className="w-5 h-5 text-primary" />
                              ) : (
                                <Server className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{cert.name}</h4>
                                {getStatusBadge(cert.status)}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {cert.type === 'pkcs12' ? 'PKCS #12 Certificate' : 'HSM Certificate'}
                              </p>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Issuer: </span>
                                  <span>{cert.issuer}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Valid From: </span>
                                  <span>{new Date(cert.validFrom).toLocaleDateString()}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">ID: </span>
                                  <span className="font-mono text-xs">{cert.id}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Valid To: </span>
                                  <span>{new Date(cert.validTo).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500" 
                              onClick={() => confirmDelete(cert.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="add" className="pt-4">
                <Tabs defaultValue="pkcs12">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="pkcs12" className="flex-1">
                      <FileCheck className="w-4 h-4 mr-2" />
                      PKCS #12 Certificate
                    </TabsTrigger>
                    <TabsTrigger value="hsm" className="flex-1">
                      <Server className="w-4 h-4 mr-2" />
                      HSM Connection
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="pkcs12">
                    <form onSubmit={handleUploadCertificate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="certificate-name">Certificate Name</Label>
                        <Input 
                          id="certificate-name"
                          placeholder="Enter a name for this certificate"
                          value={certificateName}
                          onChange={(e) => setCertificateName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="certificate-file">Certificate File (.p12 or .pfx)</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 dark:border-gray-700">
                          {file ? (
                            <div className="space-y-2">
                              <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="mt-2"
                                onClick={() => setFile(null)}
                              >
                                Change File
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                              <p className="text-sm">Drag and drop your certificate file here, or click to browse</p>
                              <Input 
                                id="certificate-file" 
                                type="file" 
                                accept=".p12,.pfx" 
                                className="hidden" 
                                onChange={handleFileChange}
                              />
                              <Button type="button" variant="outline" asChild>
                                <Label htmlFor="certificate-file" className="cursor-pointer">Browse Files</Label>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="certificate-password">Certificate Password</Label>
                        <Input 
                          id="certificate-password" 
                          type="password" 
                          placeholder="Enter the certificate password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" className="gap-2" disabled={isUploading}>
                          {isUploading ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Upload Certificate
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="hsm">
                    <form onSubmit={handleAddHSM} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="hsm-name">Connection Name</Label>
                        <Input 
                          id="hsm-name"
                          placeholder="Enter a name for this HSM connection"
                          value={hsmName}
                          onChange={(e) => setHsmName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hsm-endpoint">HSM Endpoint</Label>
                        <Input 
                          id="hsm-endpoint"
                          placeholder="e.g., pkcs11://localhost:1234"
                          value={hsmEndpoint}
                          onChange={(e) => setHsmEndpoint(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hsm-slot">Slot/Token ID</Label>
                          <Input 
                            id="hsm-slot"
                            placeholder="e.g., 0"
                            value={hsmSlot}
                            onChange={(e) => setHsmSlot(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hsm-pin">PIN/Password</Label>
                          <Input 
                            id="hsm-pin"
                            type="password"
                            placeholder="Enter PIN/Password"
                            value={hsmPin}
                            onChange={(e) => setHsmPin(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" className="gap-2" disabled={isTestingConnection}>
                          {isTestingConnection ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                              Testing Connection...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Add HSM Connection
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Certificates are used to digitally sign documents. PKCS #12 certificates are stored securely, 
              while HSM connections provide enhanced security by keeping private keys in hardware.
            </p>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Certificate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this certificate? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCertificate}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificateManager;
