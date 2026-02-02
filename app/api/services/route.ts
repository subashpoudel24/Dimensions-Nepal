import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSession, isAdmin } from '@/lib/auth';
import type { Service } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const { db } = await connectToDatabase();
    
    const query: Record<string, unknown> = {};
    if (featured === 'true') query.featured = true;

    const services = await db.collection<Service>('services')
      .find(query)
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error);
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

    const service: Omit<Service, '_id'> = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Service>('services').insertOne(service as Service);

    return NextResponse.json({
      success: true,
      data: { ...service, _id: result.insertedId },
      message: 'Service created successfully',
    });
  } catch (error) {
    console.error('Create service error:', error);
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
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    await db.collection<Service>('services').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
    });
  } catch (error) {
    console.error('Update service error:', error);
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
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    await db.collection<Service>('services').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
