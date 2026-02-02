"use client";

import React from "react"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  GripVertical,
  Home,
  Building2,
  Truck,
  Hammer,
  Palette,
  ClipboardList,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { ImageUpload } from '@/components/ui/image-upload';
import { useServices } from '@/hooks/use-data';
import { toast } from 'sonner';
import type { Service } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Building2,
  Truck,
  Hammer,
  Palette,
  ClipboardList,
};

const iconOptions = ['Home', 'Building2', 'Truck', 'Hammer', 'Palette', 'ClipboardList'];

const defaultService: Partial<Service> = {
  title: '',
  description: '',
  icon: 'Home',
  features: [''],
  image: '',
  featured: false,
  order: 1,
};

export default function ServicesManagement() {
  const { data: services, mutate } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredServices = services?.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService({ ...service });
    } else {
      setEditingService({ ...defaultService, order: (services?.length || 0) + 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingService) return;
    const newFeatures = [...(editingService.features || [])];
    newFeatures[index] = value;
    setEditingService({ ...editingService, features: newFeatures });
  };

  const addFeature = () => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      features: [...(editingService.features || []), ''],
    });
  };

  const removeFeature = (index: number) => {
    if (!editingService) return;
    const newFeatures = (editingService.features || []).filter((_, i) => i !== index);
    setEditingService({ ...editingService, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    // Filter out empty features
    const cleanedService = {
      ...editingService,
      features: editingService.features?.filter((f) => f.trim() !== ''),
    };

    setIsSubmitting(true);
    try {
      const method = editingService._id ? 'PUT' : 'POST';
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedService),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingService._id ? 'Service updated!' : 'Service created!');
        mutate();
        handleCloseModal();
      } else {
        toast.error(data.error || 'Failed to save service');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const res = await fetch(`/api/services?id=${serviceToDelete}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Service deleted!');
        mutate();
      } else {
        toast.error(data.error || 'Failed to delete service');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Our Services</h2>
          <p className="text-muted-foreground text-sm">Manage the services your company provides</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search services by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-card border-border/50 focus:bg-background transition-all"
        />
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices?.map((service, index) => {
          const IconComponent = iconMap[service.icon] || Building2;

          return (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden group border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border hover:shadow-xl hover:ring-primary/20 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-stretch flex-col md:flex-row">
                    <div className="w-full md:w-56 aspect-video md:aspect-[4/3] relative flex-shrink-0 overflow-hidden">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent md:hidden" />
                    </div>
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/10">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{service.title}</h3>
                              <div className="flex items-center gap-3 mt-1.5">
                                {service.featured && (
                                  <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-primary/20">Featured</Badge>
                                )}
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-full ring-1 ring-border">Order: {service.order}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-9 h-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => handleOpenModal(service)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-9 h-9 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                              onClick={() => {
                                setServiceToDelete(service._id || '');
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground/80 mt-4 line-clamp-2 font-medium leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/50">
                        {service.features?.slice(0, 4).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-tight border border-primary/10"
                          >
                            {feature}
                          </span>
                        ))}
                        {(service.features?.length || 0) > 4 && (
                          <span className="px-2 py-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center">
                            +{(service.features?.length || 0) - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredServices?.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No services found</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && editingService && (
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
                  {editingService._id ? 'Edit Service' : 'Add New Service'}
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
                      value={editingService.title || ''}
                      onChange={(e) =>
                        setEditingService({ ...editingService, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={editingService.icon || 'Home'}
                      onValueChange={(value) =>
                        setEditingService({ ...editingService, icon: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => {
                          const Icon = iconMap[icon] || Building2;
                          return (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {icon}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={editingService.description || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Service Image</Label>
                  <ImageUpload
                    value={editingService.image || ''}
                    onChange={(url) =>
                      setEditingService({ ...editingService, image: url })
                    }
                    folder="dimension-nepal/services"
                    aspectRatio="video"
                    placeholder="Upload service image"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Features</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Feature
                    </Button>
                  </div>
                  {editingService.features?.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min={1}
                      value={editingService.order || 1}
                      onChange={(e) =>
                        setEditingService({ ...editingService, order: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <Switch
                      id="featured"
                      checked={editingService.featured || false}
                      onCheckedChange={(checked) =>
                        setEditingService({ ...editingService, featured: checked })
                      }
                    />
                    <Label htmlFor="featured">Featured Service</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingService._id ? 'Update' : 'Create'}
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
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
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
