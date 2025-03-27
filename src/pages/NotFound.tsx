
import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-lg px-4"
      >
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
          <FileQuestion className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          We couldn't find the page you're looking for. The page might have been moved or deleted.
        </p>
        
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
