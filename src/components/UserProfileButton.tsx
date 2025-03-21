
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const UserProfileButton = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="p-4 border-t mt-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="font-medium truncate">{user.username}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="h-8 w-8 p-0"
          title="Log out"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserProfileButton;
