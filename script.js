// Paste your Finnhub key here
const FINNHUB_KEY = "PASTE_YOUR_KEY_HERE";

// US tickers (these should work on free plan)
const tickers = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "TSLA", "META", "SPY"];

async function fetchQuote(ticker) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${d5u3bahr01qtjet1s670d5u3bahr01qtjet1s67g}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  // c=current, d=change, dp=change%, t=timestamp
  return { ticker, price: j.c, change: j.d, changePct: j.dp, t: j.t };
}

function fmt(n) {
  return (typeof n === "number" && isFinite(n)) ? n.toFixed(2) : "—";
}

function rowHtml(q) {
  const cls = q.change > 0 ? "up" : q.change < 0 ? "down" : "";
  const time = q.t ? new Date(q.t * 1000).toLocaleTimeString() : "—";
  return `
    <tr>
      <td>${q.ticker}</td>
      <td>${fmt(q.price)}</td>
      <td class="${cls}">${fmt(q.change)}</td>
      <td class="${cls}">${fmt(q.changePct)}%</td>
      <td>${time}</td>
    </tr>`;
}

async function load() {
  const status = document.getElementById("status");
  const tbody = document.getElementById("rows");

  if (!FINNHUB_KEY || FINNHUB_KEY.includes("PASTE")) {
    status.textContent = "Paste your Finnhub API key in script.js (FINNHUB_KEY).";
    return;
  }

  status.textContent = "Fetching quotes…";
  try {
    const results = await Promise.all(tickers.map(fetchQuote));
    // sort by change% desc
    results.sort((a,b) => (b.changePct||0) - (a.changePct||0));
    tbody.innerHTML = results.map(rowHtml).join("");
    status.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    status.textContent = `Error: ${e.message}`;
  }
}

load();
// refresh every 30s (adjust if you hit rate limits)
setInterval(load, 30000);
