const TD_KEY = "7eca87452f4849d99f5c30f227dbcdcc";

// Start with “giants”. Replace with all 50 later if you want.
const symbols = [
  "RELIANCE:NSE","HDFCBANK:NSE","ICICIBANK:NSE","TCS:NSE","INFY:NSE",
  "SBIN:NSE","BHARTIARTL:NSE","LT:NSE","HINDUNILVR:NSE","BAJFINANCE:NSE"
];

async function fetchBatchQuotes(symbolList) {
  const joined = symbolList.join(",");
  const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(joined)}&apikey=${encodeURIComponent(TD_KEY)}`;

  const r = await fetch(url);
  const text = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${text}`);

  const data = JSON.parse(text);
  if (data && data.status === "error") throw new Error(`API: ${data.message || text}`);
  return data;
}

function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function fmt(n) { return n === null ? "—" : n.toFixed(2); }

function rowHtml(sym, q) {
  const price = num(q.close ?? q.price ?? q.last);
  const change = num(q.change);
  const pct = num(q.percent_change);
  const cls = change > 0 ? "up" : change < 0 ? "down" : "";
  const time = q.datetime || "—";

  return `
    <tr>
      <td>${sym.split(":")[0]}</td>
      <td>${fmt(price)}</td>
      <td class="${cls}">${fmt(change)}</td>
      <td class="${cls}">${pct === null ? "—" : pct.toFixed(2) + "%"}</td>
      <td>${time}</td>
    </tr>`;
}

async function load() {
  const status = document.getElementById("status");
  const tbody = document.getElementById("rows");

  status.textContent = "Fetching quotes…";
  try {
    const data = await fetchBatchQuotes(symbols);
    tbody.innerHTML = symbols.map(sym => rowHtml(sym, data[sym] || {})).join("");
    status.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
  } catch (e) {
    status.textContent = `Error: ${e.message}`;
  }
}

load();
setInterval(load, 60000);
