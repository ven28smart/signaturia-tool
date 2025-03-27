
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Leegality InfraSign. All rights reserved.</p>
            <p className="mt-1">Enterprise-grade document signing solution</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
