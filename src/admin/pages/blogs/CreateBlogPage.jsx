import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { useToast } from '../../context/ToastContext';
import { createBlog } from '../../lib/blogApi';
import { FormField } from '../../components/ui/FormField';
import { FileUpload } from '../../components/ui/FileUpload';
import { FormErrorBanner } from '../../components/ui/FormErrorBanner';
import { LoadingOverlay } from '../../components/ui/LoadingOverlay';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export function CreateBlogPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  function clearError(field) {
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    const t = title.trim();
    if (!t) errs.title = 'Blog title is required.';
    else if (t.length < 5) errs.title = `Title is too short — minimum 5 characters (currently ${t.length}).`;
    else if (t.length > 200) errs.title = `Title is too long — maximum 200 characters (currently ${t.length}).`;

    const c = content.trim();
    if (!c) errs.content = 'Blog content is required.';
    else if (c.length < 50) errs.content = `Content is too short — minimum 50 characters (currently ${c.length}).`;

    if (images.length > 0) {
      const file = images[0];
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errs.image = 'Only JPEG, PNG, and WebP images are allowed.';
      } else if (file.size > MAX_IMAGE_SIZE) {
        errs.image = `Image is too large — maximum 5 MB (currently ${(file.size / 1024 / 1024).toFixed(1)} MB).`;
      }
    }

    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('content', content);
      if (images.length > 0) fd.append('image', images[0]);

      await createBlog(fd);
      toast.success('Blog draft created successfully.');
      navigate('/osi-console/blogs');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">New Blog</h2>
          <p className="admin-page__sub">Write a new blog post. It will be saved as a draft.</p>
        </div>
        <Link to="/osi-console/blogs" className="admin-btn admin-btn--ghost">← Back</Link>
      </div>

      <form id="create-blog-form" className="admin-card admin-form-wide" onSubmit={handleSubmit} noValidate>
        <LoadingOverlay visible={loading} message="Creating blog…" />
        <FormErrorBanner errors={errors} />

        <FormField
          id="cb-title"
          label="Title"
          required
          value={title}
          onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
          error={errors.title}
          placeholder="e.g. Modern Approaches to Highway Design"
        />

        {/* Content with Markdown preview toggle */}
        <div className="admin-form-field">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label htmlFor="cb-content" className="admin-form-field__label" style={{ margin: 0 }}>
              Content <span className="admin-form-field__req">*</span>
            </label>
            <button
              type="button"
              className="admin-btn admin-btn--xs admin-btn--ghost"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {showPreview ? (
            <div
              className="admin-card blog-content font-body text-brand-gray text-sm leading-relaxed"
              style={{ minHeight: '200px', padding: '1rem' }}
            >
              {content.trim() ? (
                <Markdown>{content}</Markdown>
              ) : (
                <p className="text-brand-gray/50 italic">Nothing to preview yet…</p>
              )}
            </div>
          ) : (
            <textarea
              id="cb-content"
              className={`admin-textarea ${errors.content ? 'admin-input--error' : ''}`}
              rows={12}
              value={content}
              onChange={(e) => { setContent(e.target.value); clearError('content'); }}
              placeholder="Write your blog content in Markdown…"
            />
          )}

          {errors.content && <p className="admin-form-field__error">{errors.content}</p>}
          <p className="admin-form-field__hint">Markdown supported (headings, lists, bold, links, images, etc.)</p>
        </div>

        {/* Image upload */}
        <FileUpload
          id="cb-image"
          label="Cover Image (JPEG, PNG, WebP · max 5 MB)"
          accept="image/jpeg,image/png,image/webp"
          files={images}
          onChange={(files) => { setImages(files); clearError('image'); }}
          error={errors.image}
          hint="Optional. Upload 1 cover image."
        />

        <div className="admin-form-actions">
          <Link to="/osi-console/blogs" className="admin-btn admin-btn--ghost">Cancel</Link>
          <button id="cb-submit" type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save Draft'}
          </button>
        </div>
      </form>
    </div>
  );
}
