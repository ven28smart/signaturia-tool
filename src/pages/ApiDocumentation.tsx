
import React from 'react';
import { Code, FileJson, Copy, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const ApiDocumentation = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-primary/10 rounded-full mr-3">
          <Code className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">API Documentation</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Leegality Bulk Signer API</CardTitle>
          <CardDescription>
            Use our RESTful API to integrate document signing into your applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="authentication" className="space-y-4">
            <TabsList>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="sign-document">Sign Document</TabsTrigger>
              <TabsTrigger value="get-status">Get Status</TabsTrigger>
              <TabsTrigger value="get-logs">Retrieve Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="authentication" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">API Authentication</h3>
                <p className="mb-4">All API requests require authentication using an API key. You can generate API keys in the application settings.</p>
                
                <div className="p-4 bg-gray-900 text-gray-100 rounded-md mb-4 font-mono text-sm relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre>Authorization: Bearer YOUR_API_KEY</pre>
                </div>
                
                <p>Include this header with all API requests.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="sign-document" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Sign Document API</h3>
                <p className="mb-4">Sign a PDF document using a specific certificate.</p>
                
                <div className="mb-4">
                  <h4 className="font-medium">Endpoint</h4>
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mb-2 font-mono text-sm">
                    POST /api/v1/documents/sign
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium">Request</h4>
                  <div className="p-4 bg-gray-900 text-gray-100 rounded-md mb-2 font-mono text-sm relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(`{
  "document": "base64_encoded_pdf_data",
  "certificateId": "CERT1234",
  "signaturePositions": [
    {
      "page": 1,
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 100
    }
  ],
  "signatureReason": "I approve this document",
  "signatureLocation": "New Delhi"
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre>{`{
  "document": "base64_encoded_pdf_data",
  "certificateId": "CERT1234",
  "signaturePositions": [
    {
      "page": 1,
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 100
    }
  ],
  "signatureReason": "I approve this document",
  "signatureLocation": "New Delhi"
}`}</pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Response</h4>
                  <div className="p-4 bg-gray-900 text-gray-100 rounded-md font-mono text-sm relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(`{
  "status": "success",
  "documentId": "DOC1234567890ABCD",
  "signedDocument": "base64_encoded_signed_pdf",
  "auditTrailDocument": "base64_encoded_audit_trail_pdf",
  "certificate": {
    "id": "CERT1234",
    "name": "Company Certificate",
    "type": "pkcs12",
    "issuer": "DigiCert Inc"
  },
  "metadata": {
    "documentName": "contract.pdf",
    "documentSize": "245 KB",
    "documentHash": "sha256:8a325f8c59c93d361b30b9ba8c086587",
    "signedAt": "2023-10-10T14:30:45Z"
  }
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre>{`{
  "status": "success",
  "documentId": "DOC1234567890ABCD",
  "signedDocument": "base64_encoded_signed_pdf",
  "auditTrailDocument": "base64_encoded_audit_trail_pdf",
  "certificate": {
    "id": "CERT1234",
    "name": "Company Certificate",
    "type": "pkcs12",
    "issuer": "DigiCert Inc"
  },
  "metadata": {
    "documentName": "contract.pdf",
    "documentSize": "245 KB",
    "documentHash": "sha256:8a325f8c59c93d361b30b9ba8c086587",
    "signedAt": "2023-10-10T14:30:45Z"
  }
}`}</pre>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="get-status" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Get Document Status</h3>
                <p className="mb-4">Retrieve the status and details of a signed document.</p>
                
                <div className="mb-4">
                  <h4 className="font-medium">Endpoint</h4>
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mb-2 font-mono text-sm">
                    GET /api/v1/documents/{'{documentId}'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Response</h4>
                  <div className="p-4 bg-gray-900 text-gray-100 rounded-md font-mono text-sm relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(`{
  "status": "success",
  "document": {
    "id": "DOC1234567890ABCD",
    "name": "contract.pdf",
    "status": "signed",
    "signedAt": "2023-10-10T14:30:45Z",
    "signedBy": "admin",
    "certificateId": "CERT1234",
    "certificateName": "Company Certificate",
    "documentHash": "sha256:8a325f8c59c93d361b30b9ba8c086587"
  }
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre>{`{
  "status": "success",
  "document": {
    "id": "DOC1234567890ABCD",
    "name": "contract.pdf",
    "status": "signed",
    "signedAt": "2023-10-10T14:30:45Z",
    "signedBy": "admin",
    "certificateId": "CERT1234",
    "certificateName": "Company Certificate",
    "documentHash": "sha256:8a325f8c59c93d361b30b9ba8c086587"
  }
}`}</pre>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="get-logs" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Retrieve Audit Logs</h3>
                <p className="mb-4">Get audit logs for document signing activities.</p>
                
                <div className="mb-4">
                  <h4 className="font-medium">Endpoint</h4>
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md mb-2 font-mono text-sm">
                    GET /api/v1/audit-logs?fromDate=2023-10-01&toDate=2023-10-31
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Response</h4>
                  <div className="p-4 bg-gray-900 text-gray-100 rounded-md font-mono text-sm relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(`{
  "status": "success",
  "total": 2,
  "logs": [
    {
      "id": "log-1001",
      "timestamp": "2023-10-10T14:30:45Z",
      "documentId": "DOC1234567890ABCD",
      "documentName": "contract.pdf",
      "action": "signed",
      "user": "admin",
      "certificateId": "CERT1234",
      "certificateName": "Company Certificate"
    },
    {
      "id": "log-1002",
      "timestamp": "2023-10-11T09:15:30Z",
      "documentId": "DOC9876543210EFGH",
      "documentName": "agreement.pdf",
      "action": "signed",
      "user": "manager",
      "certificateId": "CERT1234",
      "certificateName": "Company Certificate"
    }
  ]
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre>{`{
  "status": "success",
  "total": 2,
  "logs": [
    {
      "id": "log-1001",
      "timestamp": "2023-10-10T14:30:45Z",
      "documentId": "DOC1234567890ABCD",
      "documentName": "contract.pdf",
      "action": "signed",
      "user": "admin",
      "certificateId": "CERT1234",
      "certificateName": "Company Certificate"
    },
    {
      "id": "log-1002",
      "timestamp": "2023-10-11T09:15:30Z",
      "documentId": "DOC9876543210EFGH",
      "documentName": "agreement.pdf",
      "action": "signed",
      "user": "manager",
      "certificateId": "CERT1234",
      "certificateName": "Company Certificate"
    }
  ]
}`}</pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button asChild variant="outline" className="mr-2">
          <a href="/user-readme">
            <FileText className="mr-2 h-4 w-4" />
            User Documentation
          </a>
        </Button>
        <Button asChild>
          <a href="/swagger-spec.json" download="leegality-bulk-signer-api.json">
            <Download className="mr-2 h-4 w-4" />
            Download API Specification
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ApiDocumentation;
