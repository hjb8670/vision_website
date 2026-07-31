import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useWalletBalance } from '../hooks/useWallet';
import { tradeCost, priceForOutcome, type Outcome } from '../lib/amm';
import type { MarketDetail } from '../lib/types';

export function TradePanel({ market }: { market: MarketDetail }) {
  const { token } = useAuthStore();
  const { data: wallet } = useWalletBalance();
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [outcome, setOutcome] = useState<Outcome>('YES');
  const [quantity, setQuantity] = useState(10);

  const preview = useMemo(() => {
    if (quantity <= 0) return { cost: 0, price: priceForOutcome(market.qYes, market.qNo, market.liquidityB, outcome) };
    const cost = tradeCost(market.qYes, market.qNo, market.liquidityB, outcome, side, quantity);
    return { cost, price: Math.abs(cost) / quantity };
  }, [market, outcome, side, quantity]);

  const balance = wallet?.balance ?? 0;
  const exceedsBalance = side === 'BUY' && preview.cost > balance;
  const isClosed = market.status !== 'OPEN';

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/orders', { marketId: market.id, outcome, side, quantity });
      return data;
    },
    onSuccess: () => {
      push(`${side === 'BUY' ? 'Bought' : 'Sold'} ${quantity} ${outcome} shares`, 'success');
      queryClient.invalidateQueries({ queryKey: ['market', market.slug] });
      queryClient.invalidateQueries({ queryKey: ['market-history', market.id] });
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
    onError: (err: any) => {
      push(err?.response?.data?.message ?? 'Trade failed', 'error');
    },
  });

  if (!token) {
    return (
      <div className="bg-bg-elevated border border-white/10 rounded-xl p-5 text-center space-y-3">
        <p className="text-sm text-text-secondary">Log in to trade on this market.</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full py-2 rounded-md bg-accent-primary hover:bg-accent-secondary font-semibold text-white transition-colors"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-elevated border border-white/10 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-1 bg-black/30 rounded-md p-1">
        {(['BUY', 'SELL'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`py-2 rounded text-sm font-semibold transition-colors ${
              side === s ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setOutcome('YES')}
          className={`py-3 rounded-md font-bold text-sm border transition-colors ${
            outcome === 'YES'
              ? 'text-bg-primary'
              : 'border-white/10 text-text-secondary hover:text-text-primary'
          }`}
          style={outcome === 'YES' ? { background: 'var(--color-yes)', borderColor: 'var(--color-yes)' } : undefined}
        >
          YES {Math.round(priceForOutcome(market.qYes, market.qNo, market.liquidityB, 'YES') * 100)}%
        </button>
        <button
          type="button"
          onClick={() => setOutcome('NO')}
          className={`py-3 rounded-md font-bold text-sm border transition-colors ${
            outcome === 'NO' ? 'text-white' : 'border-white/10 text-text-secondary hover:text-text-primary'
          }`}
          style={outcome === 'NO' ? { background: 'var(--color-no)', borderColor: 'var(--color-no)' } : undefined}
        >
          NO {Math.round(priceForOutcome(market.qYes, market.qNo, market.liquidityB, 'NO') * 100)}%
        </button>
      </div>

      <div>
        <label className="text-xs text-text-secondary block mb-1">Quantity (shares)</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 5))}
            className="w-9 h-9 rounded-md bg-white/5 border border-white/10 text-lg leading-none"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
            className="flex-1 text-center bg-white/5 border border-white/10 rounded-md py-2 focus:outline-none focus:border-accent-primary"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 5)}
            className="w-9 h-9 rounded-md bg-white/5 border border-white/10 text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-sm space-y-1 border-t border-white/10 pt-3">
        <div className="flex justify-between text-text-secondary">
          <span>Avg. price</span>
          <span>{(preview.price * 100).toFixed(1)}¢</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>{side === 'BUY' ? 'Cost' : 'Proceeds'}</span>
          <span>${Math.abs(preview.cost).toFixed(2)}</span>
        </div>
        {side === 'BUY' && (
          <div className="flex justify-between text-text-secondary">
            <span>Potential payout if {outcome} wins</span>
            <span>${quantity.toFixed(2)}</span>
          </div>
        )}
      </div>

      {exceedsBalance && (
        <p className="text-xs text-error">Insufficient balance — you have ${balance.toFixed(2)}.</p>
      )}

      <button
        type="button"
        disabled={isClosed || quantity <= 0 || exceedsBalance || mutation.isPending}
        onClick={() => mutation.mutate()}
        className="w-full py-3 rounded-md bg-accent-primary hover:bg-accent-secondary disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white transition-colors"
      >
        {isClosed ? 'Market closed' : mutation.isPending ? 'Submitting…' : `${side} ${outcome}`}
      </button>
    </div>
  );
}
