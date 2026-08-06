import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { services } from '../../data/services';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * Renders a grid of core engineering services.
 * 
 * @param {Object} props
 * @param {boolean} [props.limit=false] - If true, only shows the first 4 services (useful for Home Page).
 * @param {boolean} [props.showHeader=true] - Shows the SectionHeader component.
 */
export function ServicesGrid({ limit = false, showHeader = true }) {
  const displayServices = limit ? services.slice(0, 4) : services;

  // Helper to render Lucide Icons dynamically by name
  const renderIcon = (iconName, size = 28) => {
    const IconComponent = Icons[iconName];
    if (IconComponent) {
      return <IconComponent size={size} className="text-brand-green" />;
    }
    return <Icons.HelpCircle size={size} className="text-brand-green" />;
  };

  return (
    <section className="py-16 md:py-24 bg-brand-bg">
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {showHeader && (
          <SectionHeader
            tag="Our Expertise"
            title="Comprehensive Infrastructure Solutions"
            subtitle="We bring multidisciplinary engineering knowledge, advanced simulation technologies, and three decades of execution experience to public works projects."
          />
        )}

        <div className={`grid grid-cols-1 gap-8 ${limit ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {displayServices.map((service) => (
            <Card key={service.id} className="flex flex-col h-full bg-white justify-between">
              <div>
                {/* Icon Wrapper */}
                <div className="w-14 h-14 bg-brand-green/5 border border-brand-green/10 flex items-center justify-center rounded-lg mb-6">
                  {renderIcon(service.icon)}
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold font-display text-brand-black mb-3 group-hover:text-brand-green transition-colors">
                  {service.title}
                </h3>

                {/* Service One-Liner */}
                <p className="font-body text-sm text-brand-gray leading-relaxed mb-6">
                  {service.shortDescription}
                </p>
              </div>

              {/* Action Link */}
              <div className="border-t border-brand-border/60 pt-4 mt-auto">
                <Link
                  to={`/services#${service.id}`}
                  className="font-body text-sm font-semibold text-brand-green hover:text-brand-green-hover inline-flex items-center gap-1.5 group/link"
                >
                  Learn More
                  <Icons.ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {limit && (
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 font-body font-semibold text-brand-green hover:text-brand-green-hover border-b-2 border-brand-green hover:border-brand-green-hover pb-1 transition-colors"
            >
              Explore All Engineering Services
              <Icons.ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
export default ServicesGrid;
