import React from 'react';
import { Quote } from 'lucide-react';
import { testimonials, clientLogos } from '../../data/testimonials';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        
        {/* Client Logos Grid */}
        <div className="border-b border-brand-border/60 pb-16 mb-16">
          <div className="text-center mb-10">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-brand-gray uppercase mb-2 block font-body">
              Approved Contractors & Certified Advisors for
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 items-center justify-items-center">
            {clientLogos.map((logo) => (
              <div 
                key={logo.name}
                className="w-full max-w-[140px] h-16 bg-brand-bg border border-brand-border/70 rounded-lg flex flex-col items-center justify-center p-3 select-none hover:border-brand-green/45 hover:shadow-sm transition-all duration-300 group"
              >
                <span className="font-display font-extrabold text-base md:text-lg text-brand-black group-hover:text-brand-green transition-colors">
                  {logo.name}
                </span>
                <span className="text-[8px] font-body font-semibold text-brand-gray tracking-tight text-center uppercase truncate w-full group-hover:text-brand-black transition-colors">
                  {logo.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <SectionHeader
            tag="Client Reviews"
            title="What Government Authorities Say"
            subtitle="Feedback from the engineering divisions and municipal officers we have collaborated with on public utility schemes."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((t) => (
              <Card key={t.id} className="relative bg-brand-bg/40 border border-brand-border/50 p-8 flex flex-col h-full justify-between" hoverEffect={true}>
                {/* Quote decoration */}
                <div className="absolute top-4 right-6 text-brand-green/10">
                  <Quote size={48} className="rotate-180" />
                </div>
                
                <div className="relative z-10 flex-grow">
                  <p className="font-body text-sm text-brand-gray italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="border-t border-brand-border/50 pt-4 mt-auto">
                  <span className="font-display font-bold text-sm text-brand-black block">
                    {t.author}
                  </span>
                  <span className="font-body text-xs font-semibold text-brand-green block uppercase tracking-wider">
                    {t.organization}
                  </span>
                  <span className="font-body text-[10px] text-brand-gray block mt-0.5">
                    {t.location} Division
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
export default TestimonialsSection;
