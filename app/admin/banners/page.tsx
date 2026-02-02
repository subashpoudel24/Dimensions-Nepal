"use client";

import React from "react"

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { useBanners } from "@/hooks/use-data";
import type { Banner } from "@/lib/types";

export default function BannersManagement() {
  const { data: banners, isLoading, mutate } = useBanners();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    ctaText: "",
    ctaLink: "",
    active: true,
    order: 0,
  });

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        image: banner.image,
        ctaText: banner.ctaText || "",
        ctaLink: banner.ctaLink || "",
        active: banner.active,
        order: banner.order,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        image: "",
        ctaText: "",
        ctaLink: "",
        active: true,
        order: banners?.length || 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingBanner) {
        const response = await fetch("/api/banners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editingBanner._id, ...formData }),
        });

        if (response.ok) {
          toast.success("Banner updated successfully");
          mutate();
          setIsDialogOpen(false);
        } else {
          toast.error("Failed to update banner");
        }
      } else {
        const response = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Banner created successfully");
          mutate();
          setIsDialogOpen(false);
        } else {
          toast.error("Failed to create banner");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;

    try {
      const response = await fetch(`/api/banners?id=${bannerToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Banner deleted successfully");
        mutate();
      } else {
        toast.error("Failed to delete banner");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: banner._id, active: !banner.active }),
      });

      if (response.ok) {
        toast.success(
          `Banner ${banner.active ? "hidden" : "shown"} successfully`
        );
        mutate();
      } else {
        toast.error("Failed to update banner");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const activeBanners = banners?.filter((b) => b.active).length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Banner Management</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your homepage hero section banners
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {banners?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Banners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeBanners}</p>
                <p className="text-sm text-muted-foreground">Active Banners</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-foreground text-lg">Banners</CardTitle>
          <CardDescription>
            Drag to reorder banners. Active banners will be displayed in the
            homepage hero section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {banners?.map((banner, index) => (
                <motion.div
                  key={banner._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${banner.active
                    ? "bg-secondary/10 border-primary/20"
                    : "bg-muted/30 border-border opacity-60"
                    }`}
                >
                  <div className="cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                    {banner.image ? (
                      <Image
                        src={banner.image || "/placeholder.svg"}
                        alt={banner.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-slate-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {banner.title}
                      </h3>
                      <Badge
                        variant={banner.active ? "default" : "secondary"}
                        className={
                          banner.active
                            ? "bg-green-500/10 text-green-500 border-green-500/30"
                            : ""
                        }
                      >
                        {banner.active ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                    {banner.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.ctaText && (
                      <p className="text-xs text-amber-500 mt-1">
                        Button: {banner.ctaText}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={banner.active}
                      onCheckedChange={() => handleToggleActive(banner)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenDialog(banner)}
                      className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setBannerToDelete(banner);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {banners?.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No banners created yet</p>
                <Button
                  onClick={() => handleOpenDialog()}
                  variant="outline"
                  className="mt-4 border-slate-700 text-slate-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Banner
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </DialogTitle>
            <DialogDescription>
              {editingBanner
                ? "Update banner details"
                : "Create a new hero section banner"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Enter banner title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle" className="text-foreground">
                  Subtitle
                </Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Enter subtitle (optional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">
                Banner Image
              </Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) =>
                  setFormData({ ...formData, image: url })
                }
                folder="dimension-nepal/banners"
                aspectRatio="banner"
                placeholder="Upload banner image (recommended: 1920x600)"
                maxSize={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText" className="text-foreground">
                  Button Text
                </Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaText: e.target.value })
                  }
                  placeholder="e.g., Learn More"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaLink" className="text-foreground">
                  Button Link
                </Label>
                <Input
                  id="ctaLink"
                  value={formData.ctaLink}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaLink: e.target.value })
                  }
                  placeholder="/projects or https://..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
              <div>
                <p className="font-medium text-foreground">Active Status</p>
                <p className="text-sm text-muted-foreground">
                  Show this banner on the homepage
                </p>
              </div>
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-700 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-500 hover:bg-amber-600 text-black"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    {editingBanner ? "Updating..." : "Creating..."}
                  </>
                ) : editingBanner ? (
                  "Update Banner"
                ) : (
                  "Create Banner"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Banner
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{bannerToDelete?.title}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
