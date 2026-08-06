import React from 'react';
import { ProjectsGrid } from '../components/sections/ProjectsGrid';

export function Projects() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Projects Hero Header */}
      <section className="relative py-20 bg-brand-black text-white text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600&h=400')` }}
        />
        <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4">Our Projects</h1>
          <p className="font-body text-base text-gray-300 max-w-xl mx-auto">
            Explore our diverse portfolio of transportation networks, structural designs, and water supply grids.
          </p>
        </div>
      </section>

      {/* 2. Filterable Projects Grid */}
      <ProjectsGrid 
        showHeader={false} 
        interactiveFilters={true} 
        limit={null} 
      />
    </div>
  );
}
export default Projects;
