import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { services } from '../data/services';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';

export function Services() {
  const { hash } = useLocation();

  // Scroll to hash target if it exists
  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        // Delay slightly for render cycles
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const renderIcon = (iconName, size = 28) => {
    const IconComponent = Icons[iconName];
    if (IconComponent) {
      return <IconComponent size={size} className="text-brand-green" />;
    }
    return <Icons.HelpCircle size={size} className="text-brand-green" />;
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Services Hero Header */}
      <section className="relative py-20 bg-brand-black text-white text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600&h=400')` }}
        />
        <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4">Engineering Services</h1>
          <p className="font-body text-base text-gray-300 max-w-xl mx-auto">
            Providing end-to-end design, audit, and project formulation consultancy for infrastructure divisions.
          </p>
        </div>
      </section>

      {/* 2. Detailed Service Sections */}
      <section className="py-16 md:py-24 bg-white">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto flex flex-col gap-24">
          
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={service.id} 
                id={service.id} 
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-28 border-b border-brand-border/40 pb-16 last:border-b-0 last:pb-0 ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Left Side: Summary, Description & Leader Info */}
                <div className={`lg:col-span-6 flex flex-col gap-6 ${isEven ? '' : 'lg:order-2'}`}>
                  
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-green/10 flex items-center justify-center rounded-lg">
                      {renderIcon(service.icon, 24)}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-display text-brand-black">
                      {service.title}
                    </h2>
                  </div>

                  <p className="font-body text-sm md:text-base text-brand-gray leading-relaxed">
                    {service.fullDescription}
                  </p>

                  {/* Department Lead */}
                  <div className="bg-brand-bg border border-brand-border/60 p-5 rounded-lg flex gap-4 items-start">
                    <div className="w-10 h-10 rounded bg-brand-green/10 flex items-center justify-center shrink-0">
                      <Icons.User size={20} className="text-brand-green" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-brand-gray tracking-widest uppercase block mb-0.5">
                        Department Head / Lead
                      </span>
                      <span className="font-display font-bold text-sm text-brand-black">
                        {service.lead.name}
                      </span>
                      <span className="font-body text-xs text-brand-green font-semibold leading-snug">
                        {service.lead.qualification}
                      </span>
                    </div>
                  </div>

                  {/* Standards Compliance Card */}
                  <div className="border border-brand-border rounded-lg p-5">
                    <span className="text-xs font-bold text-brand-black uppercase tracking-wider block mb-3 font-display flex items-center gap-1.5">
                      <Icons.Compass size={14} className="text-brand-green" />
                      Regulatory Codes & Standards
                    </span>
                    <ul className="flex flex-col gap-2">
                      {service.compliance.map((comp, idx) => (
                        <li key={idx} className="text-xs text-brand-gray font-body flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-brand-green rounded-full mt-1.5 shrink-0" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Right Side: Scope Checklist */}
                <div className={`lg:col-span-6 bg-brand-bg/50 border border-brand-border/60 rounded-xl p-8 ${isEven ? '' : 'lg:order-1'}`}>
                  <h3 className="text-lg font-bold font-display text-brand-black mb-6 border-b border-brand-border/60 pb-3 flex items-center gap-2">
                    <Icons.CheckSquare size={18} className="text-brand-green" />
                    Technical Scope & Deliverables
                  </h3>
                  
                  <ul className="flex flex-col gap-4">
                    {service.scope.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5 border border-brand-green/20">
                          <Icons.Check size={12} className="text-brand-green" />
                        </div>
                        <span className="font-body text-sm text-brand-black leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* 3. Single Page-Level CTA */}
      <section className="py-14 bg-brand-bg border-t border-brand-border/40">
        <div className="px-4 md:px-8 lg:px-16 max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
          <p className="text-xs font-bold tracking-widest text-brand-green uppercase font-body">Get Started</p>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-brand-black">
            Ready to Work With Us?
          </h2>
          <p className="font-body text-sm text-brand-gray max-w-xl">
            Tell us about your project — our team will review your requirements and respond with a technical proposal.
          </p>
          <Link
            to="/consultation"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-green hover:bg-brand-green-hover text-white text-sm font-bold font-body rounded-lg transition-colors mt-2"
          >
            <Icons.Send size={15} />
            Request a Proposal
          </Link>
        </div>
      </section>
    </div>
  );
}
export default Services;
