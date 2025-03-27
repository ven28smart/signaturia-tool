import React, { useState, useEffect } from 'react';
import { 
  FileUp, 
  FileSignature, 
  Check, 
  X, 
  Info, 
  Download, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion } from "framer-motion";
import LicenseManager from '@/components/LicenseManager';

interface SignaturePosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const SignDocument = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signatureSource, setSignatureSource] = useState('pkcs12');
  const [positions, setPositions] = useState<SignaturePosition[]>([
    { page: 1, x: 100, y: 100, width: 200, height: 100 }
  ]);
  const [signedFile, setSignedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [showLicenseWarning, setShowLicenseWarning] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      // Generate a random document ID
      setDocumentId(`DOC-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
    }
  };

  const handleAddPosition = () => {
    setPositions([...positions, { page: 1, x: 100, y: 100, width: 200, height: 100 }]);
  };

  const handleRemovePosition = (index: number) => {
    const newPositions = [...positions];
    newPositions.splice(index, 1);
    setPositions(newPositions);
  };

  const handlePositionChange = (index: number, field: keyof SignaturePosition, value: number) => {
    const newPositions = [...positions];
    newPositions[index][field] = value;
    setPositions(newPositions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    // Check license before proceeding
    // @ts-ignore
    const licenseValid = window.checkLicenseForSigning && window.checkLicenseForSigning();
    
    if (!licenseValid) {
      setShowLicenseWarning(true);
      return;
    }
    
    setIsProcessing(true);
    
    // Mock signing process
    setTimeout(() => {
      setIsProcessing(false);
      setSignedFile('signed_document.pdf');
      toast.success('Document signed successfully');
    }, 2000);
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
            <FileSignature className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Sign Document</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>Digital Signature</CardTitle>
                <CardDescription>
                  Upload a PDF document and specify where to place the signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!signedFile ? (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="document">Upload Document</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 dark:border-gray-700">
                          {file ? (
                            <div className="space-y-2">
                              <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • Document ID: {documentId}
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
                              <FileUp className="w-8 h-8 text-gray-400 mx-auto" />
                              <p className="text-sm">Drag and drop your PDF file here, or click to browse</p>
                              <Input 
                                id="document" 
                                type="file" 
                                accept=".pdf" 
                                className="hidden" 
                                onChange={handleFileChange}
                              />
                              <Button type="button" variant="outline" asChild>
                                <Label htmlFor="document" className="cursor-pointer">Browse Files</Label>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Signature Source</Label>
                        <RadioGroup defaultValue="pkcs12" value={signatureSource} onValueChange={setSignatureSource} className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pkcs12" id="pkcs12" />
                            <Label htmlFor="pkcs12">PKCS #12 Certificate</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hsm" id="hsm" />
                            <Label htmlFor="hsm">HSM Device</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Tabs defaultValue="positions" className="w-full">
                        <TabsList className="w-full">
                          <TabsTrigger value="positions" className="flex-1">Signature Positions</TabsTrigger>
                          <TabsTrigger value="advanced" className="flex-1">Advanced Options</TabsTrigger>
                        </TabsList>
                        <TabsContent value="positions" className="pt-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label>Signature Positions</Label>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={handleAddPosition}
                              >
                                Add Position
                              </Button>
                            </div>
                            
                            {positions.map((position, index) => (
                              <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium">Position {index + 1}</h4>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleRemovePosition(index)}
                                    disabled={positions.length === 1}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`page-${index}`}>Page</Label>
                                    <Input
                                      id={`page-${index}`}
                                      type="number"
                                      min="1"
                                      value={position.page}
                                      onChange={(e) => handlePositionChange(index, 'page', parseInt(e.target.value))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`x-${index}`}>X Position (px)</Label>
                                    <Input
                                      id={`x-${index}`}
                                      type="number"
                                      min="0"
                                      value={position.x}
                                      onChange={(e) => handlePositionChange(index, 'x', parseInt(e.target.value))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`y-${index}`}>Y Position (px)</Label>
                                    <Input
                                      id={`y-${index}`}
                                      type="number"
                                      min="0"
                                      value={position.y}
                                      onChange={(e) => handlePositionChange(index, 'y', parseInt(e.target.value))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`width-${index}`}>Width (px)</Label>
                                    <Input
                                      id={`width-${index}`}
                                      type="number"
                                      min="50"
                                      value={position.width}
                                      onChange={(e) => handlePositionChange(index, 'width', parseInt(e.target.value))}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="advanced" className="pt-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signature-reason">Signature Reason</Label>
                            <Input id="signature-reason" placeholder="I approve this document" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signature-location">Signature Location</Label>
                            <Input id="signature-location" placeholder="San Francisco, CA" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-info">Contact Information</Label>
                            <Input id="contact-info" placeholder="john.doe@example.com" />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button type="submit" className="gap-2" disabled={!file || isProcessing}>
                        {isProcessing ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FileSignature className="w-4 h-4" />
                            Sign Document
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full inline-flex">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold">Document Signed Successfully</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your document has been digitally signed and is ready to download
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mt-4 text-left">
                      <div className="mb-2">
                        <span className="text-sm font-medium">Document ID:</span>{" "}
                        <span className="text-sm text-gray-600 dark:text-gray-300">{documentId}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm font-medium">Signed On:</span>{" "}
                        <span className="text-sm text-gray-600 dark:text-gray-300">{new Date().toLocaleString()}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm font-medium">Certificate:</span>{" "}
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {signatureSource === 'pkcs12' ? 'PKCS #12 Certificate' : 'HSM Certificate'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 space-x-3">
                      <Button className="gap-2">
                        <Download className="w-4 h-4" />
                        Download Signed Document
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setSignedFile(null);
                        setFile(null);
                      }}>
                        Sign Another Document
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    The document will be digitally signed using the selected certificate. 
                    All signing activities are securely logged for audit purposes.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <LicenseManager />
            
            {showLicenseWarning && (
              <Card className="mt-6 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">License Restriction</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Unable to sign document due to license limitations. Please check your license details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignDocument;
