import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle2, Clock3, Database, HardDrive, Server, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { api } from '../lib/api';
import logo from '../../assets/logo.png';

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function HealthMetric({ label, value }) {
  return (
    <div className="admin-health-metric">
      <span className="admin-health-metric__label">{label}</span>
      <strong className="admin-health-metric__value">{value ?? '—'}</strong>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Healthcheck state
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState('');
  const [showHealth, setShowHealth] = useState(false);
  const health = healthData?.data;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/osi-console/dashboard', { replace: true });
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  }

  async function handleHealthcheck() {
    setHealthLoading(true);
    setHealthError('');
    setHealthData(null);
    setShowHealth(true);

    try {
      const data = await api.get('/info/healthcheck');
      setHealthData(data);
    } catch (err) {
      setHealthError(err.message || 'Failed to reach the server.');
    } finally {
      setHealthLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      {/* Left panel – branding */}
      <div className="admin-login-brand">
        <div className="admin-login-brand__inner">
          <img src={logo} alt="Om Seva" className="admin-login-brand__logo" />
          <h1 className="admin-login-brand__title">Om Seva Design &amp; Build</h1>
          <p className="admin-login-brand__sub">Admin Management Portal</p>
          <div className="admin-login-brand__divider" />
          <p className="admin-login-brand__tagline">
            Manage users, projects, and your team from one place.
          </p>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="admin-login-form-panel">
        <form
          id="admin-login-form"
          className="admin-login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="admin-login-form__header">
            <h2 className="admin-login-form__title">Welcome back</h2>
            <p className="admin-login-form__sub">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="admin-alert admin-alert--error" role="alert">
              {error}
            </div>
          )}

          <div className="admin-form-field">
            <label htmlFor="login-email" className="admin-form-field__label">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              required
              autoFocus
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="login-password" className="admin-form-field__label">
              Password
            </label>
            <div className="admin-input-group">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="admin-input admin-input--with-action"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password@123"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-input-action"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--full"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Sign In'}
          </button>

          <p className="admin-login-form__footer">
            Session expires after ~15 minutes of inactivity.
          </p>
        </form>

        {/* Healthcheck button – sits below the form card */}
        <button
          id="admin-healthcheck-btn"
          type="button"
          className="admin-healthcheck-trigger"
          onClick={handleHealthcheck}
          disabled={healthLoading}
        >
          {healthLoading ? <Spinner size="sm" /> : '🩺'} Server Health
        </button>
      </div>

      {/* Healthcheck modal */}
      {showHealth && (
        <div
          className="admin-healthcheck-overlay"
          onClick={() => setShowHealth(false)}
        >
          <div
            className="admin-healthcheck-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="healthcheck-title"
          >
            <div className="admin-healthcheck-modal__header">
              <div>
                <p className="admin-healthcheck-modal__eyebrow">System status</p>
                <h3 id="healthcheck-title">Server Healthcheck</h3>
              </div>
              <button
                type="button"
                className="admin-healthcheck-modal__close"
                onClick={() => setShowHealth(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-healthcheck-modal__body">
              {healthLoading && (
                <div className="admin-healthcheck-modal__loading">
                  <Spinner size="md" />
                  <p>Checking server…</p>
                </div>
              )}

              {healthError && (
                <div className="admin-alert admin-alert--error">{healthError}</div>
              )}

              {healthData && (
                <div className="admin-healthcheck-modal__data">
                  <div className={`admin-health-status ${health?.isHealthy ? 'admin-health-status--healthy' : 'admin-health-status--unhealthy'}`}>
                    <span className="admin-health-status__icon">
                      {health?.isHealthy ? <CheckCircle2 size={24} /> : <Activity size={24} />}
                    </span>
                    <div>
                      <strong>{health?.isHealthy ? 'All systems operational' : 'System needs attention'}</strong>
                      <p>{healthData.message || 'Healthcheck completed.'}</p>
                    </div>
                    <span className="admin-health-status__code">HTTP {healthData.httpStatusCode}</span>
                  </div>

                  <div className="admin-health-section">
                    <div className="admin-health-section__heading">
                      <Server size={18} />
                      <h4>Server</h4>
                      <span className="admin-health-badge">Running</span>
                    </div>
                    <div className="admin-health-grid">
                      <HealthMetric label="Service" value={health?.server?.name} />
                      <HealthMetric label="Version" value={health?.server?.version} />
                      <HealthMetric label="Environment" value={health?.server?.environment} />
                      <HealthMetric label="Port" value={health?.server?.port} />
                      <HealthMetric label="Node.js" value={health?.server?.nodeVersion} />
                      <HealthMetric label="Uptime" value={health?.server?.uptime} />
                    </div>
                    <div className="admin-health-started">
                      <Clock3 size={15} /> Started {formatDate(health?.server?.startedAt)}
                    </div>
                  </div>

                  <div className="admin-health-section">
                    <div className="admin-health-section__heading">
                      <Database size={18} />
                      <h4>Database</h4>
                      <span className={`admin-health-badge ${health?.database?.status === 'connected' ? '' : 'admin-health-badge--danger'}`}>
                        {health?.database?.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="admin-health-grid admin-health-grid--database">
                      <HealthMetric label="Database" value={health?.database?.name} />
                      <HealthMetric label="Ping" value={health?.database?.ping} />
                      <HealthMetric label="Host" value={health?.database?.host} />
                      <HealthMetric label="Port" value={health?.database?.port} />
                    </div>
                  </div>

                  <div className="admin-health-section">
                    <div className="admin-health-section__heading">
                      <HardDrive size={18} />
                      <h4>Memory usage</h4>
                    </div>
                    <div className="admin-health-grid admin-health-grid--memory">
                      <HealthMetric label="Heap used" value={formatBytes(health?.server?.memory?.heapUsed)} />
                      <HealthMetric label="Heap total" value={formatBytes(health?.server?.memory?.heapTotal)} />
                      <HealthMetric label="Resident set" value={formatBytes(health?.server?.memory?.rss)} />
                      <HealthMetric label="External" value={formatBytes(health?.server?.memory?.external)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
