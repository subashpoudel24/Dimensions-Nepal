"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CTASection } from '@/components/home/cta-section';
import { useProjects } from '@/hooks/use-data';
import { MapPin, Calendar, Building2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';

const categories = ['All', 'Commercial', 'Residential', 'Infrastructure', 'Hospitality', 'Renovation'];
const statuses = ['All', 'completed', 'ongoing', 'upcoming'];

const statusColors: Record<string, string> = {
  completed: 'bg-green-500/10 text-green-600 border-green-500/20',
  ongoing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  upcoming: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects?.filter((project) => {
    const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

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
                Our Projects
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Construction Portfolio
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore our diverse range of construction projects, showcasing excellence
                in residential, commercial, and infrastructure development.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-md z-40">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${selectedStatus}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects?.map((project, index) => (
                  <motion.div
                    key={project._id || index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className={statusColors[project.status] || statusColors.completed}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-card/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary" />
                            {project.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" />
                            {project.completionDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProjects?.length === 0 && (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more projects.</p>
              </div>
            )}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Badge className={statusColors[selectedProject.status]}>
                    {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                  </Badge>
                  <span className="px-3 py-1 bg-card/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
                    {selectedProject.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">{selectedProject.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{selectedProject.description}</p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground">Location</span>
                    <p className="text-foreground font-medium flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      {selectedProject.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Completion</span>
                    <p className="text-foreground font-medium flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      {selectedProject.completionDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Client</span>
                    <p className="text-foreground font-medium flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4 text-primary" />
                      {selectedProject.client}
                    </p>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setSelectedProject(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
