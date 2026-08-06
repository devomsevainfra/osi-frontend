import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { useToast } from '../../context/ToastContext';
import { updateBlog } from '../../lib/blogApi';
import { FormField } from '../../components/ui/FormField';
import { FileUpload } from '../../components/ui/FileUpload';
import { FormErrorBanner } from '../../components/ui/FormErrorBanner';
import { LoadingOverlay } from '../../components/ui/LoadingOverlay';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export function EditBlogPage() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Data from navigation state (passed from admin list)
  const blogFromState = location.state?.blog || null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [existingImage, setExistingImage] = useState(null); // { url, publicId }
  const [removeImage, setRemoveImage] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [originalSlug, setOriginalSlug] = useState('');
  const [currentPreviewSlug, setCurrentPreviewSlug] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Store original values for dirty-checking
  const [originalValues, setOriginalValues] = useState({});

  useEffect(() => {
    if (!blogFromState) {
      toast.info('Blog must be opened from the list. Redirecting…');
      navigate('/osi-console/blogs', { replace: true });
      return;
    }

    const b = blogFromState;
    setTitle(b.title || '');
    setContent(b.content || '');
    setStatus(b.status || 'draft');
    setExistingImage(b.image || null);
    setOriginalSlug(b.slug || '');
    setCurrentPreviewSlug(b.slug || '');
    setOriginalValues({
      title: b.title || '',
      content: b.content || '',
      status: b.status || 'draft',
    });
  }, [blogFromState, navigate, toast]);

  function clearError(field) {
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    const t = title.trim();
    if (!t) errs.title = 'Blog title cannot be empty.';
    else if (t.length < 5) errs.title = `Title is too short — minimum 5 characters (currently ${t.length}).`;
    else if (t.length > 200) errs.title = `Title is too long — maximum 200 characters (currently ${t.length}).`;

    const c = content.trim();
    if (!c) errs.content = 'Blog content cannot be empty.';
    else if (c.length < 50) errs.content = `Content is too short — minimum 50 characters (currently ${c.length}).`;

    if (newImages.length > 0) {
      const file = newImages[0];
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errs.image = 'Only JPEG, PNG, and WebP images are allowed.';
      } else if (file.size > MAX_IMAGE_SIZE) {
        errs.image = `Image is too large — maximum 5 MB (currently ${(file.size / 1024 / 1024).toFixed(1)} MB).`;
      }
    }

    // Don't allow both a new image and remove at the same time
    if (newImages.length > 0 && removeImage) {
      errs.image = 'Cannot upload a new image and remove the existing one at the same time. Uncheck "Remove image" first.';
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

      // Only send changed fields
      if (title.trim() !== originalValues.title) fd.append('title', title.trim());
      if (content !== originalValues.content) fd.append('content', content);
      if (status !== originalValues.status) fd.append('status', status);
      if (newImages.length > 0) fd.append('image', newImages[0]);
      if (removeImage) fd.append('removeImage', 'true');

      const res = await updateBlog(blogId, fd);
      toast.success('Blog updated successfully.');

      // Use response slug for preview link (title change regenerates slug)
      const updatedBlog = res.data;
      if (updatedBlog?.slug) {
        setCurrentPreviewSlug(updatedBlog.slug);
      }

      navigate('/osi-console/blogs');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // If blog data wasn't in state, we've already started a redirect above
  if (!blogFromState) return null;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">Edit Blog</h2>
          <p className="admin-page__sub">Update blog details and content.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {currentPreviewSlug && status === 'published' && (
            <a
              href={`/blog/${currentPreviewSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--ghost"
            >
              Preview ↗
            </a>
          )}
          <Link to="/osi-console/blogs" className="admin-btn admin-btn--ghost">← Back</Link>
        </div>
      </div>

      <form id="edit-blog-form" className="admin-card admin-form-wide" onSubmit={handleSubmit} noValidate>
        <LoadingOverlay visible={loading} message="Saving changes…" />
        <FormErrorBanner errors={errors} />

        <div className="admin-form-grid">
          <FormField
            id="eb-title"
            label="Title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
            error={errors.title}
          />

          <div className="admin-form-field">
            <label htmlFor="eb-status" className="admin-form-field__label">Status</label>
            <select
              id="eb-status"
              className="admin-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Content with Markdown preview toggle */}
        <div className="admin-form-field">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label htmlFor="eb-content" className="admin-form-field__label" style={{ margin: 0 }}>
              Content
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
              id="eb-content"
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

        {/* Existing image */}
        {existingImage?.url && !removeImage && (
          <div className="admin-form-field">
            <label className="admin-form-field__label">Current Image</label>
            <div className="admin-existing-images">
              <div className="admin-existing-images__item">
                <img
                  src={existingImage.url}
                  alt="Blog cover"
                  className="admin-existing-images__img"
                />
                <button
                  type="button"
                  className="admin-existing-images__action"
                  onClick={() => { setRemoveImage(true); clearError('image'); }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Undo remove image */}
        {existingImage?.url && removeImage && (
          <div className="admin-form-field">
            <label className="admin-form-field__label">Current Image</label>
            <div className="admin-existing-images">
              <div className="admin-existing-images__item admin-existing-images__item--removed">
                <img
                  src={existingImage.url}
                  alt="Blog cover"
                  className="admin-existing-images__img"
                />
                <span className="admin-existing-images__badge">Will remove</span>
                <button
                  type="button"
                  className="admin-existing-images__action admin-existing-images__action--undo"
                  onClick={() => setRemoveImage(false)}
                >
                  Undo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New image upload — show when no existing image or it's marked for removal */}
        {(!existingImage?.url || removeImage) && (
          <FileUpload
            id="eb-image"
            label="Upload Cover Image (JPEG, PNG, WebP · max 5 MB)"
            accept="image/jpeg,image/png,image/webp"
            files={newImages}
            onChange={(files) => { setNewImages(files); clearError('image'); }}
            error={errors.image}
            hint="Optional. Upload 1 cover image."
          />
        )}

        <div className="admin-form-actions">
          <Link to="/osi-console/blogs" className="admin-btn admin-btn--ghost">Cancel</Link>
          <button id="eb-submit" type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
