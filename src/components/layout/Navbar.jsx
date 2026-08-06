import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { BrandLogo } from './BrandLogo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Track scroll position to change navbar background style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const whatsappUrl = "https://wa.me/917020830066?text=Hello%20Om%20Seva%20Design%20%26%20Build%2C%20I'd%20like%20to%20enquire%20about%20your%20services.";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 w-full ${
      isScrolled 
        ? 'bg-white border-b border-brand-border shadow-sm py-2' 
        : 'bg-white/95 backdrop-blur-sm border-b border-brand-border/50 py-3'
    }`}>
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <BrandLogo variant="header" />

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `relative font-body text-sm font-semibold transition-all duration-300 py-2 ${
                  isActive 
                    ? 'text-brand-green' 
                    : 'text-brand-black hover:text-brand-green'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-full transition-all duration-300" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" className="flex items-center gap-2 text-xs py-2 px-4">
              <MessageCircle size={16} />
              Enquire on WhatsApp
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-md text-brand-black hover:text-brand-green hover:bg-brand-bg transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `font-body text-base font-semibold py-2 px-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-brand-green/5 text-brand-green border-l-4 border-brand-green' 
                      : 'text-brand-black hover:bg-brand-bg hover:text-brand-green'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-brand-border">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                  <MessageCircle size={18} />
                  Enquire on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
