import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

/**
 * Persistent admin layout wrapper.
 * Uses React Router's <Outlet> so pages just render inside it.
 * 
 * @param {Object} props
 * @param {string} props.pageTitle
 */
export function AdminShell({ pageTitle }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-shell ${collapsed ? 'admin-shell--collapsed' : ''}`}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="admin-shell__body">
        <AdminHeader pageTitle={pageTitle} />
        <main className="admin-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
