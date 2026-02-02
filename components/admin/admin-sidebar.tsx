"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  MessageSquare,
  Users,
  Settings,
  ImageIcon,
  Home,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useSettings } from '@/hooks/use-data';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Services', href: '/admin/services', icon: Wrench },
  { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: settings } = useSettings();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border shadow-2xl transition-all duration-500 ease-in-out flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border/50 bg-sidebar/50 backdrop-blur-sm">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
            {settings?.logo ? (
              <img src={settings.logo} alt={settings.companyName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-foreground font-black text-xl italic">D</span>
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="font-extrabold text-sm leading-tight text-sidebar-foreground tracking-tight truncate max-w-[120px]">
                {settings?.companyName || "Dimension Nepal"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/50">
                Admin Center
              </span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
              )} />
              {!isCollapsed && (
                <span className="relative z-10">{item.name}</span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-white rounded-full"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border/50 space-y-3 bg-sidebar/30 backdrop-blur-sm">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-300',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'View Website' : undefined}
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>View Website</span>}
        </Link>

        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-sidebar-accent/30 border border-sidebar-border/30">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-inner">
              <span className="text-primary font-black text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-sidebar-foreground truncate tracking-tight">{user?.name}</p>
              <p className="text-[10px] text-sidebar-foreground/50 uppercase font-black tracking-widest leading-none mt-0.5">{user?.role}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start gap-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-bold">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
