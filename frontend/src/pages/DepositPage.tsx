import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useWalletBalance } from '../hooks/useWallet';
import { useTranslation } from '../lib/i18n/useTranslation';

const QUICK_AMOUNTS = [10, 25, 100];

export function DepositPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const push = useToastStore((s) => s.push);
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const { data: wallet } = useWalletBalance();

  const handoffToken = searchParams.get('handoff');
  const status = searchParams.get('status');
  const returnTo = searchParams.get('return_to');

  const [resolvingHandoff, setResolvingHandoff] = useState(!!handoffToken);
  const [amount, setAmount] = useState(25);
  const [submitting, setSubmitting] = useState(false);
  const [appReturnUrl, setAppReturnUrl] = useState(() => sessionStorage.getItem('vision_return_to'));

  useEffect(() => {
    if (returnTo) {
      sessionStorage.setItem('vision_return_to', returnTo);
      setAppReturnUrl(returnTo);
    }
  }, [returnTo]);

  useEffect(() => {
    if (!handoffToken) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.post('/payment-handoff/redeem', { token: handoffToken });
        if (!cancelled) setAuth(data.accessToken, data.user);
      } catch {
        if (!cancelled) push(t('depositPage.handoffFailed'), 'error');
      } finally {
        if (!cancelled) setResolvingHandoff(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoffToken]);

  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    } else if (status === 'cancelled') {
      push(t('depositPage.cancelled'), 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (resolvingHandoff) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-text-secondary">
        {t('depositPage.signingIn')}
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  async function handleDeposit() {
    setSubmitting(true);
    try {
      const { data } = await api.post('/wallet/deposit/stripe/checkout-session', { amount });
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      push(err?.response?.data?.message ?? t('depositPage.checkoutFailed'), 'error');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">{t('depositPage.heading')}</h1>
      <p className="text-sm text-text-secondary mb-6">
        {t('depositPage.balance', { amount: wallet?.balance?.toFixed(2) ?? '0.00' })}
      </p>

      {status === 'success' && (
        <div className="rounded-xl bg-bg-elevated border border-white/10 p-4 mb-6 text-sm">
          <p className="font-semibold mb-1">{t('depositPage.successHeading')}</p>
          <p className="text-text-secondary mb-3">{t('depositPage.returnToApp')}</p>
          {appReturnUrl && (
            <button
              type="button"
              onClick={() => {
                window.location.href = appReturnUrl;
              }}
              className="w-full py-2.5 rounded-full bg-accent-primary hover:bg-accent-secondary font-bold text-white transition-colors"
            >
              {t('depositPage.returnToAppButton')}
            </button>
          )}
        </div>
      )}

      <div className="bg-bg-elevated rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-xs text-text-secondary block mb-2">{t('depositPage.amountLabel')}</label>
          <div className="flex gap-2 mb-3">
            {QUICK_AMOUNTS.map((qa) => (
              <button
                key={qa}
                type="button"
                onClick={() => setAmount(qa)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  amount === qa ? 'bg-accent-primary text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10'
                }`}
              >
                ${qa}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-text-primary focus:outline-none focus:border-accent-primary"
          />
        </div>

        <button
          type="button"
          disabled={submitting || !(amount > 0)}
          onClick={handleDeposit}
          className="w-full py-2.5 rounded-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 font-bold text-white transition-colors"
        >
          {submitting ? t('depositPage.redirecting') : t('depositPage.continueToStripe')}
        </button>

        <p className="text-xs text-text-secondary text-center">{t('depositPage.virtualNotice')}</p>
      </div>
    </div>
  );
}
