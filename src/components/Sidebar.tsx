
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
    <div className={cn("sidebar", collapsed && "sidebar-collapsed")}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <div className="flex items-center">
              <img src="https://cdn.leegality.com/UI/Logo/Leegality.svg" alt="Leegality Logo" className="h-8 mr-2" />
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
                  "sidebar-item",
                  isActive && "active"
                )}
              >
                <span className="mr-3">{item.icon}</span>
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
