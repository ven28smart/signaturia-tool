
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';
import { cn } from '@/lib/utils';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <TopNavigation />
      
      <main className={cn(
        "transition-all duration-300 pt-16 pb-16 px-4 sm:px-6 lg:px-8",
        sidebarCollapsed ? "ml-0" : "ml-64"
      )}>
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
      
      <footer className={cn(
        "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800 py-6 transition-all duration-300",
        sidebarCollapsed ? "ml-0" : "ml-64"
      )}>
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Grey Swift Private Limited. All rights reserved.</p>
            <p className="mt-1">Leegality Bulk Signer On-prem</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
