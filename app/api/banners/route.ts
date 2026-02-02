import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSession, isAdmin } from '@/lib/auth';
import type { Banner } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active');

    const { db } = await connectToDatabase();
    
    const query: Record<string, unknown> = {};
    if (activeOnly === 'true') query.active = true;

    const banners = await db.collection<Banner>('banners')
      .find(query)
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error('Get banners error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const banner: Omit<Banner, '_id'> = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Banner>('banners').insertOne(banner as Banner);

    return NextResponse.json({
      success: true,
      data: { ...banner, _id: result.insertedId },
      message: 'Banner created successfully',
    });
  } catch (error) {
    console.error('Create banner error:', error);
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
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    await db.collection<Banner>('banners').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: 'Banner updated successfully',
    });
  } catch (error) {
    console.error('Update banner error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!isAdmin(session)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    await db.collection<Banner>('banners').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    console.error('Delete banner error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
