const VARIANTS = {
  active:   { label: 'Active',   cls: 'admin-badge admin-badge--green' },
  inactive: { label: 'Inactive', cls: 'admin-badge admin-badge--red'   },
  live:     { label: 'Live',     cls: 'admin-badge admin-badge--green' },
  draft:    { label: 'Draft',    cls: 'admin-badge admin-badge--gray'  },
  published:{ label: 'Published',cls: 'admin-badge admin-badge--green' },
  Ongoing:  { label: 'Ongoing',  cls: 'admin-badge admin-badge--blue'  },
  Upcoming: { label: 'Upcoming', cls: 'admin-badge admin-badge--amber' },
  Finished: { label: 'Finished', cls: 'admin-badge admin-badge--green' },
  SUPERADMIN: { label: 'Superadmin', cls: 'admin-badge admin-badge--purple' },
  ADMIN:      { label: 'Admin',      cls: 'admin-badge admin-badge--blue'   },
  ENGINEER:   { label: 'Engineer',   cls: 'admin-badge admin-badge--teal'   },
  RECRUITER:  { label: 'Recruiter',  cls: 'admin-badge admin-badge--amber'  },
  USER:       { label: 'User',       cls: 'admin-badge admin-badge--gray'   },
  // Application pipeline statuses
  Applied:        { label: 'Applied',        cls: 'admin-badge admin-badge--gray'  },
  'Under Review': { label: 'Under Review',   cls: 'admin-badge admin-badge--amber' },
  Shortlisted:    { label: 'Shortlisted',    cls: 'admin-badge admin-badge--blue'  },
  Rejected:       { label: 'Rejected',       cls: 'admin-badge admin-badge--red'   },
  Hired:          { label: 'Hired',          cls: 'admin-badge admin-badge--green' },
};

export function StatusBadge({ value }) {
  const v = VARIANTS[value] || { label: value, cls: 'admin-badge admin-badge--gray' };
  return <span className={v.cls}>{v.label}</span>;
}
