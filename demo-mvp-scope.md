# Demo MVP Scope — Sponsor Pitch Build
### Prediction Market Platform (React + NestJS + PostgreSQL)

**Goal:** A polished, believable, demo-ready product to show a sponsor — NOT the full platform from the main technical documentation. Real money, KYC, trend automation, and full admin tooling are explicitly OUT of scope here and are positioned as "roadmap" during the pitch.

---

## 1. Demo Scope Boundaries (what's IN vs OUT)

| Feature | In Demo MVP? | Notes |
|---|---|---|
| Browse markets, categories, sort/filter | ✅ In | Core visual centerpiece |
| Market detail page with live-feeling price chart | ✅ In | Most important screen for the "wow" |
| Buy/Sell YES/NO shares | ✅ In | Using virtual balance |
| User registration/login | ✅ In | Simple email/password, no OAuth needed |
| Wallet (virtual balance only) | ✅ In | Starting balance auto-granted, no real payment |
| Portfolio / positions page | ✅ In | Shows the sponsor the "user comes back" loop |
| Leaderboard | ✅ In | Cheap to build, high perceived value in a demo |
| Admin: create/edit/resolve market | ✅ In (minimal) | Just enough to run the demo live |
| Real payment gateway (Stripe etc.) | ❌ Out | Say: "integration-ready, next phase" |
| KYC / identity verification | ❌ Out | Roadmap item |
| Trend detection / LLM auto-suggestions | ❌ Out | Roadmap item — show the diagram from the full spec doc instead |
| Order book / CLOB matching | ❌ Out | Use AMM (LMSR) — far less to build, same visual result |
| Admin analytics/reports/audit log | ❌ Out | Roadmap item |
| Comments/social features | ❌ Out (optional stretch) | Only add if time allows after core flow is solid |

---

## 2. Color Scheme

Derived from the reference site screenshot (bold black + textured red "Vision" theme). These are close visual-match estimates since I can't inspect live CSS — good enough to build with, easy to nudge once you're in the browser comparing side by side.

```css
:root {
  --color-bg-primary:       #A32620;  /* main page background — deep textured red */
  --color-bg-secondary:     #121212;  /* header/nav, cards, input fields — near-black */
  --color-bg-elevated:      #1C1C1C;  /* modals/dropdowns — slightly lighter black */
  --color-accent-primary:   #E8362F;  /* brand red — logo, CTA buttons */
  --color-accent-secondary: #B91F1F;  /* darker red for hover/pressed states */
  --color-yes:               #F2B134;  /* amber/gold — chosen to contrast against the red brand rather than compete with it */
  --color-no:                 #E8362F;  /* reuses brand red — NO naturally reads as "the red option" */
  --color-text-primary:     #FFFFFF;
  --color-text-secondary:   #C9C9C9;
  --color-border:            #3A3A3A;  /* subtle border on inputs, e.g. the email field outline */
  --color-success:           #3ECF5E;
  --color-warning:           #F2B134;
  --color-error:              #FF4D4D;
}
```

