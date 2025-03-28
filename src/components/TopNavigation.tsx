
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserProfile from './UserProfile';
import { cn } from '@/lib/utils';

interface TopNavigationProps {
  sidebarCollapsed?: boolean;
}

const TopNavigation = ({ sidebarCollapsed = false }: TopNavigationProps) => {
  return (
    <div className={cn(
      "fixed top-0 right-0 z-10 h-16 bg-white shadow-sm dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 flex items-center",
      sidebarCollapsed ? "left-0" : "left-64"
    )} style={{ fontFamily: 'Lato, Raleway, HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div className="flex items-center justify-between w-full px-4">
        <div className="md:hidden">
          {/* Mobile logo - only visible when sidebar is collapsed on mobile */}
          {sidebarCollapsed && (
            <Link to="/" className="flex items-center">
              <img src="https://www.leegality.com/static/media/logo_vertical_dark.024be63e.svg" alt="Leegality Logo" className="h-8" />
              <span className="ml-2 font-semibold text-lg">Bulk Signer</span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
          >
            <Link to="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
