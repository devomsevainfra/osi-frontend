import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getBlogs, deleteBlog } from '../../lib/blogApi';
import { AdminTable } from '../../components/ui/AdminTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';

const CAN_WRITE = ['ADMIN', 'ENGINEER'];

/** Format ISO date to short readable string */
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BlogsPage() {
  const { role } = useAuth();
  const toast = useToast();
  const canWrite = CAN_WRITE.includes(role);

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalBlogs: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBlogs(page, 15);
      setBlogs(res.data?.blogs || []);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, totalBlogs: 0 });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteBlog(deleteTarget._id);
      toast.success('Blog deleted.');
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = blogs.map((b) => [
    <span className="admin-table__primary">{b.title}</span>,
    <StatusBadge value={b.status} />,
    fmtDate(b.createdAt),
    fmtDate(b.updatedAt),
    b.image?.url ? 'Yes' : 'No',
    <div className="admin-table__actions">
      {b.status === 'published' && (
        <a
          href={`/blog/${b.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn--xs admin-btn--ghost"
        >
          Preview
        </a>
      )}
      {canWrite && (
        <>
          <Link
            to={`/osi-console/blogs/${b._id}/edit`}
            state={{ blog: b }}
            className="admin-btn admin-btn--xs admin-btn--ghost"
          >
            Edit
          </Link>
          <button
            className="admin-btn admin-btn--xs admin-btn--danger"
            onClick={() => setDeleteTarget(b)}
          >
            Delete
          </button>
        </>
      )}
      {!canWrite && !b.status !== 'published' && (
        <span className="admin-table__readonly">View only</span>
      )}
    </div>,
  ]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">Blogs</h2>
          <p className="admin-page__sub">{pagination.totalBlogs} total blog{pagination.totalBlogs !== 1 ? 's' : ''}</p>
        </div>
        {canWrite && (
          <Link to="/osi-console/blogs/new" id="create-blog-btn" className="admin-btn admin-btn--primary">
            + New Blog
          </Link>
        )}
      </div>

      {loading ? (
        <div className="admin-page-center"><Spinner size="lg" /></div>
      ) : (
        <AdminTable
          headers={['Title', 'Status', 'Created', 'Updated', 'Image', 'Actions']}
          rows={rows}
          emptyMessage="No blogs found."
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="admin-pagination">
          <button className="admin-btn admin-btn--ghost admin-btn--sm"
            disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span className="admin-pagination__info">Page {page} of {pagination.totalPages}</span>
          <button className="admin-btn admin-btn--ghost admin-btn--sm"
            disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
            Next →
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Blog"
        message={`Permanently delete "${deleteTarget?.title}"? This also removes the associated image.`}
        confirmLabel={deleteLoading ? 'Deleting…' : 'Delete'}
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
