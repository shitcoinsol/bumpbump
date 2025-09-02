BUMP — Minimal Landing + Document-style Buyback & Burn
=========================================================

Files
-----
- index.html      → one-page site (landing + Buyback & Burn document section)
- styles.css      → minimal dark green + paper document styles
- script.js       → CA copy, summary computation, and burn table rendering
- assets/
    - logo-placeholder.svg (replace with your real logo file, keep same name or update the <img src> in index.html)
    - favicon.svg

How to use
----------
1) Replace the contract address and settings in script.js:
   const CONFIG = {
     CA: "0x...",
     TWITTER_URL: "https://twitter.com/youraccount",
     TOTAL_SUPPLY: 1000000000,
     TIMEZONE: "Asia/Seoul"
   };

2) Add real burn events in the BURNS array (newest first is fine; the script sorts anyway):
   const BURNS = [
     { time_iso: "2025-09-03T21:14:00+09:00", burned_bump: 125000.0, remaining_supply: 999875000.0, tx_url: "https://<scan>/tx/0x..." }
   ];

3) Replace assets/logo-placeholder.svg with your real logo image (or update <img src> in index.html).

4) Deploy the folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.).
   - It's fully static; no build step required.
   - Times render in KST using Intl.DateTimeFormat with Asia/Seoul.

Notes
-----
- The ledger aims to feel like a simple document: off-white paper, black ink, fine borders.
- Accessibility: focus rings, aria labels, high-contrast document section.
- Mobile: summary stacks vertically; table scrolls horizontally if needed.
