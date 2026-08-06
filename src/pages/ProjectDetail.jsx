import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Landmark, DollarSign, User, Shield, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { publicApi } from '../lib/publicApi';

export function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProject() {
      try {
        const res = await publicApi.get(`/project/getProjectById/${id}`);
        setProject(res.data?.data);
      } catch (err) {
        setError('Project not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!project || !project.images) return;
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, project]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-24 text-center px-4">
        <h2 className="text-3xl font-bold font-display text-brand-black mb-4">Project Not Found</h2>
        <p className="font-body text-brand-gray text-base mb-8">The project ID you are looking for does not exist in our system.</p>
        <Button variant="primary" to="/projects">Return to Projects</Button>
      </div>
    );
  }

  // Lightbox handlers
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };
  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="py-12 bg-white">
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects Portfolio
          </Link>
        </div>

        {/* Title and Category Header */}
        <div className="mb-10 border-b border-brand-border/60 pb-6">
          <div className="flex flex-wrap gap-3 items-center mb-3">
            <Badge type="category">{project.category}</Badge>
            <Badge type="status">{project.status}</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-black leading-tight max-w-4xl">
            {project.title}
          </h1>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Description & Image Gallery */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Primary Cover Image */}
            <div className="w-full h-[350px] md:h-[480px] rounded-xl overflow-hidden shadow-sm border border-brand-border/80">
              {project.images && project.images.length > 0 ? (
                <img 
                  src={project.images[0].url} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-brand-gray">No Image Available</div>
              )}
            </div>

            {/* Project Narrative */}
            <div>
              <h2 className="text-2xl font-bold font-display text-brand-black mb-4">Project Overview</h2>
              <p className="font-body text-sm md:text-base text-brand-gray leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Image Gallery Grid */}
            {project.images && project.images.length > 0 && (
              <div>
                <h3 className="text-xl font-bold font-display text-brand-black mb-4">Project Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.images.map((img, index) => (
                    <div 
                      key={img.publicId || index} 
                      onClick={() => openLightbox(index)}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-brand-border cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <img 
                        src={img.url} 
                        alt={`${project.title} detail ${index}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold bg-brand-green px-2.5 py-1.5 rounded shadow-sm">
                          View Image
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Project Meta Sidebar */}
          <div className="lg:col-span-4 bg-brand-bg/60 border border-brand-border/60 rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <h3 className="text-lg font-bold font-display text-brand-black border-b border-brand-border pb-3">
              Project Parameters
            </h3>

            <div className="flex flex-col gap-5">
              {/* Location */}
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand-green/10 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-brand-green" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-gray tracking-wider uppercase block font-body">Location</span>
                  <span className="font-body text-sm font-semibold text-brand-black">
                    {project.location}
                  </span>
                </div>
              </div>

              {/* Client Authority */}
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand-green/10 flex items-center justify-center shrink-0">
                  <Landmark size={16} className="text-brand-green" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-gray tracking-wider uppercase block font-body">Authority / Client</span>
                  <span className="font-body text-sm font-semibold text-brand-black">
                    {project.client}
                  </span>
                </div>
              </div>

              {/* Budget */}
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand-green/10 flex items-center justify-center shrink-0">
                  <DollarSign size={16} className="text-brand-green" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-gray tracking-wider uppercase block font-body">Project Budget</span>
                  <span className="font-body text-sm font-semibold text-brand-black">
                    {project.budget}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand-green/10 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-brand-green" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-gray tracking-wider uppercase block font-body">Duration / Timeline</span>
                  <span className="font-body text-sm font-semibold text-brand-black">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN') : 'N/A'} 
                    {' to '} 
                    {project.endDate ? new Date(project.endDate).toLocaleDateString('en-IN') : 'Ongoing'}
                  </span>
                </div>
              </div>

              {/* Team Lead */}
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded bg-brand-green/10 flex items-center justify-center shrink-0">
                  <User size={16} className="text-brand-green" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-gray tracking-wider uppercase block font-body">Director In-Charge</span>
                  <span className="font-body text-sm font-semibold text-brand-black">
                    {project.teamLeader}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-border/60 pt-6 mt-2">
              <span className="text-[10px] font-bold text-brand-gray tracking-wider uppercase block mb-3 font-body">
                Official Compliance
              </span>
              <p className="font-body text-xs text-brand-gray leading-relaxed flex items-start gap-2">
                <Shield size={14} className="text-brand-green shrink-0 mt-0.5" />
                Verified & design-checked in accordance with relevant Indian Roads Congress (IRC) regulations and BIS standards.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 bg-brand-black/95 z-[99] flex items-center justify-center p-4 md:p-8 cursor-zoom-out animate-in fade-in duration-300"
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Left Navigation Arrow */}
          <button 
            onClick={showPrev}
            className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Lightbox Image Container */}
          <div className="max-w-5xl max-h-[80vh] flex items-center justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
            <img 
              src={project.images[lightboxIndex]?.url} 
              alt={`${project.title} detail enlarged`}
              className="w-full h-full max-h-[80vh] object-contain rounded shadow-2xl"
            />
          </div>

          {/* Right Navigation Arrow */}
          <button 
            onClick={showNext}
            className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          {/* Index Counter */}
          <div className="absolute bottom-6 text-white font-body text-sm font-semibold select-none">
            {lightboxIndex + 1} / {project.images.length}
          </div>
        </div>
      )}

    </div>
  );
}
export default ProjectDetail;
