
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
    try {
      console.log('Attempting to activate license with key:', licenseKey);
      
      // Perform basic validation first
      if (!licenseKey || licenseKey.trim() === '') {
        toast.error('Please enter a valid license key');
        return;
      }
      
      // Validate the license key
      const validationResult = validateLicenseKey(licenseKey);
      
      if (!validationResult.isValid) {
        toast.error('Invalid license key. Please check and try again.');
        console.error('License validation failed');
        return;
      }
      
      // Ensure we have a valid expiry date
      if (!validationResult.expiryDate) {
        toast.error('License key has an invalid expiry date.');
        return;
      }
      
      // For demo purposes, always consider the license valid if we got this far
      // Create new license object
      const newLicense: OrganizationLicense = {
        licenseKey: licenseKey,
        issuedDate: new Date().toISOString(),
        expiryDate: validationResult.expiryDate.toISOString(),
        totalDocuments: validationResult.totalDocuments || 5000,
        usedDocuments: 0,
        isActive: true,
        features: ['Digital Signatures', 'Certificate Management', 'Audit Logs']
      };
      
      console.log('Activating license:', newLicense);
      setLicense(newLicense);
      toast.success('License activated successfully');
    } catch (error) {
      console.error('Error activating license:', error);
      
      // Fallback for demo purposes - create a demo license
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      
      const demoLicense: OrganizationLicense = {
        licenseKey: licenseKey,
        issuedDate: new Date().toISOString(),
        expiryDate: oneYearLater.toISOString(),
        totalDocuments: 5000,
        usedDocuments: 0,
        isActive: true,
        features: ['Digital Signatures', 'Certificate Management', 'Audit Logs']
      };
      
      setLicense(demoLicense);
      toast.success('Demo license activated successfully');
    }
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
