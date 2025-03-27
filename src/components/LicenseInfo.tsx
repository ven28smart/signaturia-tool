
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { OrganizationLicense } from '@/types/user';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, differenceInDays } from 'date-fns';
import { AlertCircle, CheckCircle, Info, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface LicenseInfoProps {
  license: OrganizationLicense;
  onActivateLicense: (licenseKey: string) => void;
}

const LicenseInfo: React.FC<LicenseInfoProps> = ({ license, onActivateLicense }) => {
  const [newLicenseKey, setNewLicenseKey] = React.useState('');
  
  // Calculate remaining days
  const today = new Date();
  const expiryDate = new Date(license.expiryDate);
  const remainingDays = differenceInDays(expiryDate, today);
  const isExpired = remainingDays < 0;
  
  // Calculate document usage percentage
  const documentUsagePercent = license.totalDocuments > 0 
    ? Math.min(100, Math.round((license.usedDocuments / license.totalDocuments) * 100))
    : 0;
  
  // Calculate time usage percentage
  const startDate = new Date(license.issuedDate);
  const totalDays = differenceInDays(expiryDate, startDate);
  const elapsedDays = differenceInDays(today, startDate);
  const timeUsagePercent = totalDays > 0 
    ? Math.min(100, Math.round((elapsedDays / totalDays) * 100))
    : 0;

  const handleActivateLicense = () => {
    if (!newLicenseKey.trim()) {
      toast.error('Please enter a license key');
      return;
    }
    
    onActivateLicense(newLicenseKey);
    setNewLicenseKey('');
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">License Information</CardTitle>
            <CardDescription>Manage your digital signature license</CardDescription>
          </div>
          <div className="p-1 bg-primary/10 rounded-full">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {license.isActive ? (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-600">License Active</span>
              <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs ml-auto">
                {isExpired ? 'EXPIRED' : 'ACTIVE'}
              </span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">License Key</span>
                <span className="font-mono text-primary">{license.licenseKey.substring(0, 10)}...{license.licenseKey.substring(license.licenseKey.length - 5)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Issued Date</span>
                <span>{format(new Date(license.issuedDate), 'MMM dd, yyyy')}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expiry Date</span>
                <span className={isExpired ? 'text-red-600 font-medium' : ''}>{format(new Date(license.expiryDate), 'MMM dd, yyyy')}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Documents</span>
                <span>{license.usedDocuments} of {license.totalDocuments}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Document Usage</span>
                  <span>{documentUsagePercent}%</span>
                </div>
                <Progress value={documentUsagePercent} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>License Period</span>
                  <span>{isExpired ? 'Expired' : `${remainingDays} days remaining`}</span>
                </div>
                <Progress value={timeUsagePercent} className="h-2" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {license.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium"
                >
                  {feature}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="bg-yellow-50 p-4 rounded-full inline-flex">
              <AlertCircle className="w-10 h-10 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold">No Active License</h3>
            <p className="text-gray-600 text-sm">
              Please activate a license to use all features of the application
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            {license.isActive 
              ? `You can sign ${license.totalDocuments - license.usedDocuments} more documents before ${format(new Date(license.expiryDate), 'MMM dd, yyyy')}.`
              : 'Contact your administrator to obtain a license key.'}
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Activate New License</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Activate License</DialogTitle>
              <DialogDescription>
                Enter your license key to activate or extend your license.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="license-key">License Key</Label>
                <Input 
                  id="license-key" 
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                  value={newLicenseKey}
                  onChange={(e) => setNewLicenseKey(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleActivateLicense}>
                Activate License
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default LicenseInfo;
