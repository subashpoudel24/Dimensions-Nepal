import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'dimension-nepal';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Generate timestamp and signature for signed upload
    const timestamp = Math.round(Date.now() / 1000);
    
    const params: Record<string, string> = {
      folder,
      timestamp: timestamp.toString(),
    };

    // Generate signature
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const stringToSign = `${sortedParams}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create form data for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', new Blob([buffer], { type: file.type }), file.name);
    cloudinaryFormData.append('folder', folder);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('api_key', CLOUDINARY_API_KEY);
    cloudinaryFormData.append('signature', signature);

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Cloudinary upload error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to upload to Cloudinary' },
        { status: uploadResponse.status }
      );
    }

    const result = await uploadResponse.json();

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      created_at: result.created_at,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
