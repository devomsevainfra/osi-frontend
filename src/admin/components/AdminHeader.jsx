import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './ui/StatusBadge';

/**
 * @param {Object} props
 * @param {string} props.pageTitle
 */
export function AdminHeader({ pageTitle }) {
  const { user, logout } = useAuth();

  return (
    <header className="admin-header">
      <h1 className="admin-header__title">{pageTitle}</h1>
      <div className="admin-header__right">
        <div className="admin-header__user">
          <StatusBadge value={user?.role} />
        </div>
        <button
          id="admin-logout-btn"
          className="admin-btn admin-btn--ghost admin-btn--sm"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </header>
  );
}
