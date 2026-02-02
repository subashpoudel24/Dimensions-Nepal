"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/use-data';

const features = [
  'Free consultation and cost estimation',
  'Experienced team of professionals',
  '24/7 project support',
  'Quality guaranteed',
];

export function CTASection() {
  const { data: settings } = useSettings();

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight text-balance">
              Ready to Start Your Construction Project?
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Get in touch with our team for a free consultation. We'll help you turn
              your vision into reality with our expert construction services.
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 text-primary-foreground/90"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-background/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20"
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm mb-2">Call Us Now</p>
                <a
                  href={`tel:${settings?.phone || '+977 1-4444444'}`}
                  className="text-3xl font-bold text-primary-foreground hover:underline"
                >
                  {settings?.phone || '+977 1-4444444'}
                </a>
              </div>
              <p className="text-primary-foreground/70 text-sm">
                Or send us a message
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                  asChild
                >
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
