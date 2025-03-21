
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import UserProfileButton from './UserProfileButton';
import CurrencySelector from './CurrencySelector';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="h-full flex flex-col">
        <Sidebar />
        <div className="mt-auto flex flex-col px-4 pb-4">
          <CurrencySelector />
          <div className="mt-4">
            <UserProfileButton />
          </div>
        </div>
      </div>
      <main className={cn("flex-1 overflow-auto p-6", className)}>
        <div className="mx-auto max-w-7xl animate-fade-in">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
