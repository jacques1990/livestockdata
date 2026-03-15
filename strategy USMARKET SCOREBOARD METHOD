//@version=6
strategy("US Ultra Flow Score Strategy v1", overlay=true, initial_capital=30000, pyramiding=0, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

//--------------------------------------------------
// SETTINGS
//--------------------------------------------------
threshold       = input.float(0.25, "Mag7 Move % Threshold", step=0.05)
scoreEntryLevel = input.float(33.0, "Score Entry Level", step=1)
slopeFilter     = input.float(0.11, "EMA Slope Filter", step=0.01)

stopLossPct     = input.float(1.8, "Stop Loss %", step=0.1)
takeProfitPct   = input.float(0.8, "Take Profit %", step=0.1)

emaFastLen      = input.int(9, "EmaFast")
emaSlowLen      = input.int(20, "EmaSlow")

useBreadthFilter = input.bool(true, "Use Breadth Filter")
useVixFilter     = input.bool(true, "Use VIX Filter")
useSlopeFilter   = input.bool(true, "Use EMA Slope Filter")
avoidFlatMarket  = input.bool(true, "Avoid Flat Market")
showDashboard    = input.bool(true, "Show Dashboard")

vixMaxBull = input.float(22.0, "Max VIX For Longs", step=0.5)
vixMinBear = input.float(16.0, "Min VIX For Shorts", step=0.5)

//--------------------------------------------------
// MAG7 WEIGHTS
//--------------------------------------------------
w_aapl  = 7.0
w_msft  = 7.0
w_nvda  = 6.5
w_amzn  = 5.0
w_googl = 4.5
w_meta  = 4.5
w_tsla  = 3.5

//--------------------------------------------------
// MAG7 DATA
//--------------------------------------------------
[aapl, aapl_p]   = request.security("NASDAQ:AAPL",  timeframe.period, [close, close[1]])
[msft, msft_p]   = request.security("NASDAQ:MSFT",  timeframe.period, [close, close[1]])
[nvda, nvda_p]   = request.security("NASDAQ:NVDA",  timeframe.period, [close, close[1]])
[amzn, amzn_p]   = request.security("NASDAQ:AMZN",  timeframe.period, [close, close[1]])
[googl, googl_p] = request.security("NASDAQ:GOOGL", timeframe.period, [close, close[1]])
[meta, meta_p]   = request.security("NASDAQ:META",  timeframe.period, [close, close[1]])
[tsla, tsla_p]   = request.security("NASDAQ:TSLA",  timeframe.period, [close, close[1]])

//--------------------------------------------------
// % CHANGE
//--------------------------------------------------
pc_aapl  = aapl_p  != 0 ? (aapl  - aapl_p)  / aapl_p  * 100 : 0
pc_msft  = msft_p  != 0 ? (msft  - msft_p)  / msft_p  * 100 : 0
pc_nvda  = nvda_p  != 0 ? (nvda  - nvda_p)  / nvda_p  * 100 : 0
pc_amzn  = amzn_p  != 0 ? (amzn  - amzn_p)  / amzn_p  * 100 : 0
pc_googl = googl_p != 0 ? (googl - googl_p) / googl_p * 100 : 0
pc_meta  = meta_p  != 0 ? (meta  - meta_p)  / meta_p  * 100 : 0
pc_tsla  = tsla_p  != 0 ? (tsla  - tsla_p)  / tsla_p  * 100 : 0

//--------------------------------------------------
// BULL PRESSURE
//--------------------------------------------------
bp1 = pc_aapl  >  threshold ? w_aapl  : 0
bp2 = pc_msft  >  threshold ? w_msft  : 0
bp3 = pc_nvda  >  threshold ? w_nvda  : 0
bp4 = pc_amzn  >  threshold ? w_amzn  : 0
bp5 = pc_googl >  threshold ? w_googl : 0
bp6 = pc_meta  >  threshold ? w_meta  : 0
bp7 = pc_tsla  >  threshold ? w_tsla  : 0

bullPressure = bp1 + bp2 + bp3 + bp4 + bp5 + bp6 + bp7

//--------------------------------------------------
// BEAR PRESSURE
//--------------------------------------------------
sp1 = pc_aapl  < -threshold ? w_aapl  : 0
sp2 = pc_msft  < -threshold ? w_msft  : 0
sp3 = pc_nvda  < -threshold ? w_nvda  : 0
sp4 = pc_amzn  < -threshold ? w_amzn  : 0
sp5 = pc_googl < -threshold ? w_googl : 0
sp6 = pc_meta  < -threshold ? w_meta  : 0
sp7 = pc_tsla  < -threshold ? w_tsla  : 0

bearPressure = sp1 + sp2 + sp3 + sp4 + sp5 + sp6 + sp7

//--------------------------------------------------
// COUNT
//--------------------------------------------------
bullCount =
 (pc_aapl  >  threshold ? 1 : 0) +
 (pc_msft  >  threshold ? 1 : 0) +
 (pc_nvda  >  threshold ? 1 : 0) +
 (pc_amzn  >  threshold ? 1 : 0) +
 (pc_googl >  threshold ? 1 : 0) +
 (pc_meta  >  threshold ? 1 : 0) +
 (pc_tsla  >  threshold ? 1 : 0)

bearCount =
 (pc_aapl  < -threshold ? 1 : 0) +
 (pc_msft  < -threshold ? 1 : 0) +
 (pc_nvda  < -threshold ? 1 : 0) +
 (pc_amzn  < -threshold ? 1 : 0) +
 (pc_googl < -threshold ? 1 : 0) +
 (pc_meta  < -threshold ? 1 : 0) +
 (pc_tsla  < -threshold ? 1 : 0)

//--------------------------------------------------
// MARKET ETF FILTERS
//--------------------------------------------------
spy  = request.security("AMEX:SPY", timeframe.period, close)
qqq  = request.security("NASDAQ:QQQ", timeframe.period, close)
iwm  = request.security("AMEX:IWM", timeframe.period, close)
soxx = request.security("NASDAQ:SOXX", timeframe.period, close)
vix  = request.security("CBOE:VIX", timeframe.period, close)

spyFast  = ta.ema(spy, emaFastLen)
spySlow  = ta.ema(spy, emaSlowLen)
qqqFast  = ta.ema(qqq, emaFastLen)
qqqSlow  = ta.ema(qqq, emaSlowLen)
iwmFast  = ta.ema(iwm, emaFastLen)
iwmSlow  = ta.ema(iwm, emaSlowLen)
soxxFast = ta.ema(soxx, emaFastLen)
soxxSlow = ta.ema(soxx, emaSlowLen)

spyBull  = spy  > spyFast  and spyFast  > spySlow
qqqBull  = qqq  > qqqFast  and qqqFast  > qqqSlow
iwmBull  = iwm  > iwmFast  and iwmFast  > iwmSlow
soxxBull = soxx > soxxFast and soxxFast > soxxSlow

spyBear  = spy  < spyFast  and spyFast  < spySlow
qqqBear  = qqq  < qqqFast  and qqqFast  < qqqSlow
iwmBear  = iwm  < iwmFast  and iwmFast  < iwmSlow
soxxBear = soxx < soxxFast and soxxFast < soxxSlow

//--------------------------------------------------
// BREADTH SCORE
//--------------------------------------------------
breadthBull =
 (spyBull  ? 1 : 0) +
 (qqqBull  ? 1 : 0) +
 (iwmBull  ? 1 : 0) +
 (soxxBull ? 1 : 0)

breadthBear =
 (spyBear  ? 1 : 0) +
 (qqqBear  ? 1 : 0) +
 (iwmBear  ? 1 : 0) +
 (soxxBear ? 1 : 0)

//--------------------------------------------------
// EMA LOGIC ON CURRENT CHART
//--------------------------------------------------
ema9  = ta.ema(close, emaFastLen)
ema20 = ta.ema(close, emaSlowLen)

ema9Slope  = ema9  - ema9[3]
ema20Slope = ema20 - ema20[3]

bullSlope = ema9Slope > slopeFilter and ema20Slope > slopeFilter
bearSlope = ema9Slope < -slopeFilter and ema20Slope < -slopeFilter

emaStrength =
 bullSlope ? math.min(math.abs(ema9Slope) * 100, 25) :
 bearSlope ? math.min(math.abs(ema9Slope) * 100, 25) :
 0

flatMarket = math.abs(ema9Slope) < 0.02 and math.abs(ema20Slope) < 0.02

//--------------------------------------------------
// SCORE SYSTEM
//--------------------------------------------------
pressureScoreBull = math.min(bullPressure * 2, 25)
pressureScoreBear = math.min(bearPressure * 2, 25)

countScoreBull = bullCount * 3
countScoreBear = bearCount * 3

breadthScoreBull = breadthBull * 4
breadthScoreBear = breadthBear * 4

emaScoreBull = bullSlope ? emaStrength : 0
emaScoreBear = bearSlope ? emaStrength : 0

bullScore = pressureScoreBull + countScoreBull + breadthScoreBull + emaScoreBull
bearScore = pressureScoreBear + countScoreBear + breadthScoreBear + emaScoreBear

bullScore := math.min(bullScore, 100)
bearScore := math.min(bearScore, 100)

//--------------------------------------------------
// FILTERS
//--------------------------------------------------
breadthLongOk  = not useBreadthFilter or breadthBull >= 2
breadthShortOk = not useBreadthFilter or breadthBear >= 2

vixLongOk  = not useVixFilter or vix <= vixMaxBull
vixShortOk = not useVixFilter or vix >= vixMinBear

slopeLongOk  = not useSlopeFilter or bullSlope
slopeShortOk = not useSlopeFilter or bearSlope

flatOk = not avoidFlatMarket or not flatMarket

//--------------------------------------------------
// ENTRY LOGIC
//--------------------------------------------------
buySignal =
 bullPressure >= scoreEntryLevel and
 bullCount >= 4 and
 bullScore >= scoreEntryLevel and
 breadthLongOk and
 vixLongOk and
 slopeLongOk and
 flatOk

sellSignal =
 bearPressure >= scoreEntryLevel and
 bearCount >= 4 and
 bearScore >= scoreEntryLevel and
 breadthShortOk and
 vixShortOk and
 slopeShortOk and
 flatOk

//--------------------------------------------------
// STRATEGY ORDERS
//--------------------------------------------------
if buySignal and strategy.position_size <= 0
    strategy.close("Short")
    strategy.entry("Long", strategy.long)

if sellSignal and strategy.position_size >= 0
    strategy.close("Long")
    strategy.entry("Short", strategy.short)

//--------------------------------------------------
// EXITS
//--------------------------------------------------
longStop  = strategy.position_avg_price * (1 - stopLossPct / 100)
longLimit = strategy.position_avg_price * (1 + takeProfitPct / 100)

shortStop  = strategy.position_avg_price * (1 + stopLossPct / 100)
shortLimit = strategy.position_avg_price * (1 - takeProfitPct / 100)

strategy.exit("Long Exit",  from_entry="Long",  stop=longStop,  limit=longLimit)
strategy.exit("Short Exit", from_entry="Short", stop=shortStop, limit=shortLimit)

//--------------------------------------------------
// PLOTS
//--------------------------------------------------
plot(ema9,  "EMA 9",  color=color.green, linewidth=2)
plot(ema20, "EMA 20", color=color.red, linewidth=2)

plotshape(buySignal, title="ULTRA BUY", location=location.belowbar, color=color.green, style=shape.labelup, text="BUY", textcolor=color.white, size=size.small)
plotshape(sellSignal, title="ULTRA SELL", location=location.abovebar, color=color.red, style=shape.labeldown, text="SELL", textcolor=color.white, size=size.small)

//--------------------------------------------------
// DASHBOARD
//--------------------------------------------------
var table dash = table.new(position.top_center, 3, 7, border_width=1)

bullPressureColor = bullPressure > 0 ? color.lime : color.new(color.gray, 70)
bullBreadthColor  = breadthBull > 0 ? color.lime : color.new(color.gray, 70)
bullCountColor    = bullCount > 0 ? color.lime : color.new(color.gray, 70)

bearPressureColor = bearPressure > 0 ? color.red : color.new(color.gray, 70)
bearBreadthColor  = breadthBear > 0 ? color.red : color.new(color.gray, 70)
bearCountColor    = bearCount > 0 ? color.red : color.new(color.gray, 70)

scoreBullColor = bullScore > scoreEntryLevel ? color.lime : color.new(color.gray, 70)
scoreBearColor = bearScore > scoreEntryLevel ? color.red : color.new(color.gray, 70)

if barstate.islast and showDashboard
    table.cell(dash, 0, 0, "🟢 BULL", bgcolor=color.new(color.green, 70), text_color=color.white)
    table.cell(dash, 1, 0, "US FLOW", bgcolor=color.new(color.blue, 70), text_color=color.white)
    table.cell(dash, 2, 0, "🔴 BEAR", bgcolor=color.new(color.red, 70), text_color=color.white)

    table.cell(dash, 0, 1, "Pressure " + str.tostring(bullPressure, "#.0"), bgcolor=bullPressureColor, text_color=color.white)
    table.cell(dash, 1, 1, "VIX " + str.tostring(vix, "#.00"), text_color=color.yellow)
    table.cell(dash, 2, 1, "Pressure " + str.tostring(bearPressure, "#.0"), bgcolor=bearPressureColor, text_color=color.white)

    table.cell(dash, 0, 2, "Breadth " + str.tostring(breadthBull), bgcolor=bullBreadthColor, text_color=color.white)
    table.cell(dash, 1, 2, flatMarket ? "NO TRADE" : "ACTIVE", text_color=flatMarket ? color.orange : color.aqua)
    table.cell(dash, 2, 2, "Breadth " + str.tostring(breadthBear), bgcolor=bearBreadthColor, text_color=color.white)

    table.cell(dash, 0, 3, "Count " + str.tostring(bullCount), bgcolor=bullCountColor, text_color=color.white)
    table.cell(dash, 1, 3, "Slope " + str.tostring(ema9Slope, "#.000"), text_color=color.silver)
    table.cell(dash, 2, 3, "Count " + str.tostring(bearCount), bgcolor=bearCountColor, text_color=color.white)

    table.cell(dash, 0, 4, "Score " + str.tostring(bullScore, "#.0") + "%", bgcolor=scoreBullColor, text_color=color.white)
    table.cell(dash, 1, 4, buySignal ? "LONG" : sellSignal ? "SHORT" : "WAIT", text_color=buySignal ? color.lime : sellSignal ? color.red : color.orange)
    table.cell(dash, 2, 4, "Score " + str.tostring(bearScore, "#.0") + "%", bgcolor=scoreBearColor, text_color=color.white)

    table.cell(dash, 0, 5, "AAPL/MSFT/NVDA", text_color=color.white)
    table.cell(dash, 1, 5, "QQQ/SPY/IWM", text_color=color.white)
    table.cell(dash, 2, 5, "META/AMZN/TSLA", text_color=color.white)

    table.cell(dash, 0, 6, str.tostring(pc_aapl, "#.00") + " / " + str.tostring(pc_msft, "#.00") + " / " + str.tostring(pc_nvda, "#.00"), text_color=color.white)
    table.cell(dash, 1, 6, str.tostring(pc_googl, "#.00") + " / " + str.tostring(pc_meta, "#.00"), text_color=color.white)
    table.cell(dash, 2, 6, str.tostring(pc_amzn, "#.00") + " / " + str.tostring(pc_tsla, "#.00"), text_color=color.white)
