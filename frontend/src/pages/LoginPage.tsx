import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useTranslation } from '../lib/i18n/useTranslation';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.accessToken, data.user);
      push(t('loginPage.welcomeBack', { username: data.user.username }));
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('loginPage.loginFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">{t('loginPage.heading')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-text-secondary block mb-1">{t('loginPage.email')}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary"
          />
        </div>
        <div>
          <label className="text-xs text-text-secondary block mb-1">{t('loginPage.password')}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary"
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 font-bold text-white transition-colors"
        >
          {loading ? t('loginPage.loggingIn') : t('loginPage.logIn')}
        </button>
      </form>
      <p className="text-sm text-text-secondary text-center mt-4">
        {t('loginPage.noAccount')}
        <Link to="/register" className="text-accent-primary hover:underline">
          {t('loginPage.signUp')}
        </Link>
      </p>
    </div>
  );
}
