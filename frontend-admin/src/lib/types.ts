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

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  walletBalance: number | null;
}

export interface DashboardStats {
  totalUsers: number;
  marketsByStatus: { OPEN: number; CLOSED: number; RESOLVED: number };
  totalVolume: number;
  totalWalletBalance: number;
  topMarkets: { question: string; slug: string; orderCount: number }[];
  volumeByDay: { date: string; volume: number }[];
}
