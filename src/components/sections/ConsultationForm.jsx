import React, { useState } from 'react';
import { Send, CheckCircle2, PhoneCall, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { publicApi } from '../../lib/publicApi';

export function ConsultationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    organisationName: '',
    enquiryType: 'Consultancy',
    description: '',
    preferredContactTime: 'Morning (9 AM - 12 PM)'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await publicApi.post('/feedback/createResponse', formData);
      setIsSuccess(true);
      setFormData({
        fullName: '',
        phoneNumber: '',
        emailAddress: '',
        organisationName: '',
        enquiryType: 'Consultancy',
        description: '',
        preferredContactTime: 'Morning (9 AM - 12 PM)'
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Something went wrong. Please try again or call us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation-form" className="py-16 md:py-24 bg-brand-bg scroll-mt-20">
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Context Card */}
          <div className="lg:col-span-5 bg-brand-black text-white p-8 md:p-12 rounded-xl flex flex-col justify-between shadow-lg relative overflow-hidden">
            {/* Background geometric flare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-xs font-bold tracking-widest text-brand-green uppercase mb-3 block font-body">
                Let's Partner
              </span>
              <h3 className="text-3xl md:text-4xl font-bold font-display leading-tight mb-6">
                Request a Project Scoping Call
              </h3>
              <p className="font-body text-sm md:text-base text-gray-300 leading-relaxed mb-8">
                Submit your infrastructure details, tender requirements, or design guidelines. Our directors will review your query and get back to you with a preliminary technical assessment.
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-brand-green/15 flex items-center justify-center border border-brand-green/30">
                    <PhoneCall size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-body">Call Us Directly</span>
                    <span className="font-body text-sm font-semibold">+91 7020830066</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-brand-green/15 flex items-center justify-center border border-brand-green/30">
                    <Calendar size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-body">Turnaround Time</span>
                    <span className="font-body text-sm font-semibold">Response within 24 business hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-gray/30 pt-6 mt-12 relative z-10">
              <span className="text-[10px] text-gray-500 font-body block uppercase tracking-wider">
                Registration Standards
              </span>
              <span className="text-xs text-gray-400 font-body">
                Registered PWD Contractor & IIT Roorkee Certified Safety Auditors.
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Form Card */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-xl border border-brand-border shadow-sm flex flex-col justify-center">
            {isSuccess ? (
              <div className="text-center py-8 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-brand-green" />
                </div>
                <h4 className="text-2xl font-bold font-display text-brand-black mb-3">
                  Consultation Request Received!
                </h4>
                <p className="font-body text-brand-gray text-sm md:text-base max-w-md mx-auto mb-8">
                  Thank you for reaching out. We have logged your request and a director will contact you via email or phone within 24 hours.
                </p>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 text-xs"
                >
                  Submit Another Enquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fullName" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Kumar"
                      className="px-4 py-3 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green transition-colors bg-brand-bg/30"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className="px-4 py-3 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green transition-colors bg-brand-bg/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="emailAddress"
                      required
                      value={formData.emailAddress}
                      onChange={handleChange}
                      placeholder="e.g. rajesh@organization.org"
                      className="px-4 py-3 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green transition-colors bg-brand-bg/30"
                    />
                  </div>

                  {/* Organisation */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="organisation" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">
                      Organisation / Agency Name
                    </label>
                    <input
                      type="text"
                      id="organisation"
                      name="organisationName"
                      value={formData.organisationName}
                      onChange={handleChange}
                      placeholder="e.g. PWD Maharashtra / Private Developer"
                      className="px-4 py-3 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green transition-colors bg-brand-bg/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type of Enquiry */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="enquiryType" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">
                      Type of Enquiry
                    </label>
                    <select
                      id="enquiryType"
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      className="px-4 py-3 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white transition-colors cursor-pointer"
                    >
                      <option value="Consultancy">Project Consultancy</option>
                      <option value="Tender">Tender Bidding</option>
                      <option value="Construction">Construction Contracting</option>
                      <option value="Water Supply">Water Supply Design</option>
                      <option value="Other">Other Civil Works</option>
                    </select>
                  </div>

                  {/* Preferred Contact Time */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="preferredTime" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">
                      Preferred Contact Time
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredContactTime"
                      value={formData.preferredContactTime}
                      onChange={handleChange}
                      className="px-4 py-3 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white transition-colors cursor-pointer"
                    >
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Project Description */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="description" className="text-xs font-semibold text-brand-black uppercase tracking-wider font-body">
                    Project Requirements / Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about your project scope, location, and key deliverables..."
                    className="px-4 py-3 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green transition-colors bg-brand-bg/30 resize-y"
                  />
                </div>

                {/* Submit button */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-body text-red-700">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 py-3.5 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Logging Enquiry...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Consultation Request
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
export default ConsultationForm;
