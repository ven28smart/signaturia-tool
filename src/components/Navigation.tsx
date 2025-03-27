
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileSignature, Upload, Settings, History, Home } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Sign Document', path: '/sign', icon: <FileSignature className="w-5 h-5" /> },
    { name: 'Certificate Manager', path: '/certificates', icon: <Upload className="w-5 h-5" /> },
    { name: 'Audit Logs', path: '/audit', icon: <History className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 z-10 w-full bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink to="/" className="text-primary font-bold text-xl flex items-center">
                <FileSignature className="w-6 h-6 mr-2" />
                <span>DocSign</span>
              </NavLink>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Mobile menu button */}
            <button className="glass-button p-2 rounded-md text-gray-700 dark:text-gray-300">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
