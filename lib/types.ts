// Database Types for Dimension Nepal Construction Company

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  client: string;
  completionDate: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  _id?: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  _id?: string;
  companyName: string;
  tagline?: string;
  logo: string;
  favicon?: string;
  email: string;
  phone: string;
  address: string;
  mapUrl?: string;
  workingHours?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  footerText?: string;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Types
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
