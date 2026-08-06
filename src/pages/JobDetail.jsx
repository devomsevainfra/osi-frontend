import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Briefcase, Clock, Award, Calendar, AlertCircle,
  Send, CheckCircle2, Plus, Trash2, User, Mail, Phone, Building2,
  FileText, Link as LinkIcon,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { publicApi } from '../lib/publicApi';
import { Button } from '../components/ui/Button';

// ─── Shared style tokens (mirrors Consultation.jsx) ───────────────────────────
const inputCls =
  'w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black bg-white focus:outline-none focus:border-brand-green transition-colors placeholder:text-brand-gray/50';
const labelCls =
  'text-xs font-semibold text-brand-black uppercase tracking-wider font-body flex items-center gap-1.5 mb-1';

// ─── Meta sidebar item ─────────────────────────────────────────────────────────
function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 items-start min-w-0">
      <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-brand-green" />
      </div>
      <div className="min-w-0 pt-0.5">
        <span className="text-[10px] font-bold text-brand-gray tracking-wider uppercase block font-body mb-0.5">{label}</span>
        <span className="font-body text-sm font-semibold text-brand-black break-words">{value || '—'}</span>
      </div>
    </div>
  );
}

// ─── Application Form ─────────────────────────────────────────────────────────
const INITIAL_FORM = {
  fullName: '',
  email: '',
  phoneNumber: '',
  currentLocation: '',
  currentOrganisation: '',
  yearsOfExperience: '',
  coverLetter: '',
  resumeLink: '',
  portfolioLink: '',
};

