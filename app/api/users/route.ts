import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSession, isAdmin, hashPassword } from '@/lib/auth';
import type { User } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getSession();
    if (!isAdmin(session)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const users = await db.collection<User>('users')
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
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
    const { name, email, password, role } = data;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection<User>('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<User>('users').insertOne(newUser as User);

    return NextResponse.json({
      success: true,
      data: { ...newUser, _id: result.insertedId, password: undefined },
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Create user error:', error);
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
    const { _id, password, ...updateData } = data;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const updateFields: Record<string, unknown> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Only update password if provided
    if (password) {
      updateFields.password = hashPassword(password);
    }

    await db.collection<User>('users').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Update user error:', error);
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
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent deleting yourself
    if (session?._id === id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    await db.collection<User>('users').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
