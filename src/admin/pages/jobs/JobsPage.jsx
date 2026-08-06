import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { AdminTable } from '../../components/ui/AdminTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';

const DEPARTMENTS = ['', 'Engineering', 'Design', 'Surveying', 'Management', 'Administration', 'Other'];
const EMP_TYPES   = ['', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const IS_LIVE_OPTS = [
  { value: '', label: 'All Statuses' },
  { value: 'true', label: 'Live only' },
  { value: 'false', label: 'Draft only' },
];
const CAN_WRITE = ['ADMIN', 'RECRUITER'];

export function JobsPage() {
  const { role } = useAuth();
  const toast = useToast();
  const canWrite = CAN_WRITE.includes(role);

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalJobs: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch]           = useState('');
  const [department, setDepartment]   = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [isLive, setIsLive]           = useState('');
  const [page, setPage]               = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search)         params.set('search', search);
      if (department)     params.set('department', department);
      if (employmentType) params.set('employmentType', employmentType);
      if (isLive !== '')  params.set('isLive', isLive);

      const res = await api.get(`/job/getJobs?${params}`);
      setJobs(res.data?.jobs || []);
      setPagination(res.data?.pagination || { page: 1, totalPages: 1, totalJobs: 0 });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, department, employmentType, isLive]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/job/deleteJob/${deleteTarget._id}`);
      toast.success('Job deleted.');
      setDeleteTarget(null);
      fetchJobs();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = jobs.map((j) => [
    <span className="admin-table__primary">{j.title}</span>,
    j.department || '—',
    j.location || '—',
    j.employmentType || '—',
    j.experienceLevel || '—',
    <StatusBadge value={j.isLive ? 'live' : 'draft'} />,
    <div className="admin-table__actions">
      {canWrite && (
        <>
          <Link to={`/osi-console/jobs/${j._id}/edit`} className="admin-btn admin-btn--xs admin-btn--ghost">
            Edit
          </Link>
          <button
            className="admin-btn admin-btn--xs admin-btn--danger"
            onClick={() => setDeleteTarget(j)}
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
          <h2 className="admin-page__title">Jobs</h2>
          <p className="admin-page__sub">{pagination.totalJobs} total job{pagination.totalJobs !== 1 ? 's' : ''}</p>
        </div>
        {canWrite && (
          <Link to="/osi-console/jobs/create" id="create-job-btn" className="admin-btn admin-btn--primary">
            + New Job
          </Link>
        )}
      </div>

      {/* Filters */}
      <form className="admin-filters" onSubmit={handleSearch}>
        <input
          id="jobs-search"
          type="search"
          className="admin-input admin-input--search"
          placeholder="Search title, location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select id="jobs-department" className="admin-select" value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.filter(Boolean).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select id="jobs-employment-type" className="admin-select" value={employmentType}
          onChange={(e) => { setEmploymentType(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          {EMP_TYPES.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select id="jobs-is-live" className="admin-select" value={isLive}
          onChange={(e) => { setIsLive(e.target.value); setPage(1); }}>
          {IS_LIVE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button type="submit" className="admin-btn admin-btn--primary">Search</button>
      </form>

      {loading ? (
        <div className="admin-page-center"><Spinner size="lg" /></div>
      ) : (
        <AdminTable
          headers={['Title', 'Department', 'Location', 'Type', 'Experience', 'Live', 'Actions']}
          rows={rows}
          emptyMessage="No jobs found."
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
        title="Delete Job"
        message={`Permanently delete the "${deleteTarget?.title}" listing?`}
        confirmLabel={deleteLoading ? 'Deleting…' : 'Delete'}
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
