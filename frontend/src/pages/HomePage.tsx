import { Link } from 'react-router-dom';
import { useMarkets } from '../hooks/useMarkets';
import { MarketCard } from '../components/MarketCard';

export function HomePage() {
  const { data: trending } = useMarkets('trending');
  const { data: newest } = useMarkets('newest');

  const featured = (trending ?? []).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <section
        className="rounded-2xl bg-bg-elevated border border-white/10 p-8 md:p-12 text-center"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 0%, rgba(232, 54, 47, 0.15), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(255, 255, 255, 0.04), transparent 50%)',
        }}
      >
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3">Trade on what happens next.</h1>
        <p className="text-text-secondary max-w-xl mx-auto mb-6">
          Buy and sell shares on real-world outcomes — politics, crypto, sports, and more. Trade with a free virtual
          balance.
        </p>
        <Link
          to="/markets"
          className="inline-block px-6 py-3 rounded-md bg-accent-primary hover:bg-accent-secondary font-bold text-white transition-colors"
        >
          Explore markets
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trending now</h2>
          <Link to="/markets" className="text-sm text-accent-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Newest markets</h2>
          <Link to="/markets" className="text-sm text-accent-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(newest ?? []).slice(0, 8).map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
