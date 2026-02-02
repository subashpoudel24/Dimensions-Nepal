import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSession, isAdmin } from '@/lib/auth';
import type { Settings } from '@/lib/types';

const DEFAULT_SETTINGS: Omit<Settings, '_id' | 'updatedAt'> = {
  companyName: 'Dimension Nepal',
  tagline: 'Building Dreams, Constructing Futures',
  logo: '/images/logo.png',
  favicon: '/favicon.ico',
  email: 'info@dimensionnepal.com',
  phone: '+977 1-4444444',
  address: 'Kathmandu, Nepal',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14131.036667732014!2d85.3235!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19016c954a01%3A0x82240a3f32aa015d!2sKathmandu!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp',
  workingHours: 'Sun - Fri: 9:00 AM - 6:00 PM',
  socialLinks: {
    facebook: 'https://facebook.com/dimensionnepal',
    twitter: 'https://twitter.com/dimensionnepal',
    instagram: 'https://instagram.com/dimensionnepal',
    linkedin: 'https://linkedin.com/company/dimensionnepal',
  },
  footerText: 'Dimension Nepal is a premier construction company dedicated to quality and innovation.',
};

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    let settings = await db.collection<Settings>('settings').findOne();

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        success: true,
        data: { ...DEFAULT_SETTINGS, updatedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!isAdmin(session)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { db } = await connectToDatabase();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    // Upsert settings (update if exists, insert if not)
    await db.collection<Settings>('settings').updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
