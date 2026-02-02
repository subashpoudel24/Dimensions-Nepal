"use client";

import React from "react"

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ImageIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-data";
import type { Settings } from "@/lib/types";

export default function SettingsPage() {
  const { data: settings, isLoading, mutate } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Settings>>({
    companyName: "Dimension Nepal",
    tagline: "Building Dreams, Constructing Futures",
    logo: "",
    favicon: "",
    email: "info@dimensionnepal.com",
    phone: "+977-1-4567890",
    address: "Kathmandu, Nepal",
    mapUrl: "",
    workingHours: "Sun - Fri: 9:00 AM - 6:00 PM",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    footerText: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        _id: settings._id,
        companyName: settings.companyName || "Dimension Nepal",
        tagline: settings.tagline || "Building Dreams, Constructing Futures",
        logo: settings.logo || "",
        favicon: settings.favicon || "",
        email: settings.email || "info@dimensionnepal.com",
        phone: settings.phone || "+977-1-4567890",
        address: settings.address || "Kathmandu, Nepal",
        mapUrl: settings.mapUrl || "",
        workingHours: settings.workingHours || "Sun - Fri: 9:00 AM - 6:00 PM",
        socialLinks: settings.socialLinks || {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
        },
        footerText: settings.footerText || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Settings updated successfully");
        mutate();
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Site Configuration</h2>
          <p className="text-muted-foreground text-sm">
            Manage your corporate identity and global preferences
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-11"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-8">
          <TabsList className="bg-muted/50 border border-border/50 p-1.5 h-14 rounded-2xl gap-2">
            <TabsTrigger
              value="general"
              className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 font-bold transition-all"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 font-bold transition-all"
            >
              Contact Details
            </TabsTrigger>
            <TabsTrigger
              value="branding"
              className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 font-bold transition-all"
            >
              Identity
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="rounded-xl px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 font-bold transition-all"
            >
              Social Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="motion-safe:animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-8">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  General Information
                </CardTitle>
                <CardDescription className="text-sm font-medium ml-12">
                  Basic administrative details for your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="companyName" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Company Brand Name
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      className="bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                      placeholder="e.g. Dimension Nepal"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="tagline" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Corporate Tagline
                    </Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) =>
                        setFormData({ ...formData, tagline: e.target.value })
                      }
                      className="bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                      placeholder="e.g. Building Dreams"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="footerText" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Global Footer Narrative
                  </Label>
                  <Textarea
                    id="footerText"
                    value={formData.footerText}
                    onChange={(e) =>
                      setFormData({ ...formData, footerText: e.target.value })
                    }
                    className="bg-muted/50 border-border rounded-xl min-h-[120px] focus-visible:ring-primary/50 text-foreground font-medium p-4 leading-relaxed"
                    placeholder="Enter descriptive footer text that appears everywhere..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="motion-safe:animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-8">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  Global Contact Registry
                </CardTitle>
                <CardDescription className="text-sm font-medium ml-12">
                  Official contact channels displayed on your public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Primary Communications Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-11 bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                        placeholder="e.g. info@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Direct Hotline Number
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="pl-11 bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                        placeholder="e.g. +977-1-4567890"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Physical Headquarters Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="bg-muted/50 border-border rounded-xl min-h-[100px] focus-visible:ring-primary/50 text-foreground font-medium p-4"
                    placeholder="Enter full street address, city, and country..."
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mapUrl" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Google Maps Integration Protocol (Embed URL)
                  </Label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="mapUrl"
                      value={formData.mapUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, mapUrl: e.target.value })
                      }
                      className="pl-11 bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/50 ml-1">
                    Securely paste the iframe 'src' attribute from Google Maps 'Share' &gt; 'Embed'
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="workingHours" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Active Operational Hours
                  </Label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="workingHours"
                      value={formData.workingHours}
                      onChange={(e) =>
                        setFormData({ ...formData, workingHours: e.target.value })
                      }
                      className="pl-11 bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                      placeholder="e.g. Mon - Fri: 09:00 - 18:00"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="motion-safe:animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-8">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/10">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  Visual Identity Assets
                </CardTitle>
                <CardDescription className="text-sm font-medium ml-12">
                  Configure corporate logos, favicons, and visual representations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Corporate Signature Logo
                      </Label>
                      <p className="text-[11px] font-bold text-muted-foreground/50 mb-4 ml-1">
                        SVG or high-res PNG recommended for maximum clarity
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-2xl ring-1 ring-border shadow-inner">
                      <ImageUpload
                        value={formData.logo || ''}
                        onChange={(url) =>
                          setFormData({ ...formData, logo: url })
                        }
                        folder="dimension-nepal/branding"
                        aspectRatio="video"
                        placeholder="Upload Branding Logo"
                        maxSize={5}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Browser Environment Icon (Favicon)
                      </Label>
                      <p className="text-[11px] font-bold text-muted-foreground/50 mb-4 ml-1">
                        Strictly 1:1 ratio needed (e.g. 512x512px)
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-2xl ring-1 ring-border shadow-inner max-w-xs">
                      <ImageUpload
                        value={formData.favicon || ''}
                        onChange={(url) =>
                          setFormData({ ...formData, favicon: url })
                        }
                        folder="dimension-nepal/branding"
                        aspectRatio="square"
                        placeholder="Upload Favicon"
                        maxSize={1}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="motion-safe:animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/50 px-8 py-8">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  Social Connectivity Matrix
                </CardTitle>
                <CardDescription className="text-sm font-medium ml-12">
                  Synchronize your active social media channels for better outreach
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Facebook className="h-3.5 w-3.5 text-blue-600 shadow-sm" />
                      Facebook Core
                    </Label>
                    <Input
                      value={formData.socialLinks?.facebook || ""}
                      onChange={(e) =>
                        handleSocialLinkChange("facebook", e.target.value)
                      }
                      className="bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                      placeholder="https://facebook.com/yourbrand"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Twitter className="h-3.5 w-3.5 text-sky-400 shadow-sm" />
                      Twitter / X Network
                    </Label>
                    <Input
                      value={formData.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        handleSocialLinkChange("twitter", e.target.value)
                      }
                      className="bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Instagram className="h-3.5 w-3.5 text-pink-500 shadow-sm" />
                      Instagram Showcase
                    </Label>
                    <Input
                      value={formData.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        handleSocialLinkChange("instagram", e.target.value)
                      }
                      className="bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                      placeholder="https://instagram.com/yourstyle"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                      <Linkedin className="h-3.5 w-3.5 text-blue-700 shadow-sm" />
                      LinkedIn Corporate
                    </Label>
                    <Input
                      value={formData.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        handleSocialLinkChange("linkedin", e.target.value)
                      }
                      className="bg-muted/50 border-border rounded-xl h-12 focus-visible:ring-primary/50 text-foreground font-medium"
                      placeholder="https://linkedin.com/company/yourcorporation"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
