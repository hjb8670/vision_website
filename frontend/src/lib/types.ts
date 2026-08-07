export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface MarketSummary {
  id: string;
  slug: string;
  question: string;
  imageUrl: string | null;
  closeDate: string;
  status: 'OPEN' | 'CLOSED' | 'RESOLVED';
  category: Category;
  yesProbability: number;
  volume24h: number;
  recentActivity: number;
  sparkline: number[];
  createdAt: string;
}

export interface MarketDetail extends MarketSummary {
  description: string;
  resolutionSource: string;
  qYes: number;
  qNo: number;
  liquidityB: number;
  resolvedOutcome: 'YES' | 'NO' | null;
}

export interface PricePoint {
  id: string;
  timestamp: string;
  yesProbability: number;
  volume: number;
}

export interface Position {
  id: string;
  market: { id: string; slug: string; question: string; status: MarketSummary['status'] };
  outcome: 'YES' | 'NO';
  quantity: number;
  avgEntryPrice: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnl: number;
}

export interface WalletBalance {
  balance: number;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'SEED' | 'TRADE' | 'PAYOUT' | 'DEPOSIT';
  note: string | null;
  createdAt: string;
}

export interface LeaderboardRow {
  rank: number;
  username: string;
  profit: number;
  winRate: number;
  volume: number;
}

export interface BiggestWin {
  username: string;
  amount: number;
  note: string | null;
}

export interface UserProfile {
  id: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export type SortFilter = 'newest' | 'trending' | 'volume' | 'ending';
