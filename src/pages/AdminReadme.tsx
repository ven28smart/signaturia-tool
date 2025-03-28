
import React from 'react';
import { FileText, Copy, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AdminReadme = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-primary/10 rounded-full mr-3">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Admin Documentation</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Leegality Bulk Signer Admin Guide</CardTitle>
          <CardDescription>
            Administrative documentation for managing the Leegality Bulk Signer product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">License Creation Process</h2>
            <p className="mb-4">
              Licenses for Leegality Bulk Signer control the usage limits and expiration date of the application.
              Follow these steps to create and manage licenses:
            </p>
            
            <ol className="list-decimal ml-6 space-y-3">
              <li>
                <strong>Generate License Key</strong>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  Use the license generation tool with the customer's organization ID, expiry date, and document limit:
                </p>
                <div className="p-4 bg-gray-900 text-gray-100 rounded-md my-2 font-mono text-sm relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard('./license-tool generate --org-id "customer-org-name" --expiry "2024-12-31" --doc-limit 10000')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre>./license-tool generate --org-id "customer-org-name" --expiry "2024-12-31" --doc-limit 10000</pre>
                </div>
              </li>
              
              <li>
                <strong>Verify License Key</strong>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  To verify a license key before providing it to a customer:
                </p>
                <div className="p-4 bg-gray-900 text-gray-100 rounded-md my-2 font-mono text-sm relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard('./license-tool verify --key "LICENSE-KEY-HERE"')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre>./license-tool verify --key "LICENSE-KEY-HERE"</pre>
                </div>
              </li>
              
              <li>
                <strong>Install the License</strong>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  Provide the license key to the customer, who will enter it in the Settings → License section of the application.
                  Alternatively, you can install it via the command line:
                </p>
                <div className="p-4 bg-gray-900 text-gray-100 rounded-md my-2 font-mono text-sm relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard('./bulk-signer --install-license "LICENSE-KEY-HERE"')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre>./bulk-signer --install-license "LICENSE-KEY-HERE"</pre>
                </div>
              </li>
              
              <li>
                <strong>License Renewal</strong>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  To renew an existing license, generate a new key with the same organization ID but an updated expiry date:
                </p>
                <div className="p-4 bg-gray-900 text-gray-100 rounded-md my-2 font-mono text-sm relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard('./license-tool renew --org-id "customer-org-name" --expiry "2025-12-31" --doc-limit 20000')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre>./license-tool renew --org-id "customer-org-name" --expiry "2025-12-31" --doc-limit 20000</pre>
                </div>
              </li>
            </ol>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">License Key Format</h2>
            <p className="mb-4">
              The license key follows this format:
            </p>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md mb-4">
              <p className="font-medium">Anatomy of a license key:</p>
              <code className="text-primary">XXXXX-XXXXX-XXXXX-XXXXX-XXXXX</code>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Encoded with organization ID</li>
                <li>Encoded with expiry timestamp</li>
                <li>Encoded with document limit</li>
                <li>Includes checksum for validation</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">System Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="font-medium">Minimum Requirements:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>4 CPU Cores</li>
                  <li>8 GB RAM</li>
                  <li>50 GB Storage</li>
                  <li>Ubuntu 18.04 LTS or later</li>
                  <li>PostgreSQL 12 or later</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="font-medium">Recommended Requirements:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>8 CPU Cores</li>
                  <li>16 GB RAM</li>
                  <li>100 GB SSD Storage</li>
                  <li>Ubuntu 20.04 LTS or later</li>
                  <li>PostgreSQL 14 or later</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Support and Troubleshooting</h2>
            <p className="mb-4">
              For administrator support, please contact:
            </p>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p><strong>Email:</strong> admin-support@greyswift.com</p>
              <p><strong>Phone:</strong> +91-120-XXX-XXXX</p>
              <p><strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>
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
          <a href="/api-docs">
            <Key className="mr-2 h-4 w-4" />
            API Documentation
          </a>
        </Button>
      </div>
    </div>
  );
};

export default AdminReadme;
