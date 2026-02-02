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
        { error: 'Cloudinary is not configured' },
        { status: 500 }
      );
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      );
    }

    // Generate timestamp and signature for signed delete
    const timestamp = Math.round(Date.now() / 1000);
    
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    // Create form data for Cloudinary delete
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('signature', signature);

    // Delete from Cloudinary
    const deleteResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      console.error('Cloudinary delete error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to delete from Cloudinary' },
        { status: deleteResponse.status }
      );
    }

    const result = await deleteResponse.json();

    return NextResponse.json({
      success: result.result === 'ok',
      result: result.result,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
