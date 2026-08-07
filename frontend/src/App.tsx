import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ToastHost } from './components/ToastHost';
import { useThemeStore } from './store/themeStore';
import { HomePage } from './pages/HomePage';
import { MarketsPage } from './pages/MarketsPage';
import { MarketDetailPage } from './pages/MarketDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { WalletPage } from './pages/WalletPage';
import { DepositPage } from './pages/DepositPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReferralsPage } from './pages/ReferralsPage';
import { SocialPage } from './pages/SocialPage';

function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-[calc(4rem+var(--safe-bottom))] lg:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/market/:slug" element={<MarketDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/referral" element={<ReferralsPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/social" element={<SocialPage />} />
        </Routes>
      </main>
      <ToastHost />
      <BottomNav />
    </>
  );
}

export default App;
