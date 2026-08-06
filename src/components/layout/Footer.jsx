import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects Portfolio', path: '/projects' },
    { name: 'Management Team', path: '/team' },
    { name: 'Careers', path: '/careers' },
    { name: 'Technical Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const serviceLinks = [
    { name: 'Transportation Engineering', path: '/services#transportation-engineering' },
    { name: 'Road Safety Audit', path: '/services#road-safety-audit' },
    { name: 'Water Supply & Distribution', path: '/services#water-supply' },
    { name: 'Structural Engineering', path: '/services#structural-engineering' },
    { name: 'Surveying & DPR Preparation', path: '/services#surveying-dpr' },
    { name: 'Consultancy Services', path: '/services#consultancy-services' }
  ];

  const offices = [
    { city: "Mumbai Office", address: "Goregaon East, Mumbai, MH - 400063" },
    { city: "Parbhani Office", address: "Subhash Road, Parbhani, MH - 431401" },
    { city: "Nanded Office", address: "Srinagar Area, Nanded, MH - 431605" }
  ];

  return (
    <footer className="bg-brand-black text-white pt-16 pb-8 border-t border-brand-border">
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Column 1: Company Profile */}
        <div className="flex flex-col gap-4">
          <BrandLogo variant="footer" />
          <p className="font-body text-sm text-gray-400 leading-relaxed mt-2">
            Building India's infrastructure, one project at a time. We provide expert engineering consultancy and government-registered contracting services for roads, structures, and water networks.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-brand-gray/30 hover:bg-brand-green hover:text-white transition-colors duration-300 text-gray-400" aria-label="LinkedIn">
              <LinkedinIcon size={18} />
            </a>
            <a href="mailto:devendra.baraskar2@gmail.com" className="p-2 rounded bg-brand-gray/30 hover:bg-brand-green hover:text-white transition-colors duration-300 text-gray-400" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-display text-lg font-bold mb-6 text-white relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-brand-green after:mt-2">
            Quick Directory
          </h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="font-body text-sm text-gray-400 hover:text-brand-green flex items-center gap-1 group transition-colors duration-200">
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-brand-green" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Engineering Services */}
        <div>
          <h3 className="font-display text-lg font-bold mb-6 text-white relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-brand-green after:mt-2">
            Our Services
          </h3>
          <ul className="flex flex-col gap-2.5">
            {serviceLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="font-body text-sm text-gray-400 hover:text-brand-green flex items-center gap-1 group transition-colors duration-200">
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-brand-green" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Info & Offices */}
        <div>
          <h3 className="font-display text-lg font-bold mb-6 text-white relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-brand-green after:mt-2">
            Get In Touch
          </h3>
          <div className="flex flex-col gap-4 font-body text-sm text-gray-400">
            {offices.map((office) => (
              <div key={office.city} className="flex gap-2.5">
                <MapPin size={16} className="text-brand-green shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block text-xs">{office.city}</span>
                  <span>{office.address}</span>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2.5 mt-2 border-t border-brand-gray/30 pt-3">
              <Mail size={16} className="text-brand-green" />
              <a href="mailto:devendra.baraskar2@gmail.com" className="hover:text-brand-green transition-colors">
                devendra.baraskar2@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-brand-green" />
              <a href="tel:+917020830066" className="hover:text-brand-green transition-colors">
                +91 7020830066
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Bottom Row */}
      <div className="border-t border-brand-gray/30 mt-16 pt-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        <p className="font-body text-xs text-gray-500 text-center md:text-left">
          © {currentYear} Om Seva Design & Build Pvt. Ltd. All rights reserved.
        </p>
        <p className="font-body text-xs text-gray-500 text-center">
          Developed by{' '}
          <a
            href="https://www.linkedin.com/in/meghsham-kapure/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-green hover:text-white font-semibold transition-colors duration-200 inline-flex items-center gap-1"
          >
            Meghsham @DevDotMaverick
            <LinkedinIcon size={12} className="inline shrink-0" />
          </a>
        </p>
        <p className="font-body text-xs text-gray-600 text-center md:text-right">
          Registered Government Contractors & Consultants.
        </p>
      </div>
    </footer>
  );
}
