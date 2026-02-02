import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    const { db } = await connectToDatabase();

    // Check if data already exists
    const existingUsers = await db.collection('users').countDocuments();
    if (existingUsers > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already seeded',
      });
    }

    // Seed admin user
    await db.collection('users').insertOne({
      name: 'Admin User',
      email: 'admin@dimensionnepal.com',
      password: hashPassword('admin123'),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed demo user
    await db.collection('users').insertOne({
      name: 'Demo User',
      email: 'user@dimensionnepal.com',
      password: hashPassword('user123'),
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed settings
    await db.collection('settings').insertOne({
      companyName: 'Dimension Nepal',
      logo: '/images/logo.png',
      email: 'info@dimensionnepal.com',
      phone: '+977 1-4444444',
      address: 'Putalisadak, Kathmandu, Nepal',
      mapLocation: { lat: 27.7172, lng: 85.3240 },
      socialLinks: {
        facebook: 'https://facebook.com/dimensionnepal',
        twitter: 'https://twitter.com/dimensionnepal',
        instagram: 'https://instagram.com/dimensionnepal',
        linkedin: 'https://linkedin.com/company/dimensionnepal',
      },
      updatedAt: new Date(),
    });

    // Seed banners
    await db.collection('banners').insertMany([
      {
        title: 'Building Dreams Into Reality',
        subtitle: 'Premier construction company in Nepal delivering excellence in residential, commercial, and infrastructure projects.',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80',
        ctaText: 'View Our Projects',
        ctaLink: '/projects',
        active: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Quality Construction Services',
        subtitle: 'From concept to completion, we deliver projects that exceed expectations with precision and care.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
        ctaText: 'Our Services',
        ctaLink: '/services',
        active: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed services
    await db.collection('services').insertMany([
      {
        title: 'Residential Construction',
        description: 'Custom home building services from modern apartments to luxury villas. We create living spaces that reflect your vision and lifestyle.',
        icon: 'Home',
        features: ['Custom Home Design', 'Apartment Buildings', 'Villa Construction', 'Home Renovations'],
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        featured: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Commercial Construction',
        description: 'Office buildings, retail spaces, and commercial complexes built to the highest standards of quality and functionality.',
        icon: 'Building2',
        features: ['Office Buildings', 'Shopping Centers', 'Hotels & Resorts', 'Industrial Facilities'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        featured: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Infrastructure Development',
        description: 'Roads, bridges, and public infrastructure projects that connect communities and drive progress.',
        icon: 'Truck',
        features: ['Road Construction', 'Bridge Building', 'Public Facilities', 'Utility Infrastructure'],
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
        featured: true,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Renovation & Remodeling',
        description: 'Transform existing spaces with our expert renovation services. Breathe new life into your property.',
        icon: 'Hammer',
        features: ['Interior Renovation', 'Structural Repairs', 'Modern Upgrades', 'Historic Restoration'],
        image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80',
        featured: false,
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Interior Design',
        description: 'Complete interior design solutions that combine aesthetics with functionality for stunning results.',
        icon: 'Palette',
        features: ['Space Planning', 'Custom Furniture', 'Lighting Design', 'Material Selection'],
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
        featured: false,
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Project Consulting',
        description: 'Expert guidance on construction projects from planning to completion. Make informed decisions.',
        icon: 'ClipboardList',
        features: ['Feasibility Studies', 'Cost Estimation', 'Project Management', 'Quality Assurance'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        featured: false,
        order: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed projects
    await db.collection('projects').insertMany([
      {
        title: 'Kathmandu Business Tower',
        description: 'A 20-story commercial complex featuring modern office spaces, retail areas, and state-of-the-art facilities in the heart of Kathmandu.',
        category: 'Commercial',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        location: 'Kathmandu, Nepal',
        client: 'Nepal Business Corp.',
        completionDate: '2024',
        status: 'completed',
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Pokhara Lake Resort',
        description: 'Luxury resort with 50 rooms overlooking Fewa Lake, featuring traditional Nepali architecture with modern amenities.',
        category: 'Hospitality',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        location: 'Pokhara, Nepal',
        client: 'Himalayan Hospitality',
        completionDate: '2023',
        status: 'completed',
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Green Valley Residences',
        description: 'Eco-friendly residential complex with 120 apartments, featuring solar panels, rainwater harvesting, and green spaces.',
        category: 'Residential',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        location: 'Lalitpur, Nepal',
        client: 'Green Living Nepal',
        completionDate: '2025',
        status: 'ongoing',
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Chitwan Highway Bridge',
        description: 'Modern steel bridge spanning 200 meters across the Narayani River, connecting communities and boosting regional trade.',
        category: 'Infrastructure',
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
        location: 'Chitwan, Nepal',
        client: 'Department of Roads',
        completionDate: '2024',
        status: 'completed',
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Biratnagar Shopping Mall',
        description: 'Eastern Nepal\'s largest shopping destination with international brands, entertainment zones, and food courts.',
        category: 'Commercial',
        image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80',
        location: 'Biratnagar, Nepal',
        client: 'Eastern Retail Group',
        completionDate: '2026',
        status: 'upcoming',
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Heritage Villa Renovation',
        description: 'Careful restoration of a 100-year-old Rana palace, preserving historical elements while adding modern comforts.',
        category: 'Renovation',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        location: 'Kathmandu, Nepal',
        client: 'Private Client',
        completionDate: '2024',
        status: 'completed',
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
