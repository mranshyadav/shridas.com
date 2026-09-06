import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Sign-in for the CMS.
 *
 * The public header used to carry a "Login" button that opened this flow in a
 * modal, which meant every visitor saw an admin affordance they could never
 * use. The entry point now lives here, at /admin/login, and is not linked from
 * anywhere on the public site.
 */
export function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
    >
      <main className="w-full max-w-sm px-6">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-5" style={{ fontSize: 'var(--fs-h2)' }}>
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="field mt-6">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p role="alert" className="mt-5" style={{ fontSize: 'var(--fs-sm)', color: 'var(--signal)' }}>
              {error}
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary mt-8 w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8" style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-tertiary)' }}>
          This check runs in the browser only and protects nothing on a server. Do not put anything
          sensitive behind it.
        </p>
      </main>
    </div>
  );
}
