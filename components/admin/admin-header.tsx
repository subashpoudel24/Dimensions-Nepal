"use client";

import { usePathname } from 'next/navigation';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/projects': 'Projects',
  '/admin/services': 'Services',
  '/admin/contacts': 'Contact Messages',
  '/admin/banners': 'Banner Management',
  '/admin/users': 'User Management',
  '/admin/settings': 'Settings',
};

interface AdminHeaderProps {
  isCollapsed: boolean;
  onMenuClick: () => void;
}

export function AdminHeader({ isCollapsed, onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = pageTitles[pathname] || 'Admin Panel';

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-20 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-500',
        isCollapsed ? 'left-24' : 'left-72'
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">{pageTitle}</h1>
            <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
              Construction Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search anything..."
              className="pl-10 w-72 bg-muted/50 border-border/50 focus:bg-background transition-all duration-300 rounded-xl"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors rounded-xl">
            <Bell className="w-5 h-5 text-muted-foreground hover:text-primary" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>

          <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-border/50">
            <div className="flex flex-col items-end hidden md:flex">
              <p className="text-sm font-bold text-foreground leading-none">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
