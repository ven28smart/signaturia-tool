
import React, { useState, useEffect } from 'react';
import { 
  FileUp, 
  FileSignature, 
  Check, 
  X, 
  Info, 
  Download, 
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import crypto from 'crypto';

interface SignaturePosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

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

interface AuditRecord {
  id: string;
  timestamp: string;
  documentId: string;
  documentName: string;
  documentSize: string;
  documentHash: string;
  action: 'signed' | 'failed' | 'viewed';
  user: string;
  certificateId: string;
  certificateName: string;
  details?: string;
}

const SignDocument = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedCertificateId, setSelectedCertificateId] = useState<string>('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [positions, setPositions] = useState<SignaturePosition[]>([
    { page: 1, x: 100, y: 100, width: 200, height: 100 }
  ]);
  const [signedFile, setSignedFile] = useState<Uint8Array | null>(null);
  const [signedFileUrl, setSignedFileUrl] = useState<string | null>(null);
  const [auditTrailUrl, setAuditTrailUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const [documentHash, setDocumentHash] = useState('');
  const [signatureText, setSignatureText] = useState('');
  const [signatureReason, setSignatureReason] = useState('I approve this document');
  const [signatureLocation, setSignatureLocation] = useState('');

  // Load certificates
  useEffect(() => {
    // In a real app, this would fetch certificates from the backend
    // For this demo, we'll use a simulated certificate list
    const sampleCertificates: Certificate[] = [
      {
        id: 'CERT1234',
        name: 'Company Signing Certificate',
        type: 'pkcs12',
        issuer: 'DigiCert Inc',
        validFrom: '2023-01-01',
        validTo: '2024-01-01',
        status: 'active',
        lastUsed: '2023-10-15'
      },
      {
        id: 'HSM98765',
        name: 'HSM Signing Key',
        type: 'hsm',
        issuer: 'Hardware Security Module',
        validFrom: '2023-01-01',
        validTo: '2025-01-01',
        status: 'active'
      }
    ];
    
    setCertificates(sampleCertificates);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      
      // Generate a unique 16-character document ID
      const randomId = generateRandomId(16);
      setDocumentId(randomId);
      
      // Calculate SHA-256 hash of the document
      const fileBuffer = await selectedFile.arrayBuffer();
      const hash = crypto.createHash('sha256').update(Buffer.from(fileBuffer)).digest('hex');
      setDocumentHash(hash);
    }
  };

  const generateRandomId = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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

  const handleCertificateChange = (certId: string) => {
    setSelectedCertificateId(certId);
  };

  const createAuditTrailPdf = async () => {
    if (!file) return null;
    
    // Create a new PDF document for the audit trail
    const pdfDoc = await PDFDocument.create();
    
    // Add a page to the document
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Load fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Document dimensions
    const { width, height } = page.getSize();
    
    // Draw header
    page.drawText('DOCUMENT SIGNING AUDIT TRAIL', {
      x: 50,
      y: height - 50,
      size: 16,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    // Draw horizontal line
    page.drawLine({
      start: { x: 50, y: height - 70 },
      end: { x: width - 50, y: height - 70 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    // Selected certificate
    const selectedCertificate = certificates.find(cert => cert.id === selectedCertificateId);
    
    // Current date and time
    const timestamp = new Date().toISOString();
    
    // Draw content
    const drawSection = (title: string, y: number) => {
      page.drawText(title, {
        x: 50,
        y,
        size: 14,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      page.drawLine({
        start: { x: 50, y: y - 10 },
        end: { x: width - 50, y: y - 10 },
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      return y - 40;
    };
    
    const drawField = (label: string, value: string, y: number) => {
      page.drawText(label, {
        x: 50,
        y,
        size: 11,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      page.drawText(value, {
        x: 200,
        y,
        size: 11,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
      
      return y - 20;
    };
    
    // Draw document information
    let yPos = drawSection('DOCUMENT INFORMATION', height - 120);
    yPos = drawField('Document ID:', documentId, yPos);
    yPos = drawField('Document Name:', file.name, yPos);
    yPos = drawField('Document Size:', `${(file.size / 1024).toFixed(2)} KB`, yPos);
    yPos = drawField('Document Hash:', `SHA-256: ${documentHash.substring(0, 32)}...`, yPos);
    
    // Draw signature information
    yPos = drawSection('SIGNATURE INFORMATION', yPos - 20);
    yPos = drawField('Certificate ID:', selectedCertificate?.id || '', yPos);
    yPos = drawField('Certificate Name:', selectedCertificate?.name || '', yPos);
    yPos = drawField('Certificate Type:', selectedCertificate?.type.toUpperCase() || '', yPos);
    yPos = drawField('Certificate Issuer:', selectedCertificate?.issuer || '', yPos);
    yPos = drawField('Certificate Valid Until:', new Date(selectedCertificate?.validTo || '').toLocaleDateString(), yPos);
    
    // Draw signing information
    yPos = drawSection('SIGNING DETAILS', yPos - 20);
    yPos = drawField('Signed By:', 'Administrator', yPos);
    yPos = drawField('Signed On:', new Date().toLocaleString(), yPos);
    yPos = drawField('Signature Reason:', signatureReason || 'Not specified', yPos);
    yPos = drawField('Signature Location:', signatureLocation || 'Not specified', yPos);
    
    // Save the audit trail PDF
    const auditTrailPdfBytes = await pdfDoc.save();
    
    return auditTrailPdfBytes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    
    if (!selectedCertificateId) {
      toast.error('Please select a certificate');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Read file as array buffer
      const fileBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(fileBuffer);
      
      // Get the first page of the document
      const pages = pdfDoc.getPages();
      
      // Load a standard font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Get selected certificate
      const selectedCertificate = certificates.find(cert => cert.id === selectedCertificateId);
      
      // Add signature to all specified positions
      for (const position of positions) {
        const pageIndex = position.page - 1;
        
        // Make sure the page exists
        if (pageIndex < 0 || pageIndex >= pages.length) {
          continue;
        }
        
        const page = pages[pageIndex];
        const { width, height } = page.getSize();
        
        // Draw a signature box with proper RGB values
        page.drawRectangle({
          x: position.x,
          y: height - position.y - position.height, // Flip Y coordinate (PDF coordinates start from bottom)
          width: position.width,
          height: position.height,
          borderWidth: 1,
          borderColor: rgb(0, 0, 0),
          color: rgb(0.9, 0.9, 0.9),
          opacity: 0.3,
        });
        
        // Add signature text
        const signatureDisplayText = signatureText || `Digitally signed by: ${selectedCertificate?.name || 'Unknown'}`;
        page.drawText(signatureDisplayText, {
          x: position.x + 10,
          y: height - position.y - 30,
          size: 10,
          font: helveticaBold,
          color: rgb(0, 0, 0),
        });
        
        // Add certificate ID
        page.drawText(`Certificate ID: ${selectedCertificate?.id || 'Unknown'}`, {
          x: position.x + 10,
          y: height - position.y - 45,
          size: 8,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        
        // Add date
        const dateText = `Date: ${new Date().toLocaleDateString()}`;
        page.drawText(dateText, {
          x: position.x + 10,
          y: height - position.y - 60,
          size: 8,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        
        // Add reason if specified
        if (signatureReason) {
          page.drawText(`Reason: ${signatureReason}`, {
            x: position.x + 10,
            y: height - position.y - 75,
            size: 8,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }
        
        // Add location if specified
        if (signatureLocation) {
          page.drawText(`Location: ${signatureLocation}`, {
            x: position.x + 10,
            y: height - position.y - 90,
            size: 8,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }
      }
      
      // Save the modified PDF
      const signedPdfBytes = await pdfDoc.save();
      setSignedFile(signedPdfBytes);
      
      // Create audit trail PDF
      const auditTrailPdfBytes = await createAuditTrailPdf();
      
      // Create URLs for the signed PDF and audit trail
      const signedBlob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const signedUrl = URL.createObjectURL(signedBlob);
      setSignedFileUrl(signedUrl);
      
      if (auditTrailPdfBytes) {
        const auditTrailBlob = new Blob([auditTrailPdfBytes], { type: 'application/pdf' });
        const auditTrailUrl = URL.createObjectURL(auditTrailBlob);
        setAuditTrailUrl(auditTrailUrl);
      }
      
      // Create an audit log entry
      const auditRecord: AuditRecord = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        documentId,
        documentName: file.name,
        documentSize: `${(file.size / 1024).toFixed(2)} KB`,
        documentHash,
        action: 'signed',
        user: 'Administrator',
        certificateId: selectedCertificateId,
        certificateName: selectedCertificate?.name || 'Unknown'
      };
      
      // In a real app, this would be sent to the backend
      console.log('Audit record created:', auditRecord);
      
      setIsProcessing(false);
      toast.success('Document signed successfully');
    } catch (error) {
      console.error('Error signing document:', error);
      setIsProcessing(false);
      toast.error('Failed to sign document. Please try again.');
    }
  };

  const handleDownloadDocument = () => {
    if (!signedFileUrl) {
      toast.error('No signed document available for download');
      return;
    }
    
    try {
      const a = document.createElement('a');
      a.href = signedFileUrl;
      a.download = `signed_${documentId}_${file?.name || 'document.pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Signed document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleDownloadAuditTrail = () => {
    if (!auditTrailUrl) {
      toast.error('No audit trail available for download');
      return;
    }
    
    try {
      const a = document.createElement('a');
      a.href = auditTrailUrl;
      a.download = `audit_trail_${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Audit trail downloaded successfully');
    } catch (error) {
      console.error('Error downloading audit trail:', error);
      toast.error('Failed to download audit trail');
    }
  };

  const handleCopyDocumentId = () => {
    navigator.clipboard.writeText(documentId);
    toast.success('Document ID copied to clipboard');
  };

  // Clean up URL objects when component unmounts
  useEffect(() => {
    return () => {
      if (signedFileUrl) {
        URL.revokeObjectURL(signedFileUrl);
      }
      if (auditTrailUrl) {
        URL.revokeObjectURL(auditTrailUrl);
      }
    };
  }, [signedFileUrl, auditTrailUrl]);

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
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <div className="flex items-center justify-center mt-1">
                              <span className="font-mono">Document ID: {documentId}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 ml-1"
                                onClick={handleCopyDocumentId}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
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
                    <Label htmlFor="certificate">Select Certificate</Label>
                    <Select value={selectedCertificateId} onValueChange={handleCertificateChange}>
                      <SelectTrigger id="certificate">
                        <SelectValue placeholder="Choose a certificate" />
                      </SelectTrigger>
                      <SelectContent>
                        {certificates.map((cert) => (
                          <SelectItem key={cert.id} value={cert.id}>
                            {cert.name} ({cert.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedCertificateId && (
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md text-sm">
                        {(() => {
                          const cert = certificates.find(c => c.id === selectedCertificateId);
                          if (!cert) return null;
                          
                          return (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Type: </span>
                                <span>{cert.type === 'pkcs12' ? 'PKCS #12' : 'HSM'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Issuer: </span>
                                <span>{cert.issuer}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Valid From: </span>
                                <span>{new Date(cert.validFrom).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Valid To: </span>
                                <span>{new Date(cert.validTo).toLocaleDateString()}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signature-text">Signature Text (Optional)</Label>
                    <Input 
                      id="signature-text" 
                      placeholder="Enter your signature text" 
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                    />
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
                        <Input 
                          id="signature-reason" 
                          placeholder="I approve this document" 
                          value={signatureReason}
                          onChange={(e) => setSignatureReason(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signature-location">Signature Location</Label>
                        <Input 
                          id="signature-location" 
                          placeholder="New Delhi, India" 
                          value={signatureLocation}
                          onChange={(e) => setSignatureLocation(e.target.value)}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" className="gap-2" disabled={!file || !selectedCertificateId || isProcessing}>
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
                
                {signedFileUrl && (
                  <div className="mt-4 p-4 border rounded-lg">
                    <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-900 rounded overflow-hidden">
                      <iframe 
                        src={signedFileUrl} 
                        title="Signed Document Preview" 
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mt-4 text-left">
                  <div className="mb-2">
                    <span className="text-sm font-medium">Document ID:</span>{" "}
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">{documentId}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 ml-1"
                      onClick={handleCopyDocumentId}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium">Signed On:</span>{" "}
                    <span className="text-sm text-gray-600 dark:text-gray-300">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium">Certificate:</span>{" "}
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {certificates.find(c => c.id === selectedCertificateId)?.name || 'Unknown'} ({selectedCertificateId})
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium">Document Hash:</span>{" "}
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {documentHash.substring(0, 16)}...
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-x-3">
                  <Button className="gap-2" onClick={handleDownloadDocument}>
                    <Download className="w-4 h-4" />
                    Download Signed Document
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={handleDownloadAuditTrail}>
                    <FileText className="w-4 h-4" />
                    Download Audit Trail
                  </Button>
                  <Button variant="secondary" onClick={() => {
                    setSignedFile(null);
                    setSignedFileUrl(null);
                    setAuditTrailUrl(null);
                    setFile(null);
                    setDocumentId('');
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
      </motion.div>
    </div>
  );
};

export default SignDocument;
