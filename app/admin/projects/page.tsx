"use client";

import React from "react"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  Calendar,
  Building2,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useProjects } from '@/hooks/use-data';
import { toast } from 'sonner';
import type { Project } from '@/lib/types';

const statusColors: Record<string, string> = {
  completed: 'bg-green-500/10 text-green-600 border-green-500/20',
  ongoing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  upcoming: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

const defaultProject: Partial<Project> = {
  title: '',
  description: '',
  category: 'Residential',
  image: '',
  location: '',
  client: '',
  completionDate: '',
  status: 'upcoming',
  featured: false,
};

export default function ProjectsManagement() {
  const { data: projects, mutate } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
    } else {
      setEditingProject({ ...defaultProject });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsSubmitting(true);
    try {
      const method = editingProject._id ? 'PUT' : 'POST';
      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingProject._id ? 'Project updated!' : 'Project created!');
        mutate();
        handleCloseModal();
      } else {
        toast.error(data.error || 'Failed to save project');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      const res = await fetch(`/api/projects?id=${projectToDelete}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Project deleted!');
        mutate();
      } else {
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Projects Portfolio</h2>
          <p className="text-muted-foreground text-sm">Manage and showcase your construction projects</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search projects by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-card border-border/50 focus:bg-background transition-all"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="overflow-hidden group border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border hover:shadow-xl hover:ring-primary/20 transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusColors[project.status])}>
                    {project.status}
                  </Badge>
                  {project.featured && (
                    <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border-primary/20">Featured</Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground shadow-lg"
                    onClick={() => handleOpenModal(project)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-600 shadow-lg"
                    onClick={() => {
                      setProjectToDelete(project._id || '');
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{project.category}</span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-medium leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-4 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-tight pt-4 border-t border-border/50">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {project.completionDate}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects?.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No projects found</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  {editingProject._id ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingProject.title || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editingProject.category || 'Residential'}
                      onValueChange={(value) =>
                        setEditingProject({ ...editingProject, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Hospitality">Hospitality</SelectItem>
                        <SelectItem value="Renovation">Renovation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={editingProject.description || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Image</Label>
                  <ImageUpload
                    value={editingProject.image || ''}
                    onChange={(url) =>
                      setEditingProject({ ...editingProject, image: url })
                    }
                    folder="dimension-nepal/projects"
                    aspectRatio="video"
                    placeholder="Upload project image"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editingProject.location || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, location: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      value={editingProject.client || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, client: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Completion Date</Label>
                    <Input
                      id="completionDate"
                      value={editingProject.completionDate || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, completionDate: e.target.value })
                      }
                      placeholder="2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editingProject.status || 'upcoming'}
                      onValueChange={(value: 'completed' | 'ongoing' | 'upcoming') =>
                        setEditingProject({ ...editingProject, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={editingProject.featured || false}
                    onCheckedChange={(checked) =>
                      setEditingProject({ ...editingProject, featured: checked })
                    }
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingProject._id ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
