import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, setSession } from '@/lib/auth';
import type { User, AuthUser } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
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

    // Check if this is the first user (make them admin)
    const userCount = await db.collection('users').countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const hashedPassword = hashPassword(password);
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<User>('users').insertOne(newUser as User);

    const authUser: AuthUser = {
      _id: result.insertedId.toString(),
      name,
      email,
      role,
    };

    await setSession(authUser);

    return NextResponse.json({
      success: true,
      data: authUser,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
