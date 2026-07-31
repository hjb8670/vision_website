// LMSR (Logarithmic Market Scoring Rule) AMM — demo-mvp-scope.md §5.2
//
// C(qYes, qNo) = b * ln(e^(qYes/b) + e^(qNo/b))
// price(YES)   = e^(qYes/b) / (e^(qYes/b) + e^(qNo/b))
// cost(trade)  = C(after) - C(before)
//
// Uses the log-sum-exp shift (subtract max exponent) so e^(q/b) never overflows
// for large outstanding share counts.

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

export function priceForOutcome(
  qYes: number,
  qNo: number,
  b: number,
  outcome: Outcome,
): number {
  const py = yesPrice(qYes, qNo, b);
  return outcome === 'YES' ? py : 1 - py;
}

/**
 * Cost (positive = user pays, negative = user receives) to move qYes/qNo by
 * buying/selling `quantity` shares of `outcome`.
 */
export function tradeCost(
  qYes: number,
  qNo: number,
  b: number,
  outcome: Outcome,
  side: 'BUY' | 'SELL',
  quantity: number,
): { cost: number; newQYes: number; newQNo: number; avgPrice: number } {
  const delta = side === 'BUY' ? quantity : -quantity;
  const newQYes = outcome === 'YES' ? qYes + delta : qYes;
  const newQNo = outcome === 'NO' ? qNo + delta : qNo;

  const before = cost(qYes, qNo, b);
  const after = cost(newQYes, newQNo, b);
  const tradeCostValue = after - before;

  return {
    cost: tradeCostValue,
    newQYes,
    newQNo,
    avgPrice:
      quantity === 0
        ? priceForOutcome(qYes, qNo, b, outcome)
        : Math.abs(tradeCostValue) / quantity,
  };
}
