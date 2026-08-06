import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { AdminTable } from '../../components/ui/AdminTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';

const CATEGORIES = ['', 'Construction', 'Transportation', 'Structural', 'Water', 'Surveying'];
const STATUSES = ['', 'Upcoming', 'Ongoing', 'Finished'];
const CAN_WRITE = ['ADMIN', 'ENGINEER'];

export function ProjectsPage() {
  const { role } = useAuth();
  const toast = useToast();
  const canWrite = CAN_WRITE.includes(role);

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalProjects: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (status) params.set('status', status);

      const res = await api.get(`/project/getAllProjects?${params}`);
      setProjects(res.data?.projects || []);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, totalProjects: 0 });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/project/deleteProject/${deleteTarget._id}`);
      toast.success('Project deleted.');
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = projects.map((p) => [
    <span className="admin-table__primary">{p.title}</span>,
    p.category,
    <StatusBadge value={p.status} />,
    p.client,
    p.location,
    <StatusBadge value={p.isLive ? 'live' : 'draft'} />,
    <div className="admin-table__actions">
      {canWrite && (
        <>
          <Link to={`/osi-console/projects/${p._id}/edit`} className="admin-btn admin-btn--xs admin-btn--ghost">
            Edit
          </Link>
          <button
            className="admin-btn admin-btn--xs admin-btn--danger"
            onClick={() => setDeleteTarget(p)}
          >
            Delete
          </button>
        </>
      )}
      {!canWrite && <span className="admin-table__readonly">View only</span>}
    </div>,
  ]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h2 className="admin-page__title">Projects</h2>
          <p className="admin-page__sub">{pagination.totalProjects} total project{pagination.totalProjects !== 1 ? 's' : ''}</p>
        </div>
        {canWrite && (
          <Link to="/osi-console/projects/create" id="create-project-btn" className="admin-btn admin-btn--primary">
            + New Project
          </Link>
        )}
      </div>

      {/* Filters */}
      <form className="admin-filters" onSubmit={handleSearch}>
        <input
          id="projects-search"
          type="search"
          className="admin-input admin-input--search"
          placeholder="Search title, client, location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select id="projects-category" className="admin-select" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {CATEGORIES.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select id="projects-status" className="admin-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" className="admin-btn admin-btn--primary">Search</button>
      </form>

      {loading ? (
        <div className="admin-page-center"><Spinner size="lg" /></div>
      ) : (
        <AdminTable
          headers={['Title', 'Category', 'Status', 'Client', 'Location', 'Live', 'Actions']}
          rows={rows}
          emptyMessage="No projects found."
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
        title="Delete Project"
        message={`Permanently delete "${deleteTarget?.title}"? This also removes all Cloudinary images.`}
        confirmLabel={deleteLoading ? 'Deleting…' : 'Delete'}
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
