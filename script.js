// Put your API key here (Finnhub)
const FINNHUB_KEY = "d5u35jpr01qtjet1rkegd5u35jpr01qtjet1rkf0";

// Minimal “giants” list (add more or all 50)
const symbols = [
  "RELIANCE.NS","HDFCBANK.NS","ICICIBANK.NS","TCS.NS","INFY.NS",
  "SBIN.NS","BHARTIARTL.NS","HINDUNILVR.NS","LT.NS","BAJFINANCE.NS"
];

// Finnhub quote endpoint
async function fetchQuote(sym) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${FINNHUB_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  // Finnhub fields: c=current, d=change, dp=change%, t=timestamp
  return { sym, price: j.c, change: j.d, changePct: j.dp, t: j.t };
}

function fmt(n) {
  return (typeof n === "number" && isFinite(n)) ? n.toFixed(2) : "—";
}

function rowHtml(q) {
  const cls = q.change > 0 ? "up" : q.change < 0 ? "down" : "";
  const time = q.t ? new Date(q.t * 1000).toLocaleTimeString() : "—";
  return `
    <tr>
      <td>${q.sym}</td>
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
    status.textContent = "Add your Finnhub API key in script.js";
    return;
  }

  status.textContent = "Fetching quotes…";
  try {
    const results = await Promise.all(symbols.map(fetchQuote));
    // sort by change% descending (you can change this)
    results.sort((a,b) => (b.changePct||0) - (a.changePct||0));
    tbody.innerHTML = results.map(rowHtml).join("");
    status.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    status.textContent = `Error: ${e.message}`;
  }
}

// load now and refresh every 60s
load();
setInterval(load, 60000);
