import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Award, ArrowUpRight, ChevronDown, ChevronUp, Search, Loader2, AlertCircle } from 'lucide-react';
import { benefits } from '../data/careers';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { publicApi } from '../lib/publicApi';

export function Careers() {
  const navigate = useNavigate();

  // ── Live Jobs State ─────────────────────────────────────────────
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalJobs: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentType, setEmpType] = useState('');
  const [location, setLocation] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const params = new URLSearchParams({ page, limit: 8 });
      if (search) params.set('search', search);
      if (department) params.set('department', department);
      if (employmentType) params.set('employmentType', employmentType);
      if (location) params.set('location', location);
      const res = await publicApi.get(`/job/getJobs?${params}`);
      setJobs(res.data?.data?.jobs || []);
      setPagination(res.data?.data?.pagination || { page: 1, totalPages: 1, totalJobs: 0 });
    } catch (err) {
      setJobsError('Could not load job listings. Please try again later.');
    } finally {
      setJobsLoading(false);
    }
  }, [page, search, department, employmentType, location]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  function handleJobSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <section className="relative py-20 bg-brand-black text-white text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600&h=400')` }}
        />
        <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4">Build the Future With Us</h1>
          <p className="font-body text-base text-gray-300 max-w-xl mx-auto">
            Join Om Seva Design & Build to work on nationwide infrastructure projects and shape critical civil facilities.
          </p>
        </div>
      </section>

      {/* 2. Why Join Us (Benefits Grid) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <SectionHeader
            tag="Corporate Culture"
            title="Why Join Om Seva?"
            subtitle="We offer an environment that encourages technical rigor, continuous learning, and direct contribution to public works."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <Card key={b.id} hoverEffect={true} className="flex flex-col bg-brand-bg/40">
                <div className="w-10 h-10 bg-brand-green/10 flex items-center justify-center rounded-lg mb-4">
                  <Award size={20} className="text-brand-green" />
                </div>
                <h4 className="font-display font-bold text-base text-brand-black mb-2">{b.title}</h4>
                <p className="font-body text-xs text-brand-gray leading-relaxed">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Open Positions — Live from API */}
      <section className="py-16 bg-brand-bg border-y border-brand-border/40">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <SectionHeader
            tag="Careers"
            title="Available Vacancies"
            subtitle="Browse our current openings. Click any role to view the full description."
          />

          {/* Filters */}
          <form
            className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 mb-8"
            onSubmit={handleJobSearch}
          >
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray/50 pointer-events-none" />
              <input
                type="search"
                placeholder="Search title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white"
              />
            </div>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              className="px-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white cursor-pointer"
            >
              <option value="">All Departments</option>
              {['Engineering', 'Design', 'Surveying', 'Management', 'Administration', 'Other'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={employmentType}
              onChange={(e) => { setEmpType(e.target.value); setPage(1); }}
              className="px-4 py-2.5 border border-brand-border rounded-lg text-sm font-body text-brand-black focus:outline-none focus:border-brand-green bg-white cursor-pointer"
            >
              <option value="">All Types</option>
              {['Full-time', 'Part-time', 'Contract', 'Internship'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button type="submit"
              className="px-5 py-2.5 bg-brand-green hover:bg-brand-green-hover text-white text-sm font-bold font-body rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Results */}
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            {jobsLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 size={32} className="animate-spin text-brand-green" />
              </div>
            ) : jobsError ? (
              <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-lg text-sm font-body text-red-700">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                {jobsError}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-brand-border rounded-lg bg-white">
                <p className="font-body text-brand-gray text-sm">No open positions match your filters. Please check back soon.</p>
              </div>
            ) : (
              jobs.map((job) => {
                const isExpanded = expandedId === job._id;
                return (
                  <div
                    key={job._id}
                    className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden transition-all duration-300"
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : job._id)}
                      className="p-6 flex items-center justify-between cursor-pointer hover:bg-brand-bg/20 transition-colors select-none"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <h4 className="font-display font-bold text-lg text-brand-black">{job.title}</h4>
                        <div className="flex gap-2 flex-wrap">
                          {job.department && (
                            <span className="bg-brand-green/10 text-brand-green text-xs font-semibold px-2 py-0.5 rounded border border-brand-green/20">
                              {job.department}
                            </span>
                          )}
                          {(job.location || job.employmentType) && (
                            <span className="bg-brand-bg text-brand-gray text-xs font-semibold px-2 py-0.5 rounded border border-brand-border">
                              {[job.location, job.employmentType].filter(Boolean).join(' | ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-brand-green font-body text-sm font-semibold flex items-center gap-1">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-brand-bg pt-6 animate-in slide-in-from-top-2 duration-200">
                        {job.experienceLevel && (
                          <div className="mb-4">
                            <span className="text-xs font-bold text-brand-black uppercase tracking-wider block mb-1.5 font-display">Experience:</span>
                            <p className="text-xs font-body text-brand-gray">{job.experienceLevel}</p>
                          </div>
                        )}
                        <Button
                          variant="primary"
                          onClick={() => navigate(`/careers/${job._id}`)}
                          className="py-2.5 px-5 text-xs inline-flex items-center gap-1.5"
                        >
                          View Full Description <ArrowUpRight size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border border-brand-border rounded-lg text-sm font-body font-semibold text-brand-black hover:border-brand-green hover:text-brand-green transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="font-body text-sm text-brand-gray">Page {page} of {pagination.totalPages}</span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-brand-border rounded-lg text-sm font-body font-semibold text-brand-black hover:border-brand-green hover:text-brand-green transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
export default Careers;
