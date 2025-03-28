
import React from 'react';
import { FileText, FileSignature, Upload, History, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserReadme = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-primary/10 rounded-full mr-3">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">User Documentation</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Leegality Bulk Signer User Guide</CardTitle>
          <CardDescription>
            Learn how to use the Leegality Bulk Signer application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="signing">Signing</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">About Leegality Bulk Signer</h3>
                <p className="mb-4">
                  Leegality Bulk Signer is an on-premises solution for digitally signing PDF documents using 
                  digital certificates (PKCS #12) or Hardware Security Modules (HSM). It provides a secure, 
                  compliant way to add cryptographic digital signatures to your documents.
                </p>
                
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Digital signature of PDF documents using cryptographic certificates</li>
                  <li>Support for both PKCS #12 certificates and HSM connections</li>
                  <li>Comprehensive audit logs for all signing activities</li>
                  <li>API for integration with other systems</li>
                  <li>User management with role-based access control</li>
                  <li>Robust security features to protect your documents and certificates</li>
                </ul>
                
                <h3 className="text-lg font-medium mb-2">Navigation</h3>
                <p className="mb-4">
                  The main navigation menu is located on the left side of the screen and contains the following sections:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Sign Document</strong> - Upload and sign PDF documents</li>
                  <li><strong>Certificate Manager</strong> - Manage digital certificates and HSM connections</li>
                  <li><strong>Audit Logs</strong> - View the history of all document signing activities</li>
                  <li><strong>User Management</strong> - Manage users and their permissions (admin only)</li>
                  <li><strong>Settings</strong> - Configure application settings (admin only)</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="certificates" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Managing Certificates</h3>
                <p className="mb-4">
                  Before you can sign documents, you need to add at least one digital certificate. 
                  Leegality Bulk Signer supports two types of certificates:
                </p>
                
                <h4 className="font-medium mb-2">PKCS #12 Certificates</h4>
                <p className="mb-4">
                  PKCS #12 certificates are files with extensions like .p12 or .pfx that contain both
                  your private key and digital certificate. To add a PKCS #12 certificate:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Navigate to <strong>Certificate Manager</strong> in the sidebar</li>
                  <li>Click the <strong>Add Certificate</strong> tab</li>
                  <li>Enter a name for your certificate</li>
                  <li>Upload your .p12 or .pfx file</li>
                  <li>Enter the password for your certificate</li>
                  <li>Click <strong>Upload Certificate</strong></li>
                </ol>
                
                <h4 className="font-medium mb-2">HSM Connections</h4>
                <p className="mb-4">
                  Hardware Security Modules (HSM) provide enhanced security by keeping private keys in secure hardware.
                  To add an HSM connection:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Navigate to <strong>Certificate Manager</strong> in the sidebar</li>
                  <li>Click the <strong>Add Certificate</strong> tab</li>
                  <li>Select the <strong>HSM Connection</strong> tab</li>
                  <li>Enter a name for the connection</li>
                  <li>Provide the HSM endpoint, slot/token ID, and PIN/password</li>
                  <li>Click <strong>Add HSM Connection</strong></li>
                </ol>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-md">
                  <p className="font-medium">Certificate IDs</p>
                  <p className="text-sm mt-1">
                    Each certificate or HSM connection is assigned a unique 8-character ID.
                    This ID is used to select which certificate to use when signing documents via the API.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signing" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Signing Documents</h3>
                <p className="mb-4">
                  To sign PDF documents with your digital certificate:
                </p>
                
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Navigate to <strong>Sign Document</strong> in the sidebar</li>
                  <li>Upload a PDF document</li>
                  <li>Select the certificate you want to use from the dropdown</li>
                  <li>Specify where to place the signature on the document</li>
                  <li>Add optional signature text, reason, and location</li>
                  <li>Click <strong>Sign Document</strong></li>
                </ol>
                
                <h4 className="font-medium mb-2">Document IDs</h4>
                <p className="mb-4">
                  Each document you sign is assigned a unique 16-character alphanumeric ID.
                  This ID is used to identify the document in audit logs and API requests.
                </p>
                
                <h4 className="font-medium mb-2">Audit Trails</h4>
                <p className="mb-4">
                  After signing a document, you'll receive:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>The signed PDF document</li>
                  <li>An audit trail PDF containing metadata about the signing process</li>
                </ul>
                <p className="mb-4">
                  The audit trail includes information such as:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Document name and ID</li>
                  <li>Document size and SHA-256 hash</li>
                  <li>Certificate information</li>
                  <li>Signing timestamp</li>
                  <li>User who performed the signing</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="audit" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Viewing Audit Logs</h3>
                <p className="mb-4">
                  All document signing activities are recorded in the audit logs:
                </p>
                
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Navigate to <strong>Audit Logs</strong> in the sidebar</li>
                  <li>Browse the list of all signing activities</li>
                  <li>Use filters to find specific logs:</li>
                </ol>
                
                <h4 className="font-medium mb-2">Filtering Logs</h4>
                <p className="mb-4">
                  You can filter audit logs by:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Date range</li>
                  <li>Action type (signed, failed, viewed)</li>
                  <li>Text search (document name, ID, or user)</li>
                </ul>
                
                <h4 className="font-medium mb-2">Exporting Logs</h4>
                <p className="mb-4">
                  To export audit logs as an Excel file:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Apply any desired filters</li>
                  <li>Click the <strong>Export Excel</strong> button</li>
                  <li>Save the downloaded file</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="deployment" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Deployment Guide</h3>
                <p className="mb-4">
                  Leegality Bulk Signer is designed to be deployed on-premises in your organization's infrastructure.
                </p>
                
                <h4 className="font-medium mb-2">System Requirements</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Operating System:</strong> Ubuntu 18.04 LTS or later</li>
                  <li><strong>RAM:</strong> 8 GB minimum (16 GB recommended)</li>
                  <li><strong>CPU:</strong> 4 cores minimum (8 cores recommended)</li>
                  <li><strong>Storage:</strong> 50 GB minimum (100 GB recommended)</li>
                  <li><strong>Database:</strong> PostgreSQL 12 or later</li>
                </ul>
                
                <h4 className="font-medium mb-2">Installation Steps</h4>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li>Download the installation package from the provided link</li>
                  <li>Extract the package on your server</li>
                  <li>Run the installation script:
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1 mb-2 text-sm">
                      sudo ./install.sh
                    </pre>
                  </li>
                  <li>Follow the on-screen prompts to configure:
                    <ul className="list-disc pl-6 mt-1 mb-2">
                      <li>Database connection</li>
                      <li>Admin credentials</li>
                      <li>Storage paths</li>
                      <li>Network settings</li>
                    </ul>
                  </li>
                  <li>Start the service:
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1 mb-2 text-sm">
                      sudo systemctl start bulk-signer
                    </pre>
                  </li>
                  <li>Access the web interface at <code>http://your-server-ip:8080</code></li>
                </ol>
                
                <h4 className="font-medium mb-2">API Documentation</h4>
                <p className="mb-4">
                  For information on the available APIs for integration with your systems,
                  please see the <a href="/api-docs" className="text-primary hover:underline">API Documentation</a>.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button asChild variant="outline" className="mr-2">
          <a href="/admin-readme">
            <FileText className="mr-2 h-4 w-4" />
            Admin Documentation
          </a>
        </Button>
        <Button asChild>
          <a href="/api-docs">
            <ExternalLink className="mr-2 h-4 w-4" />
            API Documentation
          </a>
        </Button>
      </div>
    </div>
  );
};

export default UserReadme;
