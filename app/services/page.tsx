"use client";

import React from "react"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CTASection } from '@/components/home/cta-section';
import { useServices } from '@/hooks/use-data';
import { ArrowRight, Home, Building2, Truck, Hammer, Palette, ClipboardList, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Building2,
  Truck,
  Hammer,
  Palette,
  ClipboardList,
};

const processSteps = [
  {
    step: '01',
    title: 'Consultation',
    description: 'We discuss your vision, requirements, and budget to understand your needs.',
  },
  {
    step: '02',
    title: 'Planning',
    description: 'Our team creates detailed plans, timelines, and cost estimates.',
  },
  {
    step: '03',
    title: 'Construction',
    description: 'Expert execution with regular updates and quality checks at every stage.',
  },
  {
    step: '04',
    title: 'Delivery',
    description: 'Final inspection, handover, and ongoing support for your project.',
  },
];

export default function ServicesPage() {
  const { data: services, isLoading } = useServices();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Our Services
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Comprehensive Construction Solutions
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From concept to completion, we offer a full range of construction services
                tailored to meet your unique needs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {services?.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Building2;
                
                return (
                  <motion.div
                    key={service._id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col md:flex-row">
                      <div className="relative md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-card via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 md:top-4 md:bottom-auto">
                          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6 flex flex-col">
                        <h3 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        
                        <p className="text-muted-foreground mb-6 flex-1">
                          {service.description}
                        </p>

                        <div className="space-y-2 mb-6">
                          {service.features?.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>

                        <Button variant="outline" className="w-fit group/btn bg-transparent" asChild>
                          <Link href="/contact">
                            Get Quote
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Our Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How We Work
              </h2>
              <p className="text-muted-foreground text-lg">
                Our streamlined process ensures efficient project delivery from start to finish.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-card border border-border rounded-2xl p-6 h-full">
                    <span className="text-5xl font-bold text-primary/20">{step.step}</span>
                    <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-primary/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  Why Choose Us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Experience the Dimension Nepal Difference
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  With over 15 years of experience and 150+ successful projects, we bring
                  unmatched expertise and dedication to every construction project.
                </p>
                <ul className="space-y-4">
                  {[
                    'Licensed and certified construction professionals',
                    'Modern equipment and latest construction techniques',
                    'Transparent pricing with no hidden costs',
                    'Comprehensive project management',
                    'Post-construction support and maintenance',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                    alt="Construction site"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl">
                  <div className="text-4xl font-bold">15+</div>
                  <div className="text-sm text-primary-foreground/80">Years of Excellence</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
