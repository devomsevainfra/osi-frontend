import React from 'react';
import { TeamGrid } from '../components/sections/TeamGrid';

export function Team() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Team Hero Header */}
      <section className="relative py-20 bg-brand-black text-white text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=1600&h=400')` }}
        />
        <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4">Board of Directors</h1>
          <p className="font-body text-base text-gray-300 max-w-xl mx-auto">
            Our leadership brings together technical specialization with decades of field-proven infrastructure execution.
          </p>
        </div>
      </section>

      {/* 2. Management Grid */}
      <TeamGrid showHeader={false} />
    </div>
  );
}
export default Team;