function ApplicationForm({ jobId }) {
  const [form, setForm]               = useState(INITIAL_FORM);
  const [otherLinks, setOtherLinks]   = useState(['']);
  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  }

  function handleLinkChange(idx, val) {
    setOtherLinks(prev => prev.map((l, i) => i === idx ? val : l));
  }

  function addLink() {
    setOtherLinks(prev => [...prev, '']);
  }

  function removeLink(idx) {
    setOtherLinks(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...form,
      jobId,
      yearsOfExperience: form.yearsOfExperience !== '' ? Number(form.yearsOfExperience) : undefined,
      otherDocumentLinks: otherLinks.filter(l => l.trim() !== ''),
    };

    try {
      await publicApi.post('/job-applications/createApplication', payload);
      setSuccess(true);
      setForm(INITIAL_FORM);
      setOtherLinks(['']);
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409) {
        // Duplicate application — surface API message verbatim
        setError(message || 'You have already applied for this position.');
      } else if (status === 400) {
        setError(message || 'Please check your inputs and try again.');
      } else {
        setError(message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-16 flex flex-col items-center">
        <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-brand-green" />
        </div>
        <h2 className="text-3xl font-bold font-display text-brand-black mb-3">Application Submitted!</h2>
        <p className="font-body text-brand-gray text-base max-w-md mb-8">
          Thank you for applying. Our team will review your application and get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-3 border border-brand-border rounded-lg text-sm font-semibold font-body text-brand-black hover:border-brand-green hover:text-brand-green transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="app-fullName" className={labelCls}>
            <User size={12} /> Full Name *
          </label>
          <input
            id="app-fullName" name="fullName" type="text" required
            value={form.fullName} onChange={handleChange}
            placeholder="e.g. Priya Sharma"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="app-email" className={labelCls}>
            <Mail size={12} /> Email Address *
          </label>
          <input
            id="app-email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            placeholder="e.g. priya@example.com"
            className={inputCls}
          />
        </div>
      </div>

      {/* Row 2: Phone + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="app-phoneNumber" className={labelCls}>
            <Phone size={12} /> Phone Number *
          </label>
          <input
            id="app-phoneNumber" name="phoneNumber" type="tel" required
            value={form.phoneNumber} onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="app-currentLocation" className={labelCls}>
            <MapPin size={12} /> Current Location
          </label>
          <input
            id="app-currentLocation" name="currentLocation" type="text"
            value={form.currentLocation} onChange={handleChange}
            placeholder="e.g. Pune, Maharashtra"
            className={inputCls}
          />
        </div>
      </div>

      {/* Row 3: Organisation + Years of Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="app-currentOrganisation" className={labelCls}>
            <Building2 size={12} /> Current Organisation
          </label>
          <input
            id="app-currentOrganisation" name="currentOrganisation" type="text"
            value={form.currentOrganisation} onChange={handleChange}
            placeholder="e.g. PWD Maharashtra"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="app-yearsOfExperience" className={labelCls}>
            <Award size={12} /> Years of Experience
          </label>
          <input
            id="app-yearsOfExperience" name="yearsOfExperience" type="number"
            min={0} max={60}
            value={form.yearsOfExperience} onChange={handleChange}
            placeholder="e.g. 5"
            className={inputCls}
          />
        </div>
      </div>

      {/* Resume Link */}
      <div>
        <label htmlFor="app-resumeLink" className={labelCls}>
          <LinkIcon size={12} /> Resume Link *
        </label>
        <input
          id="app-resumeLink" name="resumeLink" type="url" required
          value={form.resumeLink} onChange={handleChange}
          placeholder="https://drive.google.com/file/…"
          className={inputCls}
        />
        <p className="text-[11px] text-brand-gray font-body mt-1">
          Paste a public link (Google Drive, Dropbox, etc.) — no file upload
        </p>
      </div>

      {/* Portfolio Link */}
      <div>
        <label htmlFor="app-portfolioLink" className={labelCls}>
          <LinkIcon size={12} /> Portfolio Link
        </label>
        <input
          id="app-portfolioLink" name="portfolioLink" type="url"
          value={form.portfolioLink} onChange={handleChange}
          placeholder="https://yourportfolio.com"
          className={inputCls}
        />
      </div>

      {/* Other Document Links */}
      <div>
        <label className={labelCls}>
          <FileText size={12} /> Other Document Links
        </label>
        <div className="flex flex-col gap-2">
          {otherLinks.map((link, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(idx, e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
              {otherLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-brand-border text-brand-gray hover:border-red-300 hover:text-red-500 transition-colors"
                  aria-label="Remove link"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLink}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-brand-green-hover font-body transition-colors"
        >
          <Plus size={13} /> Add another link
        </button>
      </div>

      {/* Cover Letter */}
      <div>
        <label htmlFor="app-coverLetter" className={labelCls}>
          <FileText size={12} /> Cover Letter / Message
        </label>
        <textarea
          id="app-coverLetter" name="coverLetter"
          rows={5}
          value={form.coverLetter} onChange={handleChange}
          placeholder="Tell us why you're a great fit for this role…"
          className={`${inputCls} resize-y`}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-body text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-green hover:bg-brand-green-hover text-white text-sm font-bold font-body rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send size={15} />
            Submit Application
          </>
        )}
      </button>

      <p className="text-xs text-center text-brand-gray font-body">
        Your details are kept confidential and used only for recruitment purposes.
      </p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function JobDetail() {
  const { id } = useParams();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  function handleApplyClick() {
    setShowForm(true);
    // Give React a tick to render the form before scrolling
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchJob() {
      try {
        const res = await publicApi.get(`/job/getJobById/${id}`);
        setJob(res.data?.data ?? res.data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'not_found' : 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="py-24 text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={36} className="text-red-400" />
        </div>
        <h2 className="text-3xl font-bold font-display text-brand-black mb-4">
          {error === 'not_found' ? 'Position Not Found' : 'Something Went Wrong'}
        </h2>
        <p className="font-body text-brand-gray text-base mb-8 max-w-md mx-auto">
          {error === 'not_found'
            ? 'This job listing may have been closed or removed. Check our Careers page for current openings.'
            : 'We could not load this job posting. Please try again later.'}
        </p>
        <Button variant="primary" to="/careers">Back to Careers</Button>
      </div>
    );
  }

  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="py-8 md:py-12 bg-brand-bg/30">
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">

        {/* Back */}
        <div className="mb-8">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Careers
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8 md:mb-12 overflow-hidden rounded-2xl bg-white border border-brand-border/60 shadow-sm">
          <div className="relative px-6 py-9 md:px-10 md:py-12">
            <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-brand-green/10 blur-3xl" />
            <div className="relative max-w-4xl">
              <p className="mb-4 text-xs font-body font-bold tracking-[0.22em] uppercase text-brand-green">
                Careers at Om Seva
              </p>
              <div className="flex flex-wrap gap-2 items-center mb-5">
            {job.department && (
              <span className="bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-green/20 font-body">
                {job.department}
              </span>
            )}
            {job.employmentType && (
              <span className="bg-brand-bg text-brand-gray text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-border font-body">
                {job.employmentType}
              </span>
            )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-black leading-tight max-w-4xl break-words">
                {job.title}
              </h1>
              {job.location && (
                <div className="mt-5 inline-flex max-w-full items-center gap-2 text-sm font-body text-brand-gray">
                  <MapPin size={16} className="shrink-0 text-brand-green" />
                  <span className="break-words">{job.location}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: Markdown Description */}
          <article className="lg:col-span-8 bg-white rounded-2xl border border-brand-border/60 px-6 py-7 md:px-9 md:py-9 shadow-sm">
            <div className="flex items-center gap-3 mb-7 pb-5 border-b border-brand-border/60">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                <FileText size={18} className="text-brand-green" />
              </div>
              <div>
                <p className="text-[10px] font-body font-bold text-brand-green tracking-[0.16em] uppercase">The opportunity</p>
                <h2 className="text-2xl font-bold font-display text-brand-black">Job Description</h2>
              </div>
            </div>
            <div className="job-prose font-body break-words">
              <Markdown>{job.description}</Markdown>
            </div>
          </article>

          {/* Right: Meta Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white border border-brand-border/60 rounded-2xl p-6 md:p-7 flex flex-col gap-6 shadow-sm">
            <div>
              <p className="text-[10px] font-body font-bold text-brand-green tracking-[0.16em] uppercase mb-1">At a glance</p>
              <h3 className="text-xl font-bold font-display text-brand-black">Position Details</h3>
            </div>

            <div className="flex flex-col gap-5">
              {job.location      && <MetaItem icon={MapPin}    label="Location"          value={job.location} />}
              {job.employmentType && <MetaItem icon={Briefcase} label="Employment Type"   value={job.employmentType} />}
              {job.experienceLevel && <MetaItem icon={Award}   label="Experience Level"  value={job.experienceLevel} />}
              {job.department    && <MetaItem icon={Clock}     label="Department"         value={job.department} />}
              {deadline          && <MetaItem icon={Calendar}  label="Application Deadline" value={deadline} />}
            </div>

            {job.isLive && (
              <div className="border-t border-brand-border/60 pt-6 mt-1">
                <p className="font-body text-xs text-brand-gray leading-relaxed mb-4">
                  Interested in this role? Click Apply Now to fill in the application form.
                </p>
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold font-body rounded-lg transition-colors ${
                    showForm
                      ? 'bg-brand-bg border border-brand-border text-brand-black hover:border-brand-green hover:text-brand-green'
                      : 'bg-brand-green hover:bg-brand-green-hover text-white'
                  }`}
                >
                  {showForm ? 'Hide Application Form' : 'Apply Now'}
                </button>
              </div>
            )}
          </aside>

        </div>

        {/* ── Application Form ──────────────────────────────────────────────── */}
        {job.isLive && showForm && (
          <section ref={formRef} id="apply" className="mt-16 pt-12 border-t border-brand-border/60 scroll-mt-24">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold font-display text-brand-black mb-2">
                    Apply for this Position
                  </h2>
                  <p className="font-body text-brand-gray text-base">
                    Complete the form below and our recruitment team will be in touch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="shrink-0 mt-1 text-xs font-semibold font-body text-brand-gray hover:text-brand-black transition-colors"
                  aria-label="Close application form"
                >
                  ✕ Close
                </button>
              </div>
              <div className="bg-brand-bg/40 border border-brand-border/60 rounded-xl p-8">
                <ApplicationForm jobId={job._id} />
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default JobDetail;
