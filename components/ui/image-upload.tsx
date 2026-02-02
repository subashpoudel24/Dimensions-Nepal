"use client";

import React from "react"

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary, type UploadOptions } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "banner" | "portrait";
  maxSize?: number; // in MB
  disabled?: boolean;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "dimension-nepal",
  className,
  aspectRatio = "video",
  maxSize = 10,
  disabled = false,
  placeholder = "Click or drag to upload image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[21/9]",
    portrait: "aspect-[3/4]",
  };

  const handleUpload = useCallback(
    async (file: File) => {
      if (disabled) return;

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      try {
        const options: UploadOptions = {
          folder,
          maxFileSize: maxSize * 1024 * 1024,
        };

        const result = await uploadToCloudinary(file, options);
        setUploadProgress(100);
        onChange(result.secure_url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        clearInterval(progressInterval);
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [disabled, folder, maxSize, onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
      // Reset input so the same file can be selected again
      e.target.value = "";
    },
    [handleUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleUpload(file);
      } else {
        setError("Please drop an image file");
      }
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemove = useCallback(() => {
    onChange("");
    onRemove?.();
    setError(null);
  }, [onChange, onRemove]);

  return (
    <div className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "relative rounded-lg overflow-hidden border border-border bg-muted",
              aspectRatioClasses[aspectRatio]
            )}
          >
            <Image
              src={value || "/placeholder.svg"}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                <Upload className="h-4 w-4 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            className={cn(
              "relative rounded-lg border-2 border-dashed transition-all cursor-pointer",
              aspectRatioClasses[aspectRatio],
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
              disabled && "opacity-50 cursor-not-allowed",
              isUploading && "cursor-wait"
            )}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
              {isUploading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <div className="space-y-2 w-full max-w-[200px]">
                    <p className="text-sm font-medium text-foreground">Uploading...</p>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      isDragging ? "bg-primary/20" : "bg-muted"
                    )}
                  >
                    {isDragging ? (
                      <Upload className="h-8 w-8 text-primary" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {isDragging ? "Drop image here" : placeholder}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF, WebP up to {maxSize}MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success indicator when image is loaded */}
      <AnimatePresence>
        {value && !isUploading && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex items-center gap-2 text-sm text-green-500"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Image uploaded successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Multi-image upload component for galleries
interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  className?: string;
  maxImages?: number;
  maxSize?: number;
  disabled?: boolean;
}

export function MultiImageUpload({
  values = [],
  onChange,
  folder = "dimension-nepal",
  className,
  maxImages = 10,
  maxSize = 10,
  disabled = false,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (files: FileList) => {
      if (disabled) return;

      const remainingSlots = maxImages - values.length;
      if (remainingSlots <= 0) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      setError(null);
      setIsUploading(true);

      try {
        const uploadPromises = filesToUpload.map((file) =>
          uploadToCloudinary(file, {
            folder,
            maxFileSize: maxSize * 1024 * 1024,
          })
        );

        const results = await Promise.all(uploadPromises);
        const newUrls = results.map((r) => r.secure_url);
        onChange([...values, ...newUrls]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, folder, maxImages, maxSize, onChange, values]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleUpload(files);
      }
      e.target.value = "";
    },
    [handleUpload]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newValues = values.filter((_, i) => i !== index);
      onChange(newValues);
    },
    [onChange, values]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {values.map((url, index) => (
          <motion.div
            key={url}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
          >
            <Image src={url || "/placeholder.svg"} alt={`Image ${index + 1}`} fill className="object-cover" sizes="200px" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}

        {values.length < maxImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
              disabled && "opacity-50 cursor-not-allowed",
              isUploading && "cursor-wait"
            )}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </>
            )}
          </motion.div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        {values.length} / {maxImages} images uploaded
      </p>
    </div>
  );
}
