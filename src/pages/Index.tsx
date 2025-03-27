
import React from 'react';
import { Link } from 'react-router-dom';
import { FileSignature, Upload, Shield, CheckSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from "framer-motion";

const Index = () => {
  const features = [
    {
      icon: <FileSignature className="w-10 h-10 text-primary" />,
      title: 'Digital Signatures',
      description: 'Sign PDF documents securely with your digital certificate',
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: 'HSM Support',
      description: 'Connect to Hardware Security Modules for enhanced security',
    },
    {
      icon: <CheckSquare className="w-10 h-10 text-primary" />,
      title: 'Audit Trails',
      description: 'Comprehensive logging of all signing activities',
    },
    {
      icon: <Zap className="w-10 h-10 text-primary" />,
      title: 'Enterprise Ready',
      description: 'Designed for high volume and security requirements',
    }
  ];

  const MotionCard = motion(Card);

  return (
    <div className="space-y-12">
      <section className="text-center py-16 md:py-24 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <FileSignature className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Enterprise-Grade Document Signing Solution
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Securely sign your PDF documents with PKCS #12 certificates or connect directly to your HSM device
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button asChild size="lg" className="rounded-full px-8 gap-2">
              <Link to="/sign">
                <FileSignature className="w-5 h-5" />
                Sign Document
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 gap-2">
              <Link to="/certificates">
                <Upload className="w-5 h-5" />
                Manage Certificates
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Everything you need for secure document signing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <MotionCard 
                key={feature.title} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
              >
                <CardHeader className="flex items-center justify-center pt-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent className="text-center pt-4">
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 dark:bg-primary/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-primary/20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Deploy our solution on your servers and start signing documents securely today.
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/sign">Sign Your First Document</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
