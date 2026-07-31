# Seed Market Questions — Sponsor Demo
### 37 markets across all 14 categories, ready to load into the database

**How to use this:** Bracketed placeholders like `[Team A]` or `[Company]` should be swapped for real, current names close to your actual demo date — sports fixtures, specific companies/players, etc. Anything without brackets (prices, dates, index levels) is generic enough to use as-is. Keeping placeholders here avoids me guessing at real people/teams and getting specifics wrong or stale by the time you build this.

**Format per market:** Question · Suggested close date · Resolution source (for the admin panel's "rules" field) · Category

---

## Crypto (4 — highest-traffic category, prioritize real current data here)
1. **Will Bitcoin close above $150,000 by December 31, 2026?** · Close: Dec 31, 2026 · Source: CoinGecko/CoinMarketCap BTC/USD closing price
2. **Will Ethereum's market cap exceed Bitcoin's by end of 2026?** · Close: Dec 31, 2026 · Source: CoinGecko market cap ranking
3. **Will a spot Solana ETF be approved by the SEC in 2026?** · Close: Dec 31, 2026 · Source: SEC official filings/announcements
4. **Will any single altcoin gain 500%+ in a calendar month this year?** · Close: Dec 31, 2026 · Source: CoinGecko monthly price data

## Sports (3 — use real upcoming fixtures where possible)
5. **Will [Team A] beat [Team B] on [real upcoming match date]?** · Close: match date · Source: official league result
6. **Will [Player] score 30+ points in their next game?** · Close: next game date · Source: official league box score
7. **Will [National Team] qualify for the next major tournament?** · Close: qualification deadline · Source: official federation announcement

## Politics (3)
8. **Will the US federal government reach a new debt ceiling agreement by December 31, 2026?** · Close: Dec 31, 2026 · Source: Congressional record/major news wire
9. **Will [Country]'s parliament pass the proposed [policy] reform by Q4 2026?** · Close: Dec 31, 2026 · Source: official government record
10. **Will national voter turnout exceed 60% in the next major election cycle?** · Close: election date · Source: official electoral commission data

## Finance (3)
11. **Will the Federal Reserve cut interest rates at its next FOMC meeting?** · Close: next FOMC date · Source: official Fed announcement
12. **Will [Company]'s stock beat Q3 2026 earnings estimates?** · Close: earnings report date · Source: official earnings release
13. **Will the S&P 500 close above 7,000 by year-end 2026?** · Close: Dec 31, 2026 · Source: official index close

## Geopolitics (3)
14. **Will a ceasefire be reached in [ongoing conflict] by [date]?** · Close: set per real situation · Source: major wire service (Reuters/AP)
15. **Will [Country A] and [Country B] sign a new trade agreement by Q4 2026?** · Close: Dec 31, 2026 · Source: official government announcement
16. **Will any G7 nation see a change in head of government before year-end 2026?** · Close: Dec 31, 2026 · Source: major wire service

## Tech (3)
17. **Will [Company] release [Product] before end of 2026?** · Close: Dec 31, 2026 · Source: official company announcement
18. **Will any major AI lab announce a significant new model release in Q4 2026?** · Close: Dec 31, 2026 · Source: official lab announcement
19. **Will [Company]'s IPO happen by Q4 2026?** · Close: Dec 31, 2026 · Source: SEC filing/stock exchange listing

## Economy (3)
20. **Will US CPI inflation fall below 3% by end of 2026?** · Close: Dec 31, 2026 · Source: official BLS CPI report
21. **Will US unemployment exceed 5% by Q4 2026?** · Close: Dec 31, 2026 · Source: official BLS jobs report
22. **Will any G20 country enter a technical recession in 2026?** · Close: Dec 31, 2026 · Source: official national statistics agency

## Culture (3)
23. **Will [Movie] gross over $1B worldwide at the box office?** · Close: set per release window · Source: Box Office Mojo/official studio figures
24. **Will [Artist] release a new album by [date]?** · Close: set per rumor/announcement window · Source: official artist/label announcement
25. **Will the [Award Show] winner match the pre-show betting favorite?** · Close: award show date · Source: official ceremony result

## Esports (2)
26. **Will [Team] win the [Tournament] Finals?** · Close: tournament final date · Source: official tournament result
27. **Will [Player] be named MVP of the [League] season?** · Close: season end date · Source: official league announcement

## Weather (2)
28. **Will [City] see measurable snowfall before December 1, 2026?** · Close: Dec 1, 2026 · Source: National Weather Service official record
29. **Will this year's Atlantic hurricane season have more than 15 named storms?** · Close: Nov 30, 2026 · Source: NOAA official season summary

## Elections (2)
30. **Will [Country]'s ruling party retain its majority in the next election?** · Close: election date · Source: official electoral commission
31. **Will voter turnout in [upcoming election] exceed the previous cycle?** · Close: election date · Source: official electoral commission

## Mentions (2)
32. **Will "AI regulation" be mentioned in the next major central bank policy statement?** · Close: next statement date · Source: official transcript
33. **Will "recession" trend on X during the next major economic data release?** · Close: release date · Source: X Trends (or platform equivalent) at time of release

## Art (2)
34. **Will any artwork sell for over $50M at a major auction house in 2026?** · Close: Dec 31, 2026 · Source: Christie's/Sotheby's official sale results
35. **Will [Artist]'s next exhibition sell out on opening day?** · Close: exhibition opening date · Source: gallery/venue announcement

## World (2)
36. **Will global population surpass 8.2 billion by end of 2026?** · Close: Dec 31, 2026 · Source: UN World Population Prospects data
37. **Will any new country gain UN membership in 2026?** · Close: Dec 31, 2026 · Source: official UN announcement

---

## Notes for Loading This Data

- **Before the demo:** replace every bracketed placeholder with a real, current name/date — 15-20 minutes of research the week of the demo keeps this feeling live rather than templated.
- **Simulated trade history:** for each of these 37 markets, run a seed script generating 20-30 fake buy/sell orders spread across a fake time window (e.g. the last 7-30 days) so the price chart isn't flat and volume isn't $0 — this was already specified in §7.2 of the Demo MVP Scope doc.
- **Resolution field:** the "Source" column above should go directly into the market's `rules`/`resolution_source` field in the admin panel — this is exactly what a sponsor (or a skeptical early user) will check first to judge whether your platform is credible.
- **Priority for polish:** if you're short on time, put the most seed/simulation effort into **Crypto and Sports** — they're the highest-traffic categories on every real prediction market platform and the ones a sponsor is most likely to click into first.
