import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { getPublicBlogs } from '../lib/publicBlogApi';

/** Truncate raw markdown to a plain excerpt */
function excerpt(raw, maxLen = 150) {
  if (!raw) return '';
  // Strip common markdown syntax for a cleaner excerpt
  const plain = raw
    .replace(/#{1,6}\s+/g, '')    // headings
    .replace(/[*_]{1,3}/g, '')    // bold/italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')  // images
    .replace(/`{1,3}[^`]*`{1,3}/g, '')      // inline code
    .replace(/\n+/g, ' ')        // newlines to spaces
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).trimEnd() + '…';
}

/** Format ISO date string to a readable format */
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalBlogs: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicBlogs(page, 9);
      setBlogs(res.data?.data?.blogs || []);
      setPagination(res.data?.data?.pagination || { page: 1, totalPages: 1, totalBlogs: 0 });
    } catch {
      setError('Could not load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero Header */}
      <section className="relative py-20 bg-brand-black text-white text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1600&h=400')` }}
        />
        <div className="relative z-10 px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4">Technical Publications</h1>
          <p className="font-body text-base text-gray-300 max-w-xl mx-auto">
            Insights on Indian highway designs, hydraulic modeling systems, and structural auditing practices.
          </p>
        </div>
      </section>

      {/* Blog Posts Listing */}
      <section className="py-16 md:py-24">
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 size={32} className="animate-spin text-brand-green" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-lg text-sm font-body text-red-700 max-w-2xl mx-auto">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && blogs.length === 0 && (
            <div className="text-center py-10 border border-dashed border-brand-border rounded-lg bg-white max-w-2xl mx-auto">
              <p className="font-body text-brand-gray text-sm">No blog posts available yet. Please check back soon.</p>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && !error && blogs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <Card key={post._id} className="flex flex-col h-full p-0 overflow-hidden" hoverEffect={true}>
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full bg-brand-bg overflow-hidden border-b border-brand-border/40">
                    {post.image?.url ? (
                      <img
                        src={post.image.url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-bg">
                        <span className="font-body text-xs text-brand-gray/60">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-grow flex-col">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-brand-gray font-body mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-brand-green" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold font-display text-brand-black mb-3 line-clamp-2 hover:text-brand-green transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="font-body text-xs md:text-sm text-brand-gray leading-relaxed mb-6 line-clamp-3">
                      {excerpt(post.content)}
                    </p>

                    {/* Read More Link */}
                    <div className="border-t border-brand-border/40 pt-4 mt-auto">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="font-body text-xs font-bold text-brand-green hover:text-brand-green-hover inline-flex items-center gap-1 group"
                      >
                        Read Full Article
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
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
export default Blog;