### Design notes for whoever builds this
- **Background texture:** the reference site uses a grainy/noise texture over the red, not a flat color. In CSS this is typically a subtle `background-image` (noise PNG/SVG at low opacity) layered over `--color-bg-primary`, or a radial-gradient vignette (lighter red glow at center, darker toward edges). Worth replicating for the "premium" feel rather than a flat red fill.
- **Logo mark:** rounded-square icon container in `--color-accent-primary` with a white icon inside (their eye icon → your platform's icon/mark, same treatment).
- **Buttons:** solid `--color-accent-primary` fill, white bold text, full-width on mobile-style CTAs (matches their "Join the Waitlist" button treatment) — same pattern works well for your BUY/trade CTAs.
- **Inputs:** near-black fill (`--color-bg-secondary`) with a subtle `--color-border` outline, light gray placeholder text (`--color-text-secondary`).
- **YES/NO color choice:** using amber for YES and the brand red for NO keeps your brand color consistent with the reference site (red stays dominant) while still giving users a clear, colorblind-friendlier distinction (amber vs. red is more distinguishable than green vs. red for red-green colorblindness — genuinely a better choice than a green/red pairing for a trading UI where misreading a color could mean misreading a position).

Define these once in a single theme file (`tailwind.config.js` `theme.extend.colors`, or a `:root` block in `index.css`) and reference only these variable names throughout every component — never hardcode a hex value directly in a component file. That's what lets you re-theme the whole app later by editing one file.

---

## 3. Pages Required (Demo Scope Only)

| # | Route | Priority | Description |
|---|---|---|---|
| 1 | `/` | P0 | Home — featured markets carousel, category tabs, market grid (newest/trending sort) |
| 2 | `/markets` | P0 | Full market list with filter bar |
| 3 | `/market/:slug` | P0 | Market detail — chart, order panel, buy/sell |
| 4 | `/login`, `/register` | P0 | Auth |
| 5 | `/portfolio` | P0 | User's positions + P&L |
| 6 | `/wallet` | P1 | Virtual balance + transaction history (no real payment UI) |
| 7 | `/leaderboard` | P1 | Top traders by virtual profit |
| 8 | `/profile/:username` | P2 | Optional — public stats page |
| 9 | `/admin/login` | P0 | Separate simple admin login |
| 10 | `/admin/markets` | P0 | Create/edit/resolve markets |

**P0 = must have for the demo to function. P1 = strongly recommended. P2 = only if time allows.**

---

## 4. Component Specification (detailed — for direct handoff to a builder)

### 4.1 `MarketCard`
- **Displays:** market thumbnail image, question text (truncate at 2 lines), category badge, current YES price as a %, mini sparkline (last 7 data points), 24h volume (can be simulated for demo), "closes in X days" label
- **Interaction:** entire card clickable → navigates to `/market/:slug`
- **States:** default, hover (subtle elevate/border-glow using `--color-accent-primary`), closed/resolved (dimmed, badge showing final outcome)

### 4.2 `MarketDetailHeader`
- Question (large, prominent)
- Category badge + close date
- Current YES probability as a large % number, color-coded (`--color-yes` if >50%, `--color-no` if <50%)
- Short rules/description text (expandable "read more")

### 4.3 `PriceChart`
- Line chart, x-axis = time, y-axis = YES probability (0-100%)
- Use Recharts `<LineChart>` with a single line, gradient fill under the line using `--color-accent-primary`
- Time range toggle: 1D / 1W / 1M / ALL (for demo, can be seeded/simulated data — doesn't need to be real historical ticks)

### 4.4 `TradePanel`
- Two tabs: **BUY** / **SELL**
- Two outcome buttons: **YES** (styled with `--color-yes`) / **NO** (styled with `--color-no`)
- Quantity input (number stepper)
- Live-calculated cost + potential payout preview (updates on quantity change, using the AMM formula — see §5.2)
- Submit button — on success, show a toast/confirmation and update the chart + user's position immediately (optimistic UI)
- Balance check: disable submit + show inline error if quantity exceeds available virtual balance

### 4.5 `PositionsTable`
- Columns: Market question (truncated, clickable), Outcome held (YES/NO badge), Quantity, Avg. entry price, Current value, Unrealized P&L (green/red text)
- Empty state: friendly message + CTA button to `/markets`

### 4.6 `WalletCard`
- Large balance display
- Recent transactions list (last 5, with "view all" link)
- No real deposit/withdraw button — for demo, can show a disabled/greyed "Coming Soon" state on those buttons so the sponsor sees the intended flow without it being functional

### 4.7 `FilterBar`
- Sort dropdown: Newest, Trending, Volume, Ending Soon (matches `?sf=` pattern from the reference site)
- Category pills (horizontal scroll on mobile) — full 14-category set from §7.1

### 4.8 `Navbar`
- Logo, category links, search bar, notification bell (can be static/non-functional for demo), wallet balance chip, avatar/profile dropdown

### 4.9 `Leaderboard`
- Table: Rank, Username/avatar, Total virtual profit, Win rate %
- Top 3 rows visually highlighted (gold/silver/bronze accent)

---

## 5. Backend Scope (Demo — Simplified from Full Spec)

### 5.1 Modules Needed
```
auth/        → register, login, JWT (skip refresh-token rotation complexity for demo, simple JWT expiry is fine)
users/       → basic profile
wallet/      → virtual balance only, seeded on registration (e.g. $1,000)
markets/     → CRUD (admin creates), list/detail/history endpoints
orders/      → buy/sell against AMM, position tracking
admin/       → market create/edit/resolve, guarded by role
```
**Explicitly skip for demo:** payments module, KYC module, notifications module, websocket realtime (polling every few seconds is fine and much faster to build than websockets for a demo).

### 5.2 AMM Pricing (LMSR) — Simplified Formula for Implementation

The Logarithmic Market Scoring Rule cost function:

```
C(q_yes, q_no) = b * ln(e^(q_yes/b) + e^(q_no/b))
```

Where:
- `q_yes`, `q_no` = total shares outstanding for each outcome
- `b` = liquidity parameter (higher = more liquidity, slower price movement — for a demo, a smaller `b` like `50-100` makes prices move visibly with small trades, which looks better on screen)

**Price of YES** = `e^(q_yes/b) / (e^(q_yes/b) + e^(q_no/b))`

**Cost to buy `Δq` shares of YES** = `C(q_yes + Δq, q_no) − C(q_yes, q_no)`

This is a well-documented, standard formula — any backend dev (or Claude Code) can implement this directly from the formula above in a single pure function, no external library needed.

### 5.3 API Endpoints (Demo Scope)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/auth/register` | |
| POST | `/auth/login` | |
| GET | `/markets?sf=newest\|trending\|volume\|ending` | |
| GET | `/markets/:slug` | |
| GET | `/markets/:id/history` | Can return seeded/simulated points for demo |
| POST | `/orders` | `{ marketId, outcome, side, quantity }` — computes AMM price server-side, updates wallet + position atomically |
| GET | `/positions` | |
| GET | `/wallet/balance` | |
| GET | `/wallet/transactions` | |
| GET | `/leaderboard` | |
| POST | `/admin/markets` | |
| PATCH | `/admin/markets/:id/resolve` | Triggers payout to all winning positions |

---

## 6. Database Schema (Demo Scope — trimmed from full spec)

Use the same core tables from the full documentation, but you can **skip these tables entirely** for the demo: `withdrawals`, `trend_signals`, `market_suggestions`, `trades` (if using pure AMM, you don't need a separate trades/matching table — orders resolve directly against the AMM).

Minimum viable tables: `users`, `wallets`, `wallet_ledger`, `markets`, `categories`, `orders`, `positions`.

---

## 7. Categories & Seed Data Plan

### 7.1 Full Category List (matched to Polymarket's current live categories)

| Category | Example Market Style |
|---|---|
| **Politics** | "Will [policy] pass by [date]?" |
| **Sports** | "Will [Team A] beat [Team B] on [date]?" |
| **Crypto** | "Will BTC hit $X by [date]?" |
| **Esports** | "[Team] vs [Team] (BO3) — [tournament]" |
| **Finance** | "Will [Company] beat quarterly earnings?" |
| **Geopolitics** | "Will [event] happen in [region] by [date]?" |
| **Tech** | "Will [company] ship [product] by [date]?" |
| **Culture** (Pop Culture) | "Will [celebrity] announce [thing] by [date]?" |
| **Economy** | "Will inflation exceed X% this quarter?" |
| **Weather** | "Will [city] hit X°F on [date]?" |
| **Mentions** | "Will [person] say [word] in [context] by [date]?" |
| **Elections** | "Will [candidate] win [race]?" |
| **Art** | "Will [artwork/auction] sell above $X?" |
| **World** | General international/world-events catch-all |

`Trending`, `Newest`, `Breaking`, `Ending Soon` are **sort filters applied across categories**, not categories themselves — matches the `FilterBar` component from §4.7 and the `sf=` query pattern already in the doc. Don't build these as separate category tabs; build them as sort options on the existing category views.

### 7.2 Seed Data Plan (revised for full category breadth)

For a sponsor demo, breadth signals legitimacy — an admin should be able to click through every category tab and see live-feeling content, not empty states.

- **2-4 markets per category** across all 14 categories above → roughly **35-45 total seeded markets**. This is still very manageable to hand-write/seed and looks far more like a real platform than 15-20 markets in 3 categories.
- Each market needs **simulated trade history** (script generating 20-30 fake orders over a fake time range) so charts and volume numbers aren't flat/zero.
- **3-5 demo user accounts** with existing positions across multiple categories, so the leaderboard and "recently active" feel populated.
- Prioritize putting your **real, current** markets (genuinely upcoming crypto price check, real sports fixture) into the highest-traffic categories sponsors will click first — Sports, Crypto, Politics — everything else can lean on well-written hypothetical-but-plausible questions.
- Skip building out `Mentions` and `Art` with real logic if time is tight — 2 seeded markets each is enough for the sponsor to see the category exists without needing special resolution logic behind them for a demo.

### 7.3 Time Impact on Build Plan
More categories doesn't meaningfully change backend build time (categories are just rows in a `categories` table + a `category_id` foreign key already in the schema) — the real time cost is **writing 35-45 good market questions** rather than 15-20, and building out the category tab navigation in the `FilterBar`/`Navbar` components. Budget an extra 1-2 days in Week 4 (polish week) for the additional seed content.

---

## 8. Build Timeline (Suggested)

| Week | Focus |
|---|---|
| 1 | Backend foundation: auth, wallet, market CRUD, AMM order logic |
| 2 | Frontend: navbar, home, market list, market detail (static/no trading yet) |
| 3 | Wire up trading (buy/sell), portfolio page, admin market create/resolve |
| 4 | Polish: color theme applied, leaderboard, seed data, chart polish, bug pass, rehearse the demo flow |

Realistic for **1-2 developers**, tighter if using Claude Code to accelerate boilerplate (auth, CRUD scaffolding, component structure).

---

## 9. Sponsor Pitch Framing (what to say about what's NOT built)

When the sponsor asks "how does this make money" or "how do real users deposit funds":
> *"This demo runs on a virtual balance so you can see the full trading experience end-to-end. The production build adds Stripe for real deposits, KYC verification for withdrawals, and an automated trend-detection pipeline that turns real-time news/sports/crypto signals into new markets with minimal manual work — we have the full technical architecture already mapped out."*

Then show them the **main technical documentation** (already built) as proof the rest is planned, not hand-waved.

---

## 10. Next Steps Checklist

- [x] Colors — see §2
- [x] Categories — full 14-category set matched to Polymarket, see §7.1
- [x] Seed market questions drafted — see `seed-market-questions.md` (37 markets across all categories)
- [ ] Confirm 1 vs 2 developers / timeline expectations against the 4-week estimate above (add 1-2 days for the larger seed content set)
