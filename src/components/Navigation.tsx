
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
              <NavLink to="/" className="text-primary-500 font-bold text-xl flex items-center">
                {/* Leegality logo SVG */}
                <svg
                  className="w-8 h-8 mr-2"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.6667 5.33334H5.33334C3.86667 5.33334 2.68001 6.53334 2.68001 8.00001L2.66667 24C2.66667 25.4667 3.86667 26.6667 5.33334 26.6667H26.6667C28.1333 26.6667 29.3333 25.4667 29.3333 24V8.00001C29.3333 6.53334 28.1333 5.33334 26.6667 5.33334ZM26.6667 24H5.33334V16H26.6667V24ZM26.6667 12H5.33334V8.00001H26.6667V12Z"
                    fill="#007BFF"
                  />
                </svg>
                <span className="font-semibold">Leegality <span className="font-light">InfraSign</span></span>
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
                      ? "text-primary-500 bg-primary-50"
                      : "text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-white"
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
                      className="w-8 h-8 mr-2 text-primary-500"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M26.6667 5.33334H5.33334C3.86667 5.33334 2.68001 6.53334 2.68001 8.00001L2.66667 24C2.66667 25.4667 3.86667 26.6667 5.33334 26.6667H26.6667C28.1333 26.6667 29.3333 25.4667 29.3333 24V8.00001C29.3333 6.53334 28.1333 5.33334 26.6667 5.33334ZM26.6667 24H5.33334V16H26.6667V24ZM26.6667 12H5.33334V8.00001H26.6667V12Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="font-semibold text-lg">Leegality <span className="font-light">InfraSign</span></span>
                  </div>
                  <div className="px-2 pt-2 pb-4 space-y-1">
                    {filteredNavItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                          "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                          isActive
                            ? "text-primary-500 bg-primary-50"
                            : "text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-white"
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
