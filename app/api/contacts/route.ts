import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getSession, isAdmin } from '@/lib/auth';
import type { Contact } from '@/lib/types';
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
    const contacts = await db.collection<Contact>('contacts')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const contact: Omit<Contact, '_id'> = {
      name,
      email,
      phone: phone || '',
      subject: subject || '',
      message,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Contact>('contacts').insertOne(contact as Contact);

    return NextResponse.json({
      success: true,
      data: { ...contact, _id: result.insertedId },
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Create contact error:', error);
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
    const { _id, status } = data;

    if (!_id || !status) {
      return NextResponse.json(
        { success: false, error: 'Contact ID and status are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    await db.collection<Contact>('contacts').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: 'Contact status updated successfully',
    });
  } catch (error) {
    console.error('Update contact error:', error);
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
        { success: false, error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    await db.collection<Contact>('contacts').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
