"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Building2, Users, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/use-data';

const stats = [
  { icon: Building2, value: '150+', label: 'Projects Completed' },
  { icon: Users, value: '50+', label: 'Expert Team' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Clock, value: '98%', label: 'On-Time Delivery' },
];

export function HeroSection() {
  const { data: banners, isLoading } = useBanners({ active: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeBanners = banners?.filter(b => b.active) || [];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  // Default banner for when no banners exist
  const defaultBanner = {
    title: 'Building Dreams Into Reality',
    subtitle: 'Premier construction company in Nepal delivering excellence in residential, commercial, and infrastructure projects.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80',
    ctaText: 'View Our Projects',
    ctaLink: '/projects',
  };

  const currentBanner = activeBanners[currentSlide] || defaultBanner;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentBanner.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  Trusted Construction Partner
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                {currentBanner.title}
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                {currentBanner.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="group">
                  <Link href={currentBanner.ctaLink}>
                    {currentBanner.ctaText}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Get Free Quote</Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-secondary/50"
                  >
                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slider Controls */}
        {activeBanners.length > 1 && (
          <div className="flex items-center justify-center lg:justify-start gap-4 mt-12">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-border bg-card/50 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-border bg-card/50 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Stats */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
