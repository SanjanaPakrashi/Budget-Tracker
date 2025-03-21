
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CreditCard,
  BarChart3,
  Tag
} from 'lucide-react';

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const Sidebar = () => {
  const location = useLocation();
  
  const mainItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/'
    },
    {
      title: 'Transactions',
      icon: <CreditCard className="w-5 h-5" />,
      href: '/history'
    },
    {
      title: 'Insights',
      icon: <BarChart3 className="w-5 h-5" />,
      href: '/insights'
    }
  ];

  const NavItem = ({ item }: { item: SidebarItem }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link 
        to={item.href} 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        {item.icon}
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <aside className="h-screen w-60 border-r flex flex-col gap-6 p-4">
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-semibold">BT</span>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Budget Tracker</h2>
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        {mainItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
