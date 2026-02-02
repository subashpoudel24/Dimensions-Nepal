// Cloudinary configuration and upload utilities

// Server-side only credentials
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
}

export interface UploadOptions {
  folder?: string;
  transformation?: string;
  maxFileSize?: number; // in bytes
  allowedFormats?: string[];
}

const DEFAULT_OPTIONS: UploadOptions = {
  folder: 'dimension-nepal',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
};

// Client-side function to upload via API route (signed upload)
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Validate file size
  if (mergedOptions.maxFileSize && file.size > mergedOptions.maxFileSize) {
    throw new Error(`File size exceeds ${mergedOptions.maxFileSize / (1024 * 1024)}MB limit`);
  }

  // Validate file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (mergedOptions.allowedFormats && fileExtension && !mergedOptions.allowedFormats.includes(fileExtension)) {
    throw new Error(`File format .${fileExtension} is not allowed. Allowed formats: ${mergedOptions.allowedFormats.join(', ')}`);
  }

  const formData = new FormData();
  formData.append('file', file);
  
  if (mergedOptions.folder) {
    formData.append('folder', mergedOptions.folder);
  }

  // Upload via our API route (handles signing server-side)
  const response = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload image');
  }

  const data = await response.json();
  return data as CloudinaryUploadResponse;
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId }),
  });

  return response.ok;
}

export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    return publicId; // Return as-is if not configured
  }

  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);

  const transformationString = transformations.length > 0 ? transformations.join(',') + '/' : '';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}${publicId}`;
}

// Server-side helper to generate signature for uploads
export function generateSignature(params: Record<string, string>, timestamp: number): string {
  const crypto = require('crypto');
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  const stringToSign = `${sortedParams}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  
  return crypto.createHash('sha1').update(stringToSign).digest('hex');
}
