// Seed script — demo-mvp-scope.md §7, seed-market-questions.md
// Loads 14 categories + 37 markets (bracket placeholders replaced with concrete,
// plausible names per the source doc's own guidance), simulates 20-30 price
// ticks per market so charts/volume aren't flat, and creates demo users with
// existing positions so leaderboard/portfolio aren't empty on first load.

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { tradeCost, yesPrice, type Outcome } from '../src/markets/amm';

const prisma = new PrismaClient();

const CATEGORIES = [
  'Politics',
  'Sports',
  'Crypto',
  'Esports',
  'Finance',
  'Geopolitics',
  'Tech',
  'Culture',
  'Economy',
  'Weather',
  'Mentions',
  'Elections',
  'Art',
  'World',
];

function slugifyCat(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

interface MarketSeed {
  question: string;
  resolutionSource: string;
  category: string;
  closeDate: string;
}

const MARKETS: MarketSeed[] = [
  // Crypto
  { question: 'Will Bitcoin close above $150,000 by December 31, 2026?', resolutionSource: 'CoinGecko/CoinMarketCap BTC/USD closing price', category: 'Crypto', closeDate: '2026-12-31' },
  { question: "Will Ethereum's market cap exceed Bitcoin's by end of 2026?", resolutionSource: 'CoinGecko market cap ranking', category: 'Crypto', closeDate: '2026-12-31' },
  { question: 'Will a spot Solana ETF be approved by the SEC in 2026?', resolutionSource: 'SEC official filings/announcements', category: 'Crypto', closeDate: '2026-12-31' },
  { question: 'Will any single altcoin gain 500%+ in a calendar month this year?', resolutionSource: 'CoinGecko monthly price data', category: 'Crypto', closeDate: '2026-12-31' },
  // Sports
  { question: 'Will Manchester City beat Arsenal on August 23, 2026?', resolutionSource: 'Official Premier League result', category: 'Sports', closeDate: '2026-08-23' },
  { question: 'Will Luka Dončić score 30+ points in his next game?', resolutionSource: 'Official NBA box score', category: 'Sports', closeDate: '2026-10-15' },
  { question: 'Will Nigeria qualify for the 2027 Africa Cup of Nations knockout stage?', resolutionSource: 'Official CAF announcement', category: 'Sports', closeDate: '2027-01-20' },
  // Politics
  { question: 'Will the US federal government reach a new debt ceiling agreement by December 31, 2026?', resolutionSource: 'Congressional record/major news wire', category: 'Politics', closeDate: '2026-12-31' },
  { question: "Will Germany's parliament pass the proposed pension reform by Q4 2026?", resolutionSource: 'Official Bundestag record', category: 'Politics', closeDate: '2026-12-31' },
  { question: 'Will national voter turnout exceed 60% in the next major election cycle?', resolutionSource: 'Official electoral commission data', category: 'Politics', closeDate: '2026-11-03' },
  // Finance
  { question: 'Will the Federal Reserve cut interest rates at its next FOMC meeting?', resolutionSource: 'Official Fed announcement', category: 'Finance', closeDate: '2026-09-17' },
  { question: "Will Nvidia's stock beat Q3 2026 earnings estimates?", resolutionSource: 'Official earnings release', category: 'Finance', closeDate: '2026-11-19' },
  { question: 'Will the S&P 500 close above 7,000 by year-end 2026?', resolutionSource: 'Official index close', category: 'Finance', closeDate: '2026-12-31' },
  // Geopolitics
  { question: 'Will a ceasefire be reached in the Russia-Ukraine conflict by December 31, 2026?', resolutionSource: 'Major wire service (Reuters/AP)', category: 'Geopolitics', closeDate: '2026-12-31' },
  { question: 'Will the US and India sign a new trade agreement by Q4 2026?', resolutionSource: 'Official government announcement', category: 'Geopolitics', closeDate: '2026-12-31' },
  { question: 'Will any G7 nation see a change in head of government before year-end 2026?', resolutionSource: 'Major wire service', category: 'Geopolitics', closeDate: '2026-12-31' },
  // Tech
  { question: 'Will Apple release the Vision Pro 2 before end of 2026?', resolutionSource: 'Official Apple announcement', category: 'Tech', closeDate: '2026-12-31' },
  { question: 'Will any major AI lab announce a significant new model release in Q4 2026?', resolutionSource: 'Official lab announcement', category: 'Tech', closeDate: '2026-12-31' },
  { question: "Will Databricks' IPO happen by Q4 2026?", resolutionSource: 'SEC filing/stock exchange listing', category: 'Tech', closeDate: '2026-12-31' },
  // Economy
  { question: 'Will US CPI inflation fall below 3% by end of 2026?', resolutionSource: 'Official BLS CPI report', category: 'Economy', closeDate: '2026-12-31' },
  { question: 'Will US unemployment exceed 5% by Q4 2026?', resolutionSource: 'Official BLS jobs report', category: 'Economy', closeDate: '2026-12-31' },
  { question: 'Will any G20 country enter a technical recession in 2026?', resolutionSource: 'Official national statistics agency', category: 'Economy', closeDate: '2026-12-31' },
  // Culture
  { question: 'Will Avengers: Doomsday gross over $1B worldwide at the box office?', resolutionSource: 'Box Office Mojo/official studio figures', category: 'Culture', closeDate: '2026-12-31' },
  { question: 'Will Taylor Swift release a new album by December 31, 2026?', resolutionSource: 'Official artist/label announcement', category: 'Culture', closeDate: '2026-12-31' },
  { question: 'Will the 2027 Grammy Album of the Year winner match the pre-show betting favorite?', resolutionSource: 'Official ceremony result', category: 'Culture', closeDate: '2027-02-01' },
  // Esports
  { question: 'Will T1 win the League of Legends World Championship Finals?', resolutionSource: 'Official tournament result', category: 'Esports', closeDate: '2026-11-08' },
  { question: 'Will Faker be named MVP of the LCK season?', resolutionSource: 'Official league announcement', category: 'Esports', closeDate: '2026-09-30' },
  // Weather
  { question: 'Will Chicago see measurable snowfall before December 1, 2026?', resolutionSource: 'National Weather Service official record', category: 'Weather', closeDate: '2026-12-01' },
  { question: "Will this year's Atlantic hurricane season have more than 15 named storms?", resolutionSource: 'NOAA official season summary', category: 'Weather', closeDate: '2026-11-30' },
  // Elections
  { question: "Will Japan's ruling party retain its majority in the next election?", resolutionSource: 'Official electoral commission', category: 'Elections', closeDate: '2026-10-25' },
  { question: 'Will voter turnout in the 2026 Brazilian general election exceed the previous cycle?', resolutionSource: 'Official electoral commission', category: 'Elections', closeDate: '2026-10-04' },
  // Mentions
  { question: 'Will "AI regulation" be mentioned in the next major central bank policy statement?', resolutionSource: 'Official transcript', category: 'Mentions', closeDate: '2026-09-17' },
  { question: 'Will "recession" trend on X during the next major economic data release?', resolutionSource: 'X Trends (or platform equivalent) at time of release', category: 'Mentions', closeDate: '2026-09-05' },
  // Art
  { question: 'Will any artwork sell for over $50M at a major auction house in 2026?', resolutionSource: "Christie's/Sotheby's official sale results", category: 'Art', closeDate: '2026-12-31' },
  { question: "Will Banksy's next exhibition sell out on opening day?", resolutionSource: 'Gallery/venue announcement', category: 'Art', closeDate: '2026-12-15' },
  // World
  { question: 'Will global population surpass 8.2 billion by end of 2026?', resolutionSource: 'UN World Population Prospects data', category: 'World', closeDate: '2026-12-31' },
  { question: 'Will any new country gain UN membership in 2026?', resolutionSource: 'Official UN announcement', category: 'World', closeDate: '2026-12-31' },
];

const DEMO_USERS = [
  { email: 'ava@demo.vision', username: 'trader_ava' },
  { email: 'kai@demo.vision', username: 'trader_kai' },
  { email: 'noor@demo.vision', username: 'trader_noor' },
  { email: 'leo@demo.vision', username: 'trader_leo' },
];
const DEMO_PASSWORD = 'Demo1234!';
const ADMIN_EMAIL = 'admin@vision.app';
const ADMIN_PASSWORD = 'AdminPass123!';
const STARTING_BALANCE = 1000;

function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function randInt(min: number, max: number) {
  return Math.floor(randRange(min, max + 1));
}
function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

async function main() {
  console.log('Seeding categories...');
  const categoryMap = new Map<string, string>();
  for (const name of CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { slug: slugifyCat(name) },
      update: {},
      create: { name, slug: slugifyCat(name) },
    });
    categoryMap.set(name, cat.id);
  }

  console.log('Seeding markets + simulated price history...');
  const marketIds: string[] = [];

  for (const m of MARKETS) {
    const categoryId = categoryMap.get(m.category)!;
    const liquidityB = randInt(50, 100);

    const existing = await prisma.market.findFirst({ where: { question: m.question } });
    if (existing) {
      marketIds.push(existing.id);
      continue;
    }

    const slug =
      m.question
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 60) +
      '-' +
      Math.random().toString(36).slice(2, 7);

    const market = await prisma.market.create({
      data: {
        slug,
        question: m.question,
        description: `This market resolves based on: ${m.resolutionSource}. Trade YES or NO shares to express your view on the outcome before the close date.`,
        resolutionSource: m.resolutionSource,
        categoryId,
        closeDate: new Date(m.closeDate),
        liquidityB,
        qYes: 0,
        qNo: 0,
      },
    });

    // Simulate 20-30 price ticks over a random 7-30 day window ending now,
    // via a bounded random walk on the YES probability.
    const numPoints = randInt(20, 30);
    const windowDays = randInt(7, 30);
    const now = Date.now();
    const startTime = now - windowDays * 24 * 60 * 60 * 1000;

    let prob = randRange(0.35, 0.65);
    const points: { timestamp: Date; yesProbability: number; volume: number }[] = [];
    for (let i = 0; i < numPoints; i++) {
      const t = startTime + (i / (numPoints - 1)) * (now - startTime);
      prob += randRange(-0.05, 0.05);
      prob = Math.min(0.95, Math.max(0.05, prob));
      points.push({ timestamp: new Date(t), yesProbability: prob, volume: randRange(20, 400) });
    }

    // Derive qYes/qNo consistent with the final simulated probability so live
    // trading continues smoothly from the seeded chart's last point.
    const finalProb = points[points.length - 1].yesProbability;
    const qYes = liquidityB * Math.log(finalProb / (1 - finalProb));
    const qNo = 0;

    await prisma.pricePoint.createMany({
      data: points.map((p) => ({
        marketId: market.id,
        timestamp: p.timestamp,
        yesProbability: p.yesProbability,
        volume: p.volume,
      })),
    });

    await prisma.market.update({ where: { id: market.id }, data: { qYes, qNo } });

    marketIds.push(market.id);
  }

  console.log('Seeding admin account...');
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      username: 'admin',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  console.log('Seeding demo users + positions...');
  for (const du of DEMO_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: du.email } });
    if (existing) continue;

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    const user = await prisma.user.create({
      data: {
        email: du.email,
        username: du.username,
        passwordHash,
        wallet: {
          create: {
            balance: STARTING_BALANCE,
            ledger: { create: { amount: STARTING_BALANCE, type: 'SEED', note: 'Starting virtual balance' } },
          },
        },
      },
      include: { wallet: true },
    });

    const numTrades = randInt(3, 5);
    const tradedMarketIds = new Set<string>();
    for (let i = 0; i < numTrades; i++) {
      const marketId = pick(marketIds.filter((id) => !tradedMarketIds.has(id)));
      if (!marketId) continue;
      tradedMarketIds.add(marketId);

      const market = await prisma.market.findUnique({ where: { id: marketId } });
      if (!market) continue;

      const outcome: Outcome = Math.random() > 0.5 ? 'YES' : 'NO';
      const quantity = randInt(5, 40);
      const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
      if (!wallet) continue;

      const { cost, newQYes, newQNo, avgPrice } = tradeCost(
        market.qYes,
        market.qNo,
        market.liquidityB,
        outcome,
        'BUY',
        quantity,
      );
      if (cost > wallet.balance) continue;

      await prisma.market.update({ where: { id: market.id }, data: { qYes: newQYes, qNo: newQNo } });
      await prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: cost } } });
      await prisma.walletLedger.create({
        data: { walletId: wallet.id, amount: -cost, type: 'TRADE', note: `BUY ${quantity} ${outcome} @ ${market.question}` },
      });
      await prisma.position.create({
        data: { userId: user.id, marketId: market.id, outcome, quantity, avgEntryPrice: avgPrice },
      });
      await prisma.pricePoint.create({
        data: {
          marketId: market.id,
          timestamp: new Date(),
          yesProbability: yesPrice(newQYes, newQNo, market.liquidityB),
          volume: Math.abs(cost),
        },
      });
    }
  }

  console.log('Seed complete.');
  console.log(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`Demo user login: ${DEMO_USERS[0].email} / ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
