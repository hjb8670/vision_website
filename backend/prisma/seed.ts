// Seed script — Mexico-focused Spanish demo data.
// Hard-resets categories/markets/users, then loads 11 categories + 30
// Mexico-localized markets (each with an image), simulates 20-30 price
// ticks per market so charts/volume aren't flat, and creates demo users with
// existing positions so leaderboard/portfolio aren't empty on first load.

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { tradeCost, yesPrice, type Outcome } from '../src/markets/amm';

const prisma = new PrismaClient();

const CATEGORIES = [
  'Deportes',
  'Política',
  'Elecciones',
  'Cultura',
  'Entretenimiento',
  'Cripto',
  'Clima',
  'Economía',
  'Finanzas',
  'Tecnología',
  'Ciencia',
];

const ACCENT_MAP: Record<string, string> = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n',
};

function slugifyCat(name: string) {
  return name
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (ch) => ACCENT_MAP[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface MarketSeed {
  question: string;
  resolutionSource: string;
  category: string;
  closeDate: string;
  imageUrl: string;
}

function img(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
}

const MARKETS: MarketSeed[] = [
  // Deportes
  {
    question: '¿Será el Club América campeón del Torneo Apertura 2026 de la Liga MX?',
    resolutionSource: 'Resultado oficial de la Liga MX',
    category: 'Deportes',
    closeDate: '2026-12-20',
    imageUrl: img('1522778119026-d647f0596c20'),
  },
  {
    question: '¿Anotará Santiago Giménez 20 goles o más en todas las competencias durante la temporada 2026-27?',
    resolutionSource: 'Estadísticas oficiales del club',
    category: 'Deportes',
    closeDate: '2027-05-31',
    imageUrl: img('1579952363873-27f3bade9f55'),
  },
  {
    question: '¿Ganará Canelo Álvarez su próxima pelea de box por título mundial?',
    resolutionSource: 'Resultado oficial del Consejo Mundial de Boxeo',
    category: 'Deportes',
    closeDate: '2026-11-07',
    imageUrl: img('1517438476312-10d79c077509'),
  },
  // Política
  {
    question: '¿Superará la aprobación presidencial de Claudia Sheinbaum el 65% hacia finales de 2026?',
    resolutionSource: 'Encuesta nacional de aprobación (El Financiero/Reforma)',
    category: 'Política',
    closeDate: '2026-12-31',
    imageUrl: img('1541872703-74c5e44368f9'),
  },
  {
    question: '¿Se aprobará una nueva reforma energética en el Congreso mexicano antes de diciembre de 2026?',
    resolutionSource: 'Diario Oficial de la Federación',
    category: 'Política',
    closeDate: '2026-12-31',
    imageUrl: img('1516280440614-37939bbacd81'),
  },
  {
    question: '¿Anunciará el gobierno de México un nuevo acuerdo comercial con la Unión Europea en 2026?',
    resolutionSource: 'Comunicado oficial de la Secretaría de Economía',
    category: 'Política',
    closeDate: '2026-12-31',
    imageUrl: img('1521791136064-7986c2920216'),
  },
  // Elecciones
  {
    question: '¿Superará el partido Morena el 40% de las preferencias rumbo a las elecciones intermedias de 2027?',
    resolutionSource: 'Encuesta nacional (Mitofsky/El Financiero)',
    category: 'Elecciones',
    closeDate: '2026-12-31',
    imageUrl: img('1540910419892-4a36d2c3266c'),
  },
  {
    question: '¿Ganarán los demócratas el control de la Cámara de Representantes en las elecciones intermedias de EE. UU. de noviembre de 2026?',
    resolutionSource: 'Resultado oficial certificado',
    category: 'Elecciones',
    closeDate: '2026-11-03',
    imageUrl: img('1554224155-6726b3ff858f'),
  },
  // Cultura
  {
    question: '¿Ganará una producción mexicana el Óscar a Mejor Película Internacional en la ceremonia de 2027?',
    resolutionSource: 'Resultado oficial de la Academia de Artes y Ciencias Cinematográficas',
    category: 'Cultura',
    closeDate: '2027-03-10',
    imageUrl: img('1489599849927-2ee91cede3ba'),
  },
  {
    question: '¿Agotará Peso Pluma las entradas de su próxima gira por estadios en México?',
    resolutionSource: 'Anuncio oficial de la promotora/recinto',
    category: 'Cultura',
    closeDate: '2026-12-01',
    imageUrl: img('1493225457124-a3eb161ffa5f'),
  },
  {
    question: '¿Promediará "La Casa de los Famosos México" más de 20 millones de espectadores en su próxima temporada?',
    resolutionSource: 'Datos oficiales de rating (Nielsen IBOPE)',
    category: 'Cultura',
    closeDate: '2026-12-15',
    imageUrl: img('1522869635100-9f4c5e86aa37'),
  },
  // Entretenimiento
  {
    question: '¿Recaudará la próxima película de Marvel más de $1,000 millones de dólares a nivel mundial?',
    resolutionSource: 'Box Office Mojo/cifras oficiales del estudio',
    category: 'Entretenimiento',
    closeDate: '2026-12-31',
    imageUrl: img('1478720568477-152d9b164e26'),
  },
  {
    question: '¿Lanzará Karol G un nuevo álbum de estudio antes de finales de 2026?',
    resolutionSource: 'Anuncio oficial de la artista/disquera',
    category: 'Entretenimiento',
    closeDate: '2026-12-31',
    imageUrl: img('1470229722913-7c0e2dbbafd3'),
  },
  {
    question: '¿Será Bad Bunny el artista más escuchado en Spotify México en 2026?',
    resolutionSource: 'Spotify Wrapped/reporte anual oficial',
    category: 'Entretenimiento',
    closeDate: '2026-12-31',
    imageUrl: img('1470019693664-1d202d2c0907'),
  },
  // Cripto
  {
    question: '¿Cerrará Bitcoin el año 2026 por arriba de $150,000 dólares?',
    resolutionSource: 'Precio de cierre BTC/USD en CoinGecko',
    category: 'Cripto',
    closeDate: '2026-12-31',
    imageUrl: img('1621761191319-c6fb62004040'),
  },
  {
    question: '¿Superará Bitso los 15 millones de usuarios registrados en México durante 2026?',
    resolutionSource: 'Reporte oficial de la empresa',
    category: 'Cripto',
    closeDate: '2026-12-31',
    imageUrl: img('1591994843349-f415893b3a6b'),
  },
  {
    question: '¿Aprobará la CNBV un marco regulatorio específico para stablecoins en México antes de 2027?',
    resolutionSource: 'Publicación oficial en el Diario Oficial de la Federación',
    category: 'Cripto',
    closeDate: '2026-12-31',
    imageUrl: img('1450101499163-c8848c66ca85'),
  },
  // Clima
  {
    question: '¿Tocará tierra en México un huracán categoría 4 o superior antes de que termine la temporada 2026?',
    resolutionSource: 'Reporte oficial del Servicio Meteorológico Nacional/NOAA',
    category: 'Clima',
    closeDate: '2026-11-30',
    imageUrl: img('1527482797697-8795b05a13fe'),
  },
  {
    question: '¿Superará la Ciudad de México los 35°C durante la ola de calor de la primavera de 2027?',
    resolutionSource: 'Registro oficial del Servicio Meteorológico Nacional',
    category: 'Clima',
    closeDate: '2027-05-15',
    imageUrl: img('1504370805625-d32c54b16100'),
  },
  // Economía
  {
    question: '¿Bajará la inflación anual de México por debajo del 4% antes de que termine 2026?',
    resolutionSource: 'Reporte oficial de INEGI (INPC)',
    category: 'Economía',
    closeDate: '2026-12-31',
    imageUrl: img('1590283603385-17ffb3a7f29f'),
  },
  {
    question: '¿Cerrará el peso mexicano el año por debajo de 18 pesos por dólar?',
    resolutionSource: 'Tipo de cambio de cierre publicado por Banxico',
    category: 'Economía',
    closeDate: '2026-12-31',
    imageUrl: img('1518546305927-5a555bb7020d'),
  },
  {
    question: '¿Crecerá el PIB de México más del 2% en 2026?',
    resolutionSource: 'Reporte oficial de INEGI',
    category: 'Economía',
    closeDate: '2027-02-15',
    imageUrl: img('1526304640581-d334cdbbf45e'),
  },
  // Finanzas
  {
    question: '¿Recortará Banxico la tasa de interés en su próxima reunión de política monetaria?',
    resolutionSource: 'Comunicado oficial de Banxico',
    category: 'Finanzas',
    closeDate: '2026-09-26',
    imageUrl: img('1601597111158-2fceff292cdc'),
  },
  {
    question: '¿Debutará Kavak en la bolsa de valores (IPO) antes de que termine 2026?',
    resolutionSource: 'Presentación oficial ante la SEC/bolsa de valores',
    category: 'Finanzas',
    closeDate: '2026-12-31',
    imageUrl: img('1611974789855-9c2a0a7236a3'),
  },
  {
    question: '¿Cerrará la Bolsa Mexicana de Valores (IPC) el año por arriba de los 60,000 puntos?',
    resolutionSource: 'Cierre oficial de la BMV',
    category: 'Finanzas',
    closeDate: '2026-12-31',
    imageUrl: img('1451187580459-43490279c0fa'),
  },
  // Tecnología
  {
    question: '¿Abrirá Tesla una planta de manufactura activa en Nuevo León antes de finales de 2026?',
    resolutionSource: 'Anuncio oficial de la empresa',
    category: 'Tecnología',
    closeDate: '2026-12-31',
    imageUrl: img('1617704548623-340376564e68'),
  },
  {
    question: '¿Lanzará una startup mexicana su propio modelo de inteligencia artificial de gran escala en 2026?',
    resolutionSource: 'Anuncio oficial de la empresa',
    category: 'Tecnología',
    closeDate: '2026-12-31',
    imageUrl: img('1677442136019-21780ecad995'),
  },
  {
    question: '¿Alcanzará Clip el estatus de unicornio (valuación de $1,000 millones de dólares) en su próxima ronda de inversión?',
    resolutionSource: 'Anuncio oficial de la ronda de financiamiento',
    category: 'Tecnología',
    closeDate: '2026-12-31',
    imageUrl: img('1552664730-d307ca884978'),
  },
  // Ciencia
  {
    question: '¿Confirmará la UNAM el descubrimiento de una nueva especie en la selva Lacandona durante 2026?',
    resolutionSource: 'Publicación oficial de la UNAM',
    category: 'Ciencia',
    closeDate: '2026-12-31',
    imageUrl: img('1532094349884-543bc11b234d'),
  },
  {
    question: '¿Lanzará México un satélite construido completamente por ingenieros mexicanos antes de 2027?',
    resolutionSource: 'Anuncio oficial de la Agencia Espacial Mexicana',
    category: 'Ciencia',
    closeDate: '2026-12-31',
    imageUrl: img('1446776653964-20c1d3a81b06'),
  },
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

async function resetExistingData() {
  console.log('Resetting existing markets/users/categories...');
  await prisma.pricePoint.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.position.deleteMany({});
  await prisma.walletLedger.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.market.deleteMany({});
  await prisma.category.deleteMany({});
}

async function main() {
  await resetExistingData();

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

    const slug =
      m.question
        .toLowerCase()
        .replace(/[áéíóúüñ¿?]/g, (ch) => ACCENT_MAP[ch] ?? '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 60) +
      '-' +
      Math.random().toString(36).slice(2, 7);

    const market = await prisma.market.create({
      data: {
        slug,
        question: m.question,
        description: `Este mercado se resuelve con base en: ${m.resolutionSource}. Compra acciones de Sí o No para expresar tu opinión sobre el resultado antes de la fecha de cierre.`,
        resolutionSource: m.resolutionSource,
        categoryId,
        imageUrl: m.imageUrl,
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
    const points: {
      timestamp: Date;
      yesProbability: number;
      volume: number;
    }[] = [];
    for (let i = 0; i < numPoints; i++) {
      const t = startTime + (i / (numPoints - 1)) * (now - startTime);
      prob += randRange(-0.05, 0.05);
      prob = Math.min(0.95, Math.max(0.05, prob));
      points.push({
        timestamp: new Date(t),
        yesProbability: prob,
        volume: randRange(20, 400),
      });
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

    await prisma.market.update({
      where: { id: market.id },
      data: { qYes, qNo },
    });

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
    const existing = await prisma.user.findUnique({
      where: { email: du.email },
    });
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
            ledger: {
              create: {
                amount: STARTING_BALANCE,
                type: 'SEED',
                note: 'Starting virtual balance',
              },
            },
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

      const market = await prisma.market.findUnique({
        where: { id: marketId },
      });
      if (!market) continue;

      const outcome: Outcome = Math.random() > 0.5 ? 'YES' : 'NO';
      const quantity = randInt(5, 40);
      const wallet = await prisma.wallet.findUnique({
        where: { userId: user.id },
      });
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

      await prisma.market.update({
        where: { id: market.id },
        data: { qYes: newQYes, qNo: newQNo },
      });
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: cost } },
      });
      await prisma.walletLedger.create({
        data: {
          walletId: wallet.id,
          amount: -cost,
          type: 'TRADE',
          note: `BUY ${quantity} ${outcome} @ ${market.question}`,
        },
      });
      await prisma.position.create({
        data: {
          userId: user.id,
          marketId: market.id,
          outcome,
          quantity,
          avgEntryPrice: avgPrice,
        },
      });
      await prisma.order.create({
        data: {
          userId: user.id,
          marketId: market.id,
          outcome,
          side: 'BUY',
          quantity,
          cost,
          price: avgPrice,
        },
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

  console.log(
    'Resolving a couple of markets so the leaderboard/biggest-wins have real data...',
  );
  const marketsWithPositions = await prisma.market.findMany({
    where: { id: { in: marketIds }, status: 'OPEN' },
    include: { positions: true },
  });
  const toResolve = marketsWithPositions
    .filter((m) => m.positions.length > 0)
    .slice(0, 2);

  for (const market of toResolve) {
    const yesQty = market.positions
      .filter((p) => p.outcome === 'YES')
      .reduce((s, p) => s + p.quantity, 0);
    const noQty = market.positions
      .filter((p) => p.outcome === 'NO')
      .reduce((s, p) => s + p.quantity, 0);
    const resolvedOutcome: Outcome = yesQty >= noQty ? 'YES' : 'NO';

    await prisma.market.update({
      where: { id: market.id },
      data: { status: 'RESOLVED', resolvedOutcome },
    });

    const winners = market.positions.filter(
      (p) => p.outcome === resolvedOutcome && p.quantity > 0,
    );
    for (const position of winners) {
      const wallet = await prisma.wallet.findUnique({
        where: { userId: position.userId },
      });
      if (!wallet) continue;
      const payout = position.quantity * 1;
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: payout } },
      });
      await prisma.walletLedger.create({
        data: {
          walletId: wallet.id,
          amount: payout,
          type: 'PAYOUT',
          note: `Payout for resolved market: ${market.question}`,
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
