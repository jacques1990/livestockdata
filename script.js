const FINNHUB_KEY = "d5u3bahr01qtjet1s670d5u3bahr01qtjet1s67g";

// US mega-cap + ETFs (safe for free plan)
const TICKERS = [
  "AAPL","MSFT","NVDA","AMZN","GOOGL","META",
  "TSLA","BRK.B","JPM","V","MA",
  "SPY","QQQ","DIA"
];

async function fetchQuote(ticker) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`;
  const res = await fetch(url);
  const txt = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${txt}`);
  const j = JSON.parse(txt);
  return { ticker, ...j };
}

function fmt(n){ return (typeof n === "number") ? n.toFixed(2) : "—"; }

function row(q){
  const cls = q.d > 0 ? "up" : q.d < 0 ? "down" : "";
  const t = q.t ? new Date(q.t*1000).toLocaleTimeString() : "—";
  return `
    <tr>
      <td>${q.ticker}</td>
      <td>${fmt(q.c)}</td>
      <td class="${cls}">${fmt(q.d)}</td>
      <td class="${cls}">${fmt(q.dp)}%</td>
      <td>${t}</td>
    </tr>`;
}

async function load(){
  const status = document.getElementById("status");
  const body = document.getElementById("rows");

  try {
    status.textContent = "Fetching data…";
    const data = await Promise.all(TICKERS.map(fetchQuote));
    data.sort((a,b)=>(b.dp||0)-(a.dp||0)); // top movers first
    body.innerHTML = data.map(row).join("");
    status.textContent = "Updated: " + new Date().toLocaleTimeString();
  } catch(e){
    status.textContent = "Error: " + e.message;
  }
}

load();
setInterval(load, 30000); // refresh every 30s
