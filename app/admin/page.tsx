"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FolderKanban,
  Wrench,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
  Eye,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProjects, useServices, useContacts, useUsers } from '@/hooks/use-data';

export default function AdminDashboard() {
  const { data: projects } = useProjects();
  const { data: services } = useServices();
  const { data: contacts } = useContacts();
  const { data: users } = useUsers();

  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      href: '/admin/projects',
      change: '+12%',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Services',
      value: services?.length || 0,
      icon: Wrench,
      href: '/admin/services',
      change: '+3',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Messages',
      value: contacts?.length || 0,
      icon: MessageSquare,
      href: '/admin/contacts',
      change: '+5 new',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Users',
      value: users?.length || 0,
      icon: Users,
      href: '/admin/users',
      change: '+2',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  const recentContacts = contacts?.slice(0, 5) || [];
  const recentProjects = projects?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your construction company.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={stat.href}>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-col gap-1">
                    <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    View Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 py-4">
              <CardTitle className="text-lg font-bold text-foreground">Recent Messages</CardTitle>
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary font-semibold">
                <Link href="/admin/contacts">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {recentContacts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No messages yet</p>
                ) : (
                  recentContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <span className="text-primary font-bold">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 border-none">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {contact.name}
                          </p>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${contact.status === 'new'
                                ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                : contact.status === 'read'
                                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                  : 'bg-green-500/10 text-green-600 border border-green-500/20'
                              }`}
                          >
                            {contact.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/80 truncate font-medium mt-0.5">{contact.email}</p>
                        <p className="text-sm text-foreground/80 mt-2 line-clamp-1 italic">
                          "{contact.message}"
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 py-4">
              <CardTitle className="text-lg font-bold text-foreground">Recent Projects</CardTitle>
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary font-semibold">
                <Link href="/admin/projects">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {recentProjects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-12">No projects yet</p>
                ) : (
                  recentProjects.map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-border shadow-sm">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {project.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-muted-foreground uppercase tracking-tight">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {project.category}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3" />
                            {project.completionDate}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'completed'
                            ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                            : project.status === 'ongoing'
                              ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/30 py-4">
            <CardTitle className="text-lg font-bold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                <Link href="/admin/projects">Add New Project</Link>
              </Button>
              <Button variant="outline" asChild className="border-primary/20 text-primary hover:bg-primary/5 transition-all hover:scale-105 active:scale-95">
                <Link href="/admin/services">Add New Service</Link>
              </Button>
              <Button variant="outline" asChild className="border-border hover:bg-muted transition-all hover:scale-105 active:scale-95">
                <Link href="/admin/banners">Manage Banners</Link>
              </Button>
              <Button variant="outline" asChild className="border-border hover:bg-muted transition-all hover:scale-105 active:scale-95">
                <Link href="/admin/settings">Update Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
