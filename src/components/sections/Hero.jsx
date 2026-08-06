import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  const handleScrollToConsultation = () => {
    const element = document.getElementById('consultation-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] flex items-center justify-center bg-brand-black overflow-hidden">
      {/* Background Image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600&h=900')`
        }}
      />
      {/* Dark tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/85 to-brand-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto w-full text-left text-white">
        <div className="max-w-3xl">
          {/* Subtitle tag */}
          <span className="inline-block text-xs md:text-sm font-bold tracking-widest text-brand-black uppercase mb-4 bg-white px-3.5 py-1.5 rounded-full shadow-md">
            Infrastructure &amp; Construction Consultancy
          </span>

          {/* Main Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight tracking-tight mb-6 text-brand-green" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
            Building India's Infrastructure <br className="hidden md:inline" />
            {/* <span className="text-brand-green drop-shadow-lg">One Project at a Time</span> */}
          </h1>

          {/* Body description */}
          <p className="font-body text-base md:text-xl text-white leading-relaxed mb-3 max-w-2xl" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            Om Seva Design &amp; Build Pvt. Ltd. is a premier engineering consultancy and construction firm.
          </p>

          {/* Authority hook */}
          <p className="font-body text-sm md:text-base text-white leading-relaxed mb-8 max-w-2xl border-l-4 border-white pl-4" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
            Structural engineering, water resource developments, infrastructure engineering, surveys, transportation planning &amp; construction engineering, intersection design &amp; road safety audits compliant with Government standards.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              to="/projects"
              className="flex items-center gap-2 group justify-center"
            >
              View Our Projects
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline-white"
              onClick={handleScrollToConsultation}
              className="flex items-center gap-2 justify-center"
            >
              <Calendar size={16} />
              Book a Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
