
import React, { useState, useEffect } from 'react';
import LicenseInfo from './LicenseInfo';
import { OrganizationLicense, validateLicenseKey } from '@/types/user';
import { toast } from 'sonner';

// Local storage key for license data
const LICENSE_STORAGE_KEY = 'org_license_data';

const LicenseManager: React.FC = () => {
  const [license, setLicense] = useState<OrganizationLicense>(() => {
    // Try to load license from localStorage
    const savedLicense = localStorage.getItem(LICENSE_STORAGE_KEY);
    if (savedLicense) {
      try {
        return JSON.parse(savedLicense);
      } catch (e) {
        console.error('Failed to parse saved license:', e);
      }
    }
    
    // Return default empty license
    return {
      licenseKey: '',
      issuedDate: new Date().toISOString(),
      expiryDate: new Date().toISOString(),
      totalDocuments: 0,
      usedDocuments: 0,
      isActive: false,
      features: []
    };
  });

  useEffect(() => {
    // Save license to localStorage whenever it changes
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(license));
  }, [license]);

  // In a real application, this would communicate with a server
  // For this standalone version, we're implementing client-side validation
  // which isn't truly secure but demonstrates the concept
  const handleActivateLicense = (licenseKey: string) => {
    const validationResult = validateLicenseKey(licenseKey);
    
    if (!validationResult.isValid) {
      toast.error('Invalid license key. Please check and try again.');
      return;
    }
    
    // Create new license object
    const newLicense: OrganizationLicense = {
      licenseKey: licenseKey,
      issuedDate: new Date().toISOString(),
      expiryDate: validationResult.expiryDate!.toISOString(),
      totalDocuments: validationResult.totalDocuments || 0,
      usedDocuments: 0,
      isActive: true,
      features: ['Digital Signatures', 'Certificate Management', 'Audit Logs']
    };
    
    setLicense(newLicense);
    toast.success('License activated successfully');
  };

  // Function to increment document count when signing
  const incrementDocumentCount = () => {
    // Check if license is active and has remaining documents
    if (!license.isActive) {
      toast.error('No active license. Please activate a license to sign documents.');
      return false;
    }
    
    const expiryDate = new Date(license.expiryDate);
    if (expiryDate < new Date()) {
      toast.error('Your license has expired. Please activate a new license.');
      return false;
    }
    
    if (license.usedDocuments >= license.totalDocuments) {
      toast.error('You have reached the maximum number of documents allowed by your license.');
      return false;
    }
    
    // Increment used documents count
    setLicense(prev => ({
      ...prev,
      usedDocuments: prev.usedDocuments + 1
    }));
    
    return true;
  };

  // Register license checking function globally
  useEffect(() => {
    // @ts-ignore
    window.checkLicenseForSigning = incrementDocumentCount;
  }, [license]);

  return <LicenseInfo license={license} onActivateLicense={handleActivateLicense} />;
};

export default LicenseManager;
