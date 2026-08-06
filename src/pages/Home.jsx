import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/sections/Hero';
import { ServicesGrid } from '../components/sections/ServicesGrid';
import { ProjectsGrid } from '../components/sections/ProjectsGrid';
import { ConsultationForm } from '../components/sections/ConsultationForm';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { StatCounter } from '../components/ui/StatCounter';
import { stats } from '../data/stats';
import { Button } from '../components/ui/Button';

export function Home() {
  const highlights = [
    "BMC and Infracon Registerd Contractor & Consultant",
    "IIT Roorkee Certified Road Safety Auditors on Board",
    "30+ Years of Senior Project Supervision Experience",
    "State-of-the-art Design Systems"
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Stats Counter Section */}
      <section className="py-12 bg-white border-y border-brand-border/60">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-brand-border/50">
            {stats.map((stat) => (
              <StatCounter
                key={stat.id}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                description={stat.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Services Preview Strip */}
      <section className="py-10 bg-brand-bg border-b border-brand-border/40">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-brand-green uppercase mb-6 text-center font-body">Our Core Services</p>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {[
  { icon: '🏗', label: 'Structural Engineering and Services', sub: 'RCC & Steel Design · Foundation Design · Retrofitting', href: '/services#structural-engineering' },
  { icon: '🛣', label: 'Transportation Planning and Construction Services', sub: 'Highway Planning · Traffic Studies · DPR Preparation', href: '/services#transportation-planning' },
  { icon: '💧', label: 'Water Resources Development and Management Services', sub: 'Water Supply · Drainage Design · Flood Management', href: '/services#water-resources' },
  { icon: '🛡', label: 'Road Safety Audits', sub: 'IIT Roorkee Certified · Black Spot Analysis · IRC & MoRTH', href: '/services#road-safety-audit' },
  { icon: '🏢', label: 'Infrastructure Engineering and Design Services', sub: 'High-Rise Buildings · Bridges & Culverts · Smart City Infra', href: '/services#infrastructure-engineering' },
].map(({ icon, label, sub, href }) => (
              <Link
                key={label}
                to={href}
                className="group flex flex-col items-center text-center gap-3 bg-white border border-brand-border rounded-xl p-5 hover:border-brand-green/50 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="font-display font-bold text-sm text-brand-black group-hover:text-brand-green transition-colors leading-snug">{label}</p>
                  <p className="font-body text-[11px] text-brand-gray mt-0.5 leading-relaxed">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services Overview Section */}
      <ServicesGrid limit={true} />

      {/* 5. Featured Projects Section */}
      <ProjectsGrid
        limit={8}
        featuredOnly
        interactiveFilters={false}
        showHeader={true}
      />

      {/* 6. About Snapshot Section */}
      <section className="py-16 md:py-24 bg-brand-bg/50 border-y border-brand-border/40">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Philosophy */}
            <div className="flex flex-col gap-6">
              <span className="text-xs font-bold tracking-widest text-brand-green uppercase mb-1 block font-body">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-brand-black leading-tight">
                Engineering Excellence with Public Integrity
              </h2>
              <p className="font-body text-sm md:text-base text-brand-gray leading-relaxed">
                Om Seva Design & Build Pvt. Ltd. was founded with the core vision of providing highly technical, compliant, and cost-optimized infrastructure designs to India's public works departments and municipal administrations. We believe in bridging academic credentials with rigorous field experience.
              </p>
              <p className="font-body text-sm md:text-base text-brand-gray leading-relaxed">
                Our directors are personally involved in every stage of design and execution—from initial topographic surveys to final structural audits—ensuring zero compromise on safety and performance.
              </p>
              <div className="pt-2">
                <Button variant="secondary" to="/about" className="flex items-center gap-2">
                  Read Our Story
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>

            {/* Right Column: Highlights Checklist */}
            <div className="bg-white border border-brand-border p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold font-display text-brand-black mb-6 border-b border-brand-bg pb-3">
                Key Credentials
              </h3>
              <ul className="flex flex-col gap-4">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={14} className="text-brand-green" />
                    </div>
                    <span className="font-body text-sm md:text-base font-semibold text-brand-black leading-relaxed">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
              {/* <div className="mt-8 bg-brand-bg p-4 rounded-lg border border-brand-border/60">
                <p className="font-body text-xs text-brand-gray leading-relaxed">
                  We are certified Third Party Quality Assurance (TPQA) consultants and registered vendors for PWD, MJP, and BMC Maharashtra.
                </p>
              </div> */}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Consultation Booking Form Section */}
      <ConsultationForm />

      {/* 7. Client Logos / Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}
export default Home;
