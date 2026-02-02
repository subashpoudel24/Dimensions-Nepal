"use client";

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn('hidden lg:block', isMobileMenuOpen && 'block')}>
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-40 transform transition-transform duration-300',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <AdminSidebar
          isCollapsed={false}
          onToggle={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Header */}
      <AdminHeader
        isCollapsed={isCollapsed}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Content */}
      <main
        className={cn(
          'pt-20 min-h-screen transition-all duration-500 ease-in-out bg-muted/10',
          isCollapsed ? 'lg:pl-24' : 'lg:pl-72'
        )}
      >
        <div className="p-8 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
