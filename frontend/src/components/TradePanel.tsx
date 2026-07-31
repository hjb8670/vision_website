import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useWalletBalance } from '../hooks/useWallet';
import { usePositions } from '../hooks/usePositions';
import { useDepositModalStore } from '../store/depositModalStore';
import { priceForOutcome, quantityForCost, tradeCost, type Outcome } from '../lib/amm';
import { CategoryIcon } from './CategoryIcon';
import type { MarketDetail } from '../lib/types';

const QUICK_AMOUNTS = [1, 5, 10, 100];

export function TradePanel({ market }: { market: MarketDetail }) {
  const { token } = useAuthStore();
  const { data: wallet } = useWalletBalance();
  const { data: positions } = usePositions();
  const push = useToastStore((s) => s.push);
  const openDeposit = useDepositModalStore((s) => s.open);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [outcome, setOutcome] = useState<Outcome>('YES');
  const [amount, setAmount] = useState(0);

  const balance = wallet?.balance ?? 0;
  const isClosed = market.status !== 'OPEN';
  const held = positions?.find((p) => p.market.id === market.id && p.outcome === outcome)?.quantity ?? 0;

  const preview = useMemo(() => {
    const quantity = quantityForCost(market.qYes, market.qNo, market.liquidityB, outcome, side, amount);
    const cost = amount > 0 ? tradeCost(market.qYes, market.qNo, market.liquidityB, outcome, side, quantity) : 0;
    const price = quantity > 0 ? Math.abs(cost) / quantity : priceForOutcome(market.qYes, market.qNo, market.liquidityB, outcome);
    return { quantity, cost, price };
  }, [market, outcome, side, amount]);

  const exceedsBalance = side === 'BUY' && amount > balance;
  const exceedsHeld = side === 'SELL' && preview.quantity > held;
  const needsDeposit = side === 'BUY' && balance <= 0;

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/orders', {
        marketId: market.id,
        outcome,
        side,
        quantity: side === 'SELL' ? Math.min(preview.quantity, held) : preview.quantity,
      });
      return data;
    },
    onSuccess: () => {
      push(`${side === 'BUY' ? 'Bought' : 'Sold'} ~${preview.quantity.toFixed(1)} ${outcome} shares`, 'success');
      setAmount(0);
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
      <div className="bg-bg-elevated rounded-2xl p-5 text-center space-y-3">
        <p className="text-sm text-text-secondary">Log in to trade on this market.</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full py-2 rounded-full bg-accent-primary hover:bg-accent-secondary font-semibold text-white transition-colors"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-elevated rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <CategoryIcon label={market.category.name} size={40} />
        <div className="min-w-0">
          <p className="text-sm font-semibold line-clamp-1">{market.question}</p>
          <p className="text-xs text-text-secondary">
            {new Date(market.closeDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ·{' '}
            <span style={{ color: outcome === 'YES' ? 'var(--color-yes)' : 'var(--color-no)' }}>{outcome}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 bg-black/30 rounded-full p-1">
        {(['BUY', 'SELL'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`py-2 rounded-full text-sm font-semibold transition-colors ${
              side === s ? 'bg-white/10 text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {s}
          </button>
        ))}
        <div className="col-span-2 flex justify-end pr-2 -mt-0.5">
          <span className="text-[11px] text-text-secondary">Market ▾</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setOutcome('YES')}
          className={`py-3 rounded-md font-bold text-sm transition-colors ${
            outcome === 'YES' ? 'text-bg-primary' : 'bg-white/5 text-text-secondary hover:text-text-primary'
          }`}
          style={outcome === 'YES' ? { background: 'var(--color-yes)' } : undefined}
        >
          YES {Math.round(priceForOutcome(market.qYes, market.qNo, market.liquidityB, 'YES') * 100)}¢
        </button>
        <button
          type="button"
          onClick={() => setOutcome('NO')}
          className={`py-3 rounded-md font-bold text-sm transition-colors ${
            outcome === 'NO' ? 'text-white' : 'bg-white/5 text-text-secondary hover:text-text-primary'
          }`}
          style={outcome === 'NO' ? { background: 'var(--color-no)' } : undefined}
        >
          NO {Math.round(priceForOutcome(market.qYes, market.qNo, market.liquidityB, 'NO') * 100)}¢
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-text-secondary">Amount</span>
          <span className="text-xs text-text-secondary">
            {side === 'SELL' ? `${held.toFixed(2)} shares` : `$${balance.toFixed(2)} cash`}
          </span>
        </div>
        <input
          type="number"
          min={0}
          value={amount || ''}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
          placeholder="0"
          className="w-full bg-transparent text-4xl font-extrabold focus:outline-none"
        />
        <div className="grid grid-cols-4 gap-2 mt-3">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount((v) => v + a)}
              className="py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
            >
              +${a}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm space-y-1 border-t border-white/10 pt-3">
        <div className="flex justify-between text-text-secondary">
          <span>Avg. price</span>
          <span>{(preview.price * 100).toFixed(1)}¢</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Est. shares</span>
          <span>{preview.quantity.toFixed(2)}</span>
        </div>
        {side === 'BUY' && (
          <div className="flex justify-between font-semibold" style={{ color: 'var(--color-success)' }}>
            <span>To win</span>
            <span>${preview.quantity.toFixed(2)}</span>
          </div>
        )}
      </div>

      {exceedsBalance && <p className="text-xs text-error">Insufficient balance — you have ${balance.toFixed(2)}.</p>}
      {exceedsHeld && <p className="text-xs text-error">You only hold {held.toFixed(2)} {outcome} shares.</p>}

      {needsDeposit ? (
        <button
          type="button"
          onClick={openDeposit}
          className="w-full py-3 rounded-full bg-accent-primary hover:bg-accent-secondary font-bold text-white transition-colors"
        >
          Deposit
        </button>
      ) : (
        <button
          type="button"
          disabled={isClosed || amount <= 0 || exceedsBalance || exceedsHeld || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="w-full py-3 rounded-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white transition-colors"
        >
          {isClosed ? 'Market closed' : mutation.isPending ? 'Submitting…' : `${side} ${outcome}`}
        </button>
      )}
    </div>
  );
}
