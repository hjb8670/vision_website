// Mirrors backend/src/markets/amm.ts — used client-side only for a live
// cost/payout preview in TradePanel. The server always recomputes and is
// the source of truth for the actual trade.

export type Outcome = 'YES' | 'NO';

function cost(qYes: number, qNo: number, b: number): number {
  const m = Math.max(qYes, qNo);
  return m + b * Math.log(Math.exp((qYes - m) / b) + Math.exp((qNo - m) / b));
}

export function yesPrice(qYes: number, qNo: number, b: number): number {
  const m = Math.max(qYes, qNo);
  const eYes = Math.exp((qYes - m) / b);
  const eNo = Math.exp((qNo - m) / b);
  return eYes / (eYes + eNo);
}

export function priceForOutcome(qYes: number, qNo: number, b: number, outcome: Outcome): number {
  const py = yesPrice(qYes, qNo, b);
  return outcome === 'YES' ? py : 1 - py;
}

export function tradeCost(
  qYes: number,
  qNo: number,
  b: number,
  outcome: Outcome,
  side: 'BUY' | 'SELL',
  quantity: number,
): number {
  const delta = side === 'BUY' ? quantity : -quantity;
  const newQYes = outcome === 'YES' ? qYes + delta : qYes;
  const newQNo = outcome === 'NO' ? qNo + delta : qNo;
  return cost(newQYes, newQNo, b) - cost(qYes, qNo, b);
}

/**
 * Inverts tradeCost via binary search: given a target dollar amount, finds the
 * share quantity that costs (BUY) or returns (SELL) approximately that amount.
 * tradeCost is monotonic in quantity, so binary search converges reliably.
 */
export function quantityForCost(
  qYes: number,
  qNo: number,
  b: number,
  outcome: Outcome,
  side: 'BUY' | 'SELL',
  targetAmount: number,
): number {
  if (targetAmount <= 0) return 0;

  let lo = 0;
  let hi = 1;
  while (Math.abs(tradeCost(qYes, qNo, b, outcome, side, hi)) < targetAmount && hi < 1e8) {
    hi *= 2;
  }

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const c = Math.abs(tradeCost(qYes, qNo, b, outcome, side, mid));
    if (c < targetAmount) lo = mid;
    else hi = mid;
  }

  return (lo + hi) / 2;
}
