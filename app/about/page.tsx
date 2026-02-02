"use client";

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Target, Eye, Heart, Award, Users, Building2, Shield, Clock } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Quality',
    description: 'We never compromise on quality, using only the best materials and practices.',
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'Honest communication and transparent dealings with all stakeholders.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'Delivering projects on time and within budget, every single time.',
  },
  {
    icon: Users,
    title: 'Teamwork',
    description: 'Collaborative approach with clients, architects, and contractors.',
  },
];

const milestones = [
  { year: '2010', title: 'Company Founded', description: 'Started with a vision to transform construction in Nepal' },
  { year: '2013', title: 'First Major Project', description: 'Completed our first commercial complex in Kathmandu' },
  { year: '2016', title: 'Regional Expansion', description: 'Extended operations to Pokhara and Chitwan' },
  { year: '2019', title: 'ISO Certification', description: 'Achieved ISO 9001:2015 quality certification' },
  { year: '2022', title: '100+ Projects', description: 'Milestone of completing over 100 successful projects' },
  { year: '2024', title: 'Industry Leader', description: 'Recognized as a leading construction company in Nepal' },
];

const team = [
  {
    name: 'Rajesh Sharma',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name: 'Sunita Thapa',
    role: 'Chief Operations Officer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    name: 'Bikash Gurung',
    role: 'Chief Engineer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Priya Adhikari',
    role: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
];

export default function AboutPage() {
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
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Building Nepal's Future Since 2010
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Dimension Nepal has been at the forefront of construction excellence,
                delivering landmark projects that shape communities and transform lives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To deliver construction excellence through innovation, integrity, and dedication.
                  We strive to create structures that stand the test of time while exceeding our
                  clients' expectations and contributing to Nepal's development.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and respected construction company in Nepal,
                  known for our commitment to quality, safety, and sustainable building practices
                  that positively impact communities for generations.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
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
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Principles That Guide Us
              </h2>
              <p className="text-muted-foreground text-lg">
                Our core values form the foundation of everything we do.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Milestones & Achievements
              </h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-card border border-border rounded-xl p-6 inline-block">
                        <span className="text-primary font-bold text-lg">{milestone.year}</span>
                        <h3 className="text-foreground font-semibold mt-1">{milestone.title}</h3>
                        <p className="text-muted-foreground text-sm mt-2">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-4 h-4 bg-primary rounded-full z-10 flex-shrink-0" />
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
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
                Our Team
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet the Experts
              </h2>
              <p className="text-muted-foreground text-lg">
                Our experienced team brings decades of combined expertise to every project.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary text-sm mt-1">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Building2, value: '150+', label: 'Projects Completed' },
                { icon: Users, value: '50+', label: 'Team Members' },
                { icon: Award, value: '15+', label: 'Years Experience' },
                { icon: Shield, value: '100%', label: 'Client Satisfaction' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-10 h-10 text-primary-foreground/80 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                  <div className="text-primary-foreground/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
