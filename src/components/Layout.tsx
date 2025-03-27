
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} DocSign. All rights reserved.</p>
            <p className="mt-1">Enterprise-grade document signing solution</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
