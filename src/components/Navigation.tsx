
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileSignature, Upload, Settings, History, Home, Menu, Users } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUser } from '@/contexts/UserContext';

const Navigation = () => {
  const { hasPermission } = useUser();
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Sign Document', path: '/sign', icon: <FileSignature className="w-5 h-5" />, permission: 'sign_documents' },
    { name: 'Certificate Manager', path: '/certificates', icon: <Upload className="w-5 h-5" />, permission: 'manage_certificates' },
    { name: 'Audit Logs', path: '/audit', icon: <History className="w-5 h-5" />, permission: 'view_audit' },
    { name: 'User Management', path: '/users', icon: <Users className="w-5 h-5" />, permission: 'manage_users' },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" />, permission: 'manage_settings' },
  ];

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <nav className="fixed top-0 z-10 w-full bg-white shadow-sm dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink to="/" className="text-primary font-bold text-xl flex items-center">
                <svg
                  className="w-8 h-8 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18H17V16H7V18ZM7 14H17V12H7V14ZM7 10H17V8H7V10ZM5 22C4.45 22 3.979 21.804 3.587 21.412C3.195 21.02 2.999 20.55 3 20V4C3 3.45 3.196 2.979 3.588 2.587C3.98 2.195 4.45 1.999 5 2H19C19.55 2 20.021 2.196 20.413 2.588C20.805 2.98 21.001 3.45 21 4V20C21 20.55 20.804 21.021 20.412 21.413C20.02 21.805 19.55 22.001 19 22H5ZM5 20H19V4H5V20Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Document Signer</span>
              </NavLink>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {filteredNavItems.map((item) => (
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
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md text-gray-700 dark:text-gray-300">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="py-4">
                  <div className="flex items-center px-4 mb-6">
                    <svg
                      className="w-8 h-8 mr-2 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 18H17V16H7V18ZM7 14H17V12H7V14ZM7 10H17V8H7V10ZM5 22C4.45 22 3.979 21.804 3.587 21.412C3.195 21.02 2.999 20.55 3 20V4C3 3.45 3.196 2.979 3.588 2.587C3.98 2.195 4.45 1.999 5 2H19C19.55 2 20.021 2.196 20.413 2.588C20.805 2.98 21.001 3.45 21 4V20C21 20.55 20.804 21.021 20.412 21.413C20.02 21.805 19.55 22.001 19 22H5ZM5 20H19V4H5V20Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="font-semibold text-lg">Document Signer</span>
                  </div>
                  <div className="px-2 pt-2 pb-4 space-y-1">
                    {filteredNavItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                          "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                        )}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
