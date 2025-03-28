
import React from 'react';
import { Link } from 'react-router-dom';
import { FileSignature, Upload, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-16 md:py-24 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FileSignature className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Leegality Bulk Signer On-prem
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Securely sign your PDF documents with PKCS #12 certificates or connect directly to your HSM device
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button asChild size="lg" className="rounded-md px-8 gap-2">
              <Link to="/sign">
                <FileSignature className="w-5 h-5" />
                Sign Document
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-md px-8 gap-2">
              <Link to="/certificates">
                <Upload className="w-5 h-5" />
                Manage Certificates
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-2">Grey Swift Private Limited</h2>
          <p>Leegality Bulk Signer On-prem v1.0.0</p>
        </div>
      </section>
    </div>
  );
};

export default Index;
