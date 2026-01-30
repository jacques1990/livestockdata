// Start with “giants” (add all 50 later)
const symbols = [
  "RELIANCE:NSE",
  "HDFCBANK:NSE",
  "ICICIBANK:NSE",
  "TCS:NSE",
  "INFY:NSE",
  "SBIN:NSE",
  "BHARTIARTL:NSE",
  "LT:NSE",
  "HINDUNILVR:NSE",
  "BAJFINANCE:NSE"
];

// Twelve Data batch quote endpoint (many symbols in one request)
async function fetchBatchQuotes(apiKey, symbolList) {
  const joined = symbolList.join(",");
  const url =
    `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(joined)}` +
    `&apikey=${encodeURIComponent(7eca87452f4849d99f5c30f227dbcdcc)}`;

  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${text}`);

  const data = JSON.parse(text);
  // If key is invalid, Twelve Data often returns: { status:"error", message:"..." }
  if (data && data.status === "error") throw new Error(`API: ${data.message || text}`);
  return data;
}

function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function fmt(n) {
  return n === null ? "—" : n.toFixed(2);
}

function rowHtml(sym, q) {
  const price = num(q.close ?? q.price ?? q.last);
  const change = num(q.change);
  const changePct = num(q.percent_change);
  const cls = change > 0 ? "up" : change < 0 ? "down" : "";
  const time = q.datetime || "—";

  return `
    <tr>
      <td>${sym.split(":")[0]}</td>
      <td>${fmt(price)}</td>
      <td class="${cls}">${fmt(change)}</td>
      <td class="${cls}">${changePct === null ? "—" : changePct.toFixed(2) + "%"}</td>
      <td>${time}</td>
    </tr>`;
}

async function load() {
  const status = document.getElementById("status");
  const tbody = document.getElementById("rows");
  const apiKey = document.getElementById("apikey").value.trim();

  if (!apiKey) {
    status.textContent = "Paste your Twelve Data API key, then click Load Quotes.";
    return;
  }

  status.textContent = "Fetching quotes…";
  try {
    const data = await fetchBatchQuotes(apiKey, symbols);

    // data is keyed by symbol in batch mode: data["RELIANCE:NSE"] = {...}
    const rows = symbols.map(sym => rowHtml(sym, data[sym] || {})).join("");
    tbody.innerHTML = rows;

    status.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    status.textContent = `Error: ${e.message}`;
  }
}

document.getElementById("loadBtn").addEventListener("click", load);

// Auto-refresh every 60s after first load
setInterval(() => {
  // only refresh if key exists
  if (document.getElementById("apikey").value.trim()) load();
}, 60000);

// initial message
load();
