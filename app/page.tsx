"use client";

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { ServicesSection } from '@/components/home/services-section';
import { ProjectsSection } from '@/components/home/projects-section';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  // Seed database on first visit (for demo purposes)
  useEffect(() => {
    fetch('/api/seed', { method: 'POST' }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
