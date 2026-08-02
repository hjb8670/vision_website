import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n/useTranslation';

export function LeaderboardTeaserWidget() {
  const { t } = useTranslation();

  return (
    <div className="bg-bg-elevated rounded-2xl p-5 space-y-3">
      <h2 className="font-bold">{t('home.leaderboardHeading')}</h2>
      <p className="text-sm text-text-secondary">{t('home.leaderboardDescription')}</p>
      <Link
        to="/leaderboard"
        className="inline-block px-4 py-2 rounded-full bg-accent-primary hover:bg-accent-secondary text-sm font-semibold text-white transition-colors"
      >
        {t('home.compete')}
      </Link>
    </div>
  );
}
