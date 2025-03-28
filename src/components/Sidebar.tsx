
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileSignature, Upload, History, Settings, Users, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const { hasPermission } = useUser();
  
  const navItems = [
    { name: 'Sign Document', path: '/sign', icon: <FileSignature className="w-5 h-5" />, permission: 'sign_documents' },
    { name: 'Certificate Manager', path: '/certificates', icon: <Upload className="w-5 h-5" />, permission: 'manage_certificates' },
    { name: 'Audit Logs', path: '/audit', icon: <History className="w-5 h-5" />, permission: 'view_audit' },
    { name: 'User Management', path: '/users', icon: <Users className="w-5 h-5" />, permission: 'manage_users' },
  ];

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className={cn("sidebar fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-20 transition-all duration-300", 
              collapsed && "w-16")} style={{ fontFamily: 'Lato, Raleway, HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <div className="flex items-center">
              <img src="https://www.leegality.com/static/media/logo_vertical_dark.024be63e.svg" alt="Leegality Logo" className="h-8 mr-2" />
              <span className="font-semibold text-sm">Bulk Signer</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        
        <div className="py-4 px-2 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-[#7f56d9] text-white" 
                    : "text-gray-700 hover:text-[#7f56d9] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  collapsed && "justify-center"
                )}
              >
                <span className={cn("", collapsed ? "mr-0" : "mr-3")}>{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {!collapsed && (
              <div className="text-center">
                <p>© {new Date().getFullYear()} Grey Swift Private Limited</p>
                <p>v1.0.0</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
