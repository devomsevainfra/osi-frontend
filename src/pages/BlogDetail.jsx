import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { Button } from '../components/ui/Button';
import { getPublicBlogBySlug } from '../lib/publicBlogApi';

/** Format ISO date string to a readable format */
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);
      setError(null);
      try {
        const res = await getPublicBlogBySlug(slug);
        if (!cancelled) {
          setPost(res.data?.data || null);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) {
            setNotFound(true);
          } else {
            setError(err.response?.data?.message || 'Could not load this article. Please try again later.');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={32} className="animate-spin text-brand-green" />
      </div>
    );
  }

  // Not found
  if (notFound) {
    return (
      <div className="py-24 text-center px-4">
        <h2 className="text-3xl font-bold font-display text-brand-black mb-4">Article Not Found</h2>
        <p className="font-body text-brand-gray text-base mb-8">The blog article you are looking for does not exist.</p>
        <Button variant="primary" to="/blog">Return to Technical Blog</Button>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="py-24 px-4 max-w-2xl mx-auto">
        <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-lg text-sm font-body text-red-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          {error}
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="py-12 bg-white">
      <div className="px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">

        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Publications
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold font-display text-brand-black leading-tight mb-4">
          {post.title}
        </h1>

        {/* Date */}
        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-brand-gray font-body border-y border-brand-border/60 py-4 mb-8">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-green" />
            <span>Published on {formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.image?.url && (
          <div className="w-full h-[300px] md:h-[420px] rounded-xl overflow-hidden shadow-sm border border-brand-border/80 mb-10">
            <img
              src={post.image.url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Markdown Content */}
        <div className="blog-content font-body text-brand-gray text-base leading-relaxed">
          <Markdown>{post.content}</Markdown>
        </div>

      </div>
    </div>
  );
}
export default BlogDetail;
