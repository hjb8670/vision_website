import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.accessToken, data.user);
      push(`Welcome back, ${data.user.username}!`);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-text-secondary block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bg-elevated border border-white/10 rounded-md px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary"
          />
        </div>
        <div>
          <label className="text-xs text-text-secondary block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-bg-elevated border border-white/10 rounded-md px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary"
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 font-bold text-white transition-colors"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="text-sm text-text-secondary text-center mt-4">
        No account?{' '}
        <Link to="/register" className="text-accent-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
