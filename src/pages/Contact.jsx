import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const offices = [
    {
      city: "Mumbai HQ (Transportation & Structural)",
      address: "Goregaon East, Mumbai, Maharashtra - 400063",
      email: "devendra.baraskar2@gmail.com",
      phone: "+91 7020830066"
    },
    {
      city: "Parbhani Branch (Water & Civil Contracts)",
      address: "Subhash Road, Parbhani, Maharashtra - 431401",
      email: "dvchavanad@gmail.com",
      phone: "+91 9890184034"
    },
    {
      city: "Nanded Branch (Surveying & DPR)",
      address: "Srinagar Area, Nanded, Maharashtra - 431605",
      email: "Omsevadbg288@gmail.com",
      phone: "+91 7020550899"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  const whatsappUrl = "https://wa.me/917020830066?text=Hello%20Om%20Seva%20Design%20%26%20Build%2C%20I'd%20like%20to%20enquire%20about%20your%20services.";

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <section className="relative py-20 bg-brand-black text-white text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=1600&h=400')` }}
        />
        <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4">Contact Our Offices</h1>
          <p className="font-body text-base text-gray-300 max-w-xl mx-auto">
            Get in touch with our department heads directly or visit our locations in Mumbai, Parbhani, or Nanded.
          </p>
        </div>
      </section>

      {/* 2. Contact Info & Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Column: Office Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <h2 className="text-2xl font-bold font-display text-brand-black mb-2">Office Directory</h2>
              
              {offices.map((office, idx) => (
                <Card key={idx} hoverEffect={true} className="border border-brand-border/70 p-6 flex flex-col gap-3">
                  <h3 className="font-display font-bold text-base text-brand-black flex items-center gap-2 border-b border-brand-bg pb-2 mb-1">
                    <MapPin size={16} className="text-brand-green shrink-0" />
                    {office.city}
                  </h3>
                  
                  <p className="font-body text-xs text-brand-gray leading-relaxed mb-1">
                    {office.address}
                  </p>
                  
                  <div className="flex flex-col gap-2 font-body text-xs text-brand-gray border-t border-brand-bg pt-2.5">
                    <a href={`mailto:${office.email}`} className="flex items-center gap-2 hover:text-brand-green transition-colors">
                      <Mail size={14} className="text-brand-green" />
                      <span>{office.email}</span>
                    </a>
                    <a href={`tel:${office.phone}`} className="flex items-center gap-2 hover:text-brand-green transition-colors">
                      <Phone size={14} className="text-brand-green" />
                      <span>{office.phone}</span>
                    </a>
                  </div>
                </Card>
              ))}
            </div>

            {/* Right Column: Message Form */}
            <div className="lg:col-span-7 bg-brand-bg/50 border border-brand-border/60 rounded-xl p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl font-bold font-display text-brand-black mb-6">Send Us a Message</h2>
              
              {isSuccess ? (
                <div className="text-center py-8 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-brand-green" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-brand-black mb-2">Message Sent Successfully!</h3>
                  <p className="font-body text-brand-gray text-sm max-w-md mx-auto mb-6">
                    Thank you for reaching out. We will forward your details to the relevant director and reply to your email shortly.
                  </p>
                  <Button variant="secondary" onClick={() => setIsSuccess(false)} className="px-6 py-2">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="name" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Chavan"
                        className="px-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="email" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rajesh@gmail.com"
                        className="px-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="phone" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className="px-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white transition-colors"
                      />
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="subject" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">Subject *</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Structural Audit Inquiry"
                        className="px-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="message" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your query details here..."
                      className="px-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white transition-colors resize-y"
                    />
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 py-3 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. WhatsApp CTA Banner */}
      <section className="py-12 bg-brand-green text-white text-center">
        <div className="px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center gap-4">
          <MessageCircle size={40} className="text-white animate-bounce" />
          <h2 className="text-2xl md:text-3xl font-bold font-display">Need Immediate Assistance?</h2>
          <p className="font-body text-sm text-brand-border max-w-lg">
            Skip the forms and contact our Managing Director directly on WhatsApp. We can answer quick scoping questions or schedule calls instantly.
          </p>
          <div className="mt-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button 
                variant="white"
                className="flex items-center gap-2 text-brand-green bg-white hover:bg-brand-bg"
              >
                <MessageCircle size={18} />
                Chat Now on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Google Maps Embed Placeholder */}
      <section className="py-16 md:py-24 bg-white">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-display text-brand-black">Our HQ Location</h3>
            <p className="font-body text-sm text-brand-gray mt-1">Visit us at our central office in Mumbai.</p>
          </div>
          
          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-brand-border shadow-md select-none bg-brand-bg flex items-center justify-center relative">
            <div className="absolute inset-0 bg-cover bg-center filter grayscale opacity-25" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=400')` }} />
            <div className="relative z-10 text-center px-4 max-w-md">
              <MapPin size={32} className="text-brand-green mx-auto mb-3" />
              <h4 className="font-display font-bold text-lg text-brand-black mb-2">Mumbai Office Location</h4>
              <p className="font-body text-sm text-brand-gray mb-4">Goregaon East, Mumbai, Maharashtra 400063</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 font-body text-xs font-bold text-brand-green hover:underline"
              >
                Open in Google Maps
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
export default Contact;
